import * as signalR from '@microsoft/signalr';
import useAuthStore from '../stores/authStore';

class SignalRService {
  constructor() {
    this.connection = null;
    this.connectionState = 'Disconnected';
    this.currentAuctionId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  /**
   * Initialize the SignalR connection
   */
  async connect() {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR: Already connected');
      return true;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('SignalR: No authentication token available');
        return false;
      }

      // Build connection with JWT authentication
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5142/hubs/auction', {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 5s, 10s, 20s
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 5000;
            if (retryContext.previousRetryCount === 3) return 10000;
            return 20000;
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Setup connection event handlers
      this.setupConnectionHandlers();

      // Setup auction event handlers
      this.setupAuctionHandlers();

      // Start connection
      await this.connection.start();
      console.log('SignalR: Connected successfully');
      this.connectionState = 'Connected';
      this.reconnectAttempts = 0;

      return true;
    } catch (error) {
      console.error('SignalR: Connection failed', error);
      this.connectionState = 'Disconnected';
      return false;
    }
  }

  /**
   * Setup connection lifecycle handlers
   */
  setupConnectionHandlers() {
    this.connection.onclose((error) => {
      console.log('SignalR: Connection closed', error);
      this.connectionState = 'Disconnected';
      this.notifyListeners('connectionClosed', { error });
    });

    this.connection.onreconnecting((error) => {
      console.log('SignalR: Reconnecting...', error);
      this.connectionState = 'Reconnecting';
      this.notifyListeners('reconnecting', { error });
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR: Reconnected', connectionId);
      this.connectionState = 'Connected';
      this.reconnectAttempts = 0;

      // Rejoin the current auction if we were in one
      if (this.currentAuctionId) {
        this.joinAuction(this.currentAuctionId);
      }

      this.notifyListeners('reconnected', { connectionId });
    });
  }

  /**
   * Setup auction-specific event handlers
   */
  setupAuctionHandlers() {
    // Handle new bid placed
    this.connection.on('BidPlaced', (bidInfo) => {
      console.log('SignalR: Bid placed', bidInfo);
      this.notifyListeners('bidPlaced', bidInfo);
    });

    // Handle auction status changes
    this.connection.on('AuctionStatusChanged', (statusInfo) => {
      console.log('SignalR: Auction status changed', statusInfo);
      this.notifyListeners('auctionStatusChanged', statusInfo);
    });

    // Handle countdown updates
    this.connection.on('CountdownUpdate', (countdownInfo) => {
      this.notifyListeners('countdownUpdate', countdownInfo);
    });

    // Handle auction ended
    this.connection.on('AuctionEnded', (auctionEndInfo) => {
      console.log('SignalR: Auction ended', auctionEndInfo);
      this.notifyListeners('auctionEnded', auctionEndInfo);
    });

    // Handle join confirmation
    this.connection.on('JoinedAuction', (auctionId) => {
      console.log('SignalR: Successfully joined auction', auctionId);
      this.currentAuctionId = auctionId;
      this.notifyListeners('joinedAuction', { auctionId });
    });

    // Handle leave confirmation
    this.connection.on('LeftAuction', (auctionId) => {
      console.log('SignalR: Successfully left auction', auctionId);
      if (this.currentAuctionId === auctionId) {
        this.currentAuctionId = null;
      }
      this.notifyListeners('leftAuction', { auctionId });
    });
  }

  /**
   * Join a specific auction room
   */
  async joinAuction(auctionId) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error('SignalR: Cannot join auction - not connected');
      const connected = await this.connect();
      if (!connected) {
        return false;
      }
    }

    try {
      await this.connection.invoke('JoinAuction', auctionId);
      this.currentAuctionId = auctionId;
      console.log(`SignalR: Joined auction ${auctionId}`);
      return true;
    } catch (error) {
      console.error('SignalR: Failed to join auction', error);
      return false;
    }
  }

  /**
   * Leave a specific auction room
   */
  async leaveAuction(auctionId) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn('SignalR: Cannot leave auction - not connected');
      return;
    }

    try {
      await this.connection.invoke('LeaveAuction', auctionId);
      if (this.currentAuctionId === auctionId) {
        this.currentAuctionId = null;
      }
      console.log(`SignalR: Left auction ${auctionId}`);
    } catch (error) {
      console.error('SignalR: Failed to leave auction', error);
    }
  }

  /**
   * Disconnect from the hub
   */
  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR: Disconnected');
        this.connectionState = 'Disconnected';
        this.currentAuctionId = null;
      } catch (error) {
        console.error('SignalR: Error disconnecting', error);
      }
    }
  }

  /**
   * Subscribe to an event
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventName);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Notify all listeners of an event
   */
  notifyListeners(eventName, data) {
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`SignalR: Error in event listener for ${eventName}`, error);
        }
      });
    }
  }

  /**
   * Get connection state
   */
  getConnectionState() {
    return this.connectionState;
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connection && this.connection.state === signalR.HubConnectionState.Connected;
  }
}

// Export singleton instance
export const signalRService = new SignalRService();

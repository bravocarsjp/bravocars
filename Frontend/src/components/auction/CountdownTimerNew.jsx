import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimerNew = ({ endTime, status, onCountdownUpdate }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(endTime);
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0
        });
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const remaining = {
        days,
        hours,
        minutes,
        seconds,
        total: difference
      };

      setTimeRemaining(remaining);

      // Call parent callback if provided
      if (onCountdownUpdate) {
        onCountdownUpdate(remaining);
      }

      return remaining;
    };

    // Initial calculation
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onCountdownUpdate]);

  const getTimeColor = () => {
    if (!timeRemaining) return 'text-gray-400';
    const totalHours = timeRemaining.total / (1000 * 60 * 60);
    if (totalHours < 1) return 'text-red-500';
    if (totalHours < 24) return 'text-amber-500';
    return 'text-green-500';
  };

  const formatTimeLeft = () => {
    if (!timeRemaining || isExpired) return 'Ending...';

    const parts = [];
    if (timeRemaining.days > 0) {
      parts.push(`${timeRemaining.days}d`);
    }
    if (timeRemaining.hours > 0 || timeRemaining.days > 0) {
      parts.push(`${timeRemaining.hours}h`);
    }
    parts.push(`${timeRemaining.minutes}m`);

    return parts.join(' ');
  };

  if (status === 'Completed') {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <Clock className="w-5 h-5" />
        <span>Auction Ended</span>
      </div>
    );
  }

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center space-x-2 text-red-500">
        <Clock className="w-5 h-5" />
        <span>Auction Cancelled</span>
      </div>
    );
  }

  if (status === 'Scheduled') {
    return (
      <div className="flex items-center space-x-2 text-blue-400">
        <Clock className="w-5 h-5" />
        <span>Not Started</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`w-5 h-5 ${getTimeColor()}`} />
      <span className={`font-semibold ${getTimeColor()}`}>
        Ends in {formatTimeLeft()}
      </span>
    </div>
  );
};

export default CountdownTimerNew;

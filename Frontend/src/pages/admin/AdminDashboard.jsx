import React, { useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AuctionsManagement } from '../../components/admin/AuctionsManagement';
import { UsersManagement } from '../../components/admin/UsersManagement';
import { BiddingActivity } from '../../components/admin/BiddingActivity';
import { PendingApprovals } from '../../components/admin/PendingApprovals';
import { SettingsPanel } from '../../components/admin/SettingsPanel';
import { DashboardOverview } from '../../components/admin/DashboardOverview';

export const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch(currentView) {
      case 'overview':
        return <DashboardOverview />;
      case 'auctions':
        return <AuctionsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'activity':
        return <BiddingActivity />;
      case 'approvals':
        return <PendingApprovals />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <AdminSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
        />

        <main className={`flex-1 transition-all duration-300 min-h-screen ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8 pt-24 min-h-screen">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

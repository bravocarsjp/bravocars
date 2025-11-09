import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Settings, DollarSign, Clock, Mail } from 'lucide-react';

export const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    commissionRate: '5',
    defaultDuration: '7',
    minBidIncrement: '1000',
    platformFee: '2.5',
    emailNotifications: 'enabled',
    autoApproval: 'disabled'
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Platform settings have been updated successfully.");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2"><span className="text-amber-500">Settings</span></h1>
        <p className="text-gray-400">Configure platform settings and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Commission Settings */}
        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <DollarSign className="w-6 h-6 text-amber-500 mr-2" />
            Commission & Fees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="commissionRate" className="text-gray-300">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => setSettings({...settings, commissionRate: e.target.value})}
                className="bg-zinc-800 border-amber-500/20 text-white mt-2"
              />
              <p className="text-gray-500 text-xs mt-1">Percentage charged on successful sales</p>
            </div>
            <div>
              <Label htmlFor="platformFee" className="text-gray-300">Platform Fee ($)</Label>
              <Input
                id="platformFee"
                type="number"
                step="0.1"
                value={settings.platformFee}
                onChange={(e) => setSettings({...settings, platformFee: e.target.value})}
                className="bg-zinc-800 border-amber-500/20 text-white mt-2"
              />
              <p className="text-gray-500 text-xs mt-1">Fixed fee per transaction (%)</p>
            </div>
          </div>
        </div>

        {/* Auction Settings */}
        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 text-amber-500 mr-2" />
            Auction Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="defaultDuration" className="text-gray-300">Default Auction Duration</Label>
              <Select value={settings.defaultDuration} onValueChange={(value) => setSettings({...settings, defaultDuration: value})}>
                <SelectTrigger className="bg-zinc-800 border-amber-500/20 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minBidIncrement" className="text-gray-300">Minimum Bid Increment ($)</Label>
              <Input
                id="minBidIncrement"
                type="number"
                value={settings.minBidIncrement}
                onChange={(e) => setSettings({...settings, minBidIncrement: e.target.value})}
                className="bg-zinc-800 border-amber-500/20 text-white mt-2"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Mail className="w-6 h-6 text-amber-500 mr-2" />
            Notifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-300">Email Notifications</Label>
              <Select value={settings.emailNotifications} onValueChange={(value) => setSettings({...settings, emailNotifications: value})}>
                <SelectTrigger className="bg-zinc-800 border-amber-500/20 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Auto Approval</Label>
              <Select value={settings.autoApproval} onValueChange={(value) => setSettings({...settings, autoApproval: value})}>
                <SelectTrigger className="bg-zinc-800 border-amber-500/20 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-gray-500 text-xs mt-1">Automatically approve verified sellers</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8">
            <Settings className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

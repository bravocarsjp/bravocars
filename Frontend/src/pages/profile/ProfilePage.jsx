import { useState } from 'react';
import { User, Edit, Save, Lock, X, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import useAuthStore from '../../stores/authStore';
import userService from '../../services/userService';
import SEO from '../../components/SEO';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Seller':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Bidder':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Suspended':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const result = await userService.updateProfile(formData);

      if (result.success) {
        const updatedUser = { ...user, ...result.data };
        useAuthStore.getState().setUser(updatedUser);
        setSuccessMessage(result.message || 'Profile updated successfully!');
        setEditMode(false);

        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMessage('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    setErrorMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters!');
      return;
    }

    try {
      const result = await userService.changePassword(passwordData);

      if (result.success) {
        setSuccessMessage(result.message || 'Password changed successfully!');
        setPasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage(result.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setErrorMessage('Failed to change password');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setEditMode(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title="My Profile"
        description="Manage your BravoCar account settings and personal information"
      />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          My <span className="text-amber-500">Profile</span>
        </h1>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-400">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 text-center">
              {/* Avatar */}
              <div className="w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                {user?.firstName && user?.lastName ? (
                  <span className="text-5xl font-bold text-amber-500">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                ) : (
                  <User className="w-16 h-16 text-amber-500" />
                )}
              </div>

              {/* Name */}
              <h2 className="text-2xl font-bold text-white mb-2">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-400 mb-6 break-words">{user?.email}</p>

              {/* Roles/Status Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user?.role || user?.roles?.[0])}`}>
                  {user?.role || user?.roles?.[0] || 'User'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user?.status)}`}>
                  {user?.status || 'N/A'}
                </span>
              </div>

              {/* Change Password Button */}
              <Button
                onClick={() => setPasswordDialog(true)}
                variant="outline"
                className="w-full border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>

          {/* Account Information */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Account Information</h2>
                {!editMode ? (
                  <Button
                    onClick={() => setEditMode(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="border-amber-500/30 text-gray-400 hover:bg-zinc-800"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t border-amber-500/10 mb-6"></div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <Label className="text-gray-400 text-xs mb-2 block">First Name</Label>
                  {editMode ? (
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500"
                    />
                  ) : (
                    <p className="text-white font-semibold">{user?.firstName || 'N/A'}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <Label className="text-gray-400 text-xs mb-2 block">Last Name</Label>
                  {editMode ? (
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500"
                    />
                  ) : (
                    <p className="text-white font-semibold">{user?.lastName || 'N/A'}</p>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <Label className="text-gray-400 text-xs mb-2 block">Email Address</Label>
                  {editMode ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500"
                    />
                  ) : (
                    <p className="text-white font-semibold break-words">{user?.email || 'N/A'}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <Label className="text-gray-400 text-xs mb-2 block">Phone Number</Label>
                  {editMode ? (
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500"
                    />
                  ) : (
                    <p className="text-white font-semibold">{user?.phoneNumber || 'Not provided'}</p>
                  )}
                </div>

                {/* Role (read-only) */}
                <div>
                  <Label className="text-gray-400 text-xs mb-2 block">Role</Label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user?.role || user?.roles?.[0])}`}>
                    {user?.role || user?.roles?.[0] || 'N/A'}
                  </span>
                </div>

                {/* Account Status (read-only) */}
                <div>
                  <Label className="text-gray-400 text-xs mb-2 block">Account Status</Label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user?.status)}`}>
                    {user?.status || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Status Alerts */}
              {user?.status === 'Pending' && (
                <div className="mt-6 pt-6 border-t border-amber-500/10">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-yellow-500 font-semibold mb-1">Account Pending Approval</h3>
                      <p className="text-yellow-400/80 text-sm">
                        Your account is pending approval. You will be able to participate in auctions once an administrator approves your account.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {user?.status === 'Suspended' && (
                <div className="mt-6 pt-6 border-t border-amber-500/10">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-red-500 font-semibold mb-1">Account Suspended</h3>
                      <p className="text-red-400/80 text-sm">
                        Your account has been suspended. Please contact support for more information.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {passwordDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <Label htmlFor="currentPassword" className="text-gray-400 text-xs mb-2 block">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500"
                />
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="newPassword" className="text-gray-400 text-xs mb-2 block">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500"
                />
                <p className="text-gray-500 text-xs mt-1">At least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-400 text-xs mb-2 block">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Error Message in Modal */}
            {errorMessage && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => {
                  setPasswordDialog(false);
                  setErrorMessage('');
                }}
                variant="outline"
                className="flex-1 border-amber-500/30 text-gray-400 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold"
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

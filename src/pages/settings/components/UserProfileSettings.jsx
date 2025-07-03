import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const UserProfileSettings = ({ onNotification }) => {
  const [userProfile, setUserProfile] = useState({
    name: 'Admin User',
    email: 'admin@warehouse.com',
    role: 'Warehouse Manager',
    phone: '+1 (555) 123-4567',
    department: 'Operations',
    timezone: 'America/New_York'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleProfileChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Mock validation
    if (!userProfile.name || !userProfile.email) {
      onNotification('error', 'Name and email are required fields', 'Validation Error');
      return;
    }

    // Mock save
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    onNotification('success', 'Profile information updated successfully', 'Profile Updated');
  };

  const handleChangePassword = () => {
    // Mock validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      onNotification('error', 'All password fields are required', 'Validation Error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      onNotification('error', 'New passwords do not match', 'Validation Error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      onNotification('error', 'New password must be at least 8 characters long', 'Validation Error');
      return;
    }

    // Mock password change
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
    onNotification('success', 'Password changed successfully', 'Password Updated');
  };

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Moscow', label: 'Moscow Time (MSK)' }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Profile Information
        </h3>
        
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon name="User" size={32} color="var(--color-primary)" strokeWidth={2} />
          </div>
          <div>
            <button className="bg-secondary-100 text-text-primary px-4 py-2 rounded-lg font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 font-body">
              Change Photo
            </button>
            <p className="text-sm text-text-muted font-body mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={userProfile.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={userProfile.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Role
          </label>
          <input
            type="text"
            value={userProfile.role}
            onChange={(e) => handleProfileChange('role', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Department
          </label>
          <input
            type="text"
            value={userProfile.department}
            onChange={(e) => handleProfileChange('department', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Timezone
          </label>
          <select
            value={userProfile.timezone}
            onChange={(e) => handleProfileChange('timezone', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          >
            {timezoneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Save Profile Button */}
        <button
          onClick={handleSaveProfile}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Save" size={18} strokeWidth={2} />
            <span>Save Profile</span>
          </div>
        </button>
      </div>

      {/* Security Settings */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Security Settings
        </h3>
        
        {!showPasswordForm ? (
          <div className="p-4 bg-secondary-50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-text-primary font-body">Password</h4>
                <p className="text-sm text-text-secondary font-body">
                  Last changed 30 days ago
                </p>
              </div>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-secondary-100 text-text-primary px-4 py-2 rounded-lg font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 font-body"
              >
                Change Password
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4 bg-secondary-50 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-text-primary font-body">Change Password</h4>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="X" size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Current Password *
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                New Password *
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              />
              <p className="text-sm text-text-muted font-body mt-1">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              />
            </div>

            {/* Change Password Button */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleChangePassword}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
              >
                Update Password
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="bg-secondary-100 text-text-primary px-6 py-3 rounded-lg font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 font-body"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Session Management */}
        <div className="p-4 bg-secondary-50 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary font-body">Active Sessions</h4>
              <p className="text-sm text-text-secondary font-body">
                Manage your active login sessions
              </p>
            </div>
            <button className="bg-secondary-100 text-text-primary px-4 py-2 rounded-lg font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 font-body">
              View Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;
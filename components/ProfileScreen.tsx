'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { updateUserPassword, deleteUser } from '@/services/dbService';
import Card from './ui/Card';
import Button from './ui/Button';
import BackButton from './ui/BackButton';

const ProfileScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentUser) return;

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateUserPassword(currentUser.id, newPassword);
      setSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!currentUser) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone. Your account will be marked as inactive.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);
    try {
      await deleteUser(currentUser.id);
      logout();
      router.push('/auth');
    } catch (err: any) {
      setError(err.message || 'Failed to delete profile');
      setIsDeleting(false);
    }
  };

  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="animate-fadeIn mt-8">
      <div className="w-full max-w-2xl mx-auto mb-4">
        <BackButton />
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold font-orbitron text-white text-center mb-6">Profile Settings</h1>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 p-3 rounded-md mb-6">
            {success}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Info */}
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-orbitron text-white mb-4">Profile Information</h2>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-bold">Username:</span> {currentUser.username}
              </p>
              <p className="text-gray-300">
                <span className="font-bold">Status:</span> {currentUser.isActive !== false ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {/* Reset Password */}
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-orbitron text-white mb-4">Reset Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <Button type="submit" disabled={isUpdatingPassword} className="w-full">
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>

          {/* Delete Profile */}
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-700">
            <h2 className="text-2xl font-orbitron text-red-400 mb-4">Danger Zone</h2>
            <p className="text-gray-300 mb-4">
              Deleting your profile will mark your account as inactive. You will be logged out and cannot access your account anymore.
            </p>
            <Button
              onClick={handleDeleteProfile}
              disabled={isDeleting}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Profile'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileScreen;
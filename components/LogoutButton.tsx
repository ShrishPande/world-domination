'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import LogoutIcon from './icons/LogoutIcon';

const LogoutButton: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on auth page
  if (pathname === '/auth') {
    return null;
  }

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-50 bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      title="Logout"
    >
      <LogoutIcon className="w-5 h-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
};

export default LogoutButton;
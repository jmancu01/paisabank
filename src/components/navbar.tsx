'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/supabase/auth/auth-client';

interface NavbarProps {
  initialTab?: 'home' | 'movements' | 'profile';
}

export const Navbar = ({ initialTab }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab || 'home');

  // Update active tab based on pathname
  useEffect(() => {
    if (pathname === '/' || pathname === '/dashboard') {
      setActiveTab('home');
    } else if (pathname === '/notes' || pathname.includes('/movements')) {
      setActiveTab('movements');
    } else if (pathname === '/profile' || pathname.includes('/profile')) {
      setActiveTab('profile');
    }
  }, [pathname]);

  // Logout handler function
  const handleLogout = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await authClient.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white shadow-lg rounded-t-xl border-t border-gray-100">
      <div className="flex justify-around items-center p-3">
        {/* Home Icon */}
        <Link href="/dashboard">
          <div
            className="flex flex-col items-center"
            onClick={() => setActiveTab('home')}
          >
            <svg
              className={`w-6 h-6 ${activeTab === 'home' ? 'text-blue-500' : 'text-gray-500'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={activeTab === 'home' ? 2 : 1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        </Link>

        {/* Notes/Lists Icon */}
        <Link href="/movements">
          <div
            className="flex flex-col items-center"
            onClick={() => setActiveTab('movements')}
          >
            <svg
              className={`w-6 h-6 ${activeTab === 'movements' ? 'text-blue-500' : 'text-gray-500'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={activeTab === 'movements' ? 2 : 1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </Link>

        {/* Logout Icon */}
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={handleLogout}
        >
          <svg
            className={`w-6 h-6 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-500'}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={activeTab === 'profile' ? 2 : 1.5}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

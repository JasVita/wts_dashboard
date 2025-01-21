'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, LayoutDashboard, Sparkles, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-16 bg-white border-r flex flex-col justify-between py-4">
        <div className="flex flex-col items-center space-y-4">
          <Link
            href="/portal/chats"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-[#2563eb]" />
          </Link>
          <Link
            href="/portal/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-6 h-6 text-[#2563eb]" />
          </Link>
          <Link
            href="/portal/playground"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Sparkles className="w-6 h-6 text-[#2563eb]" />
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </nav>
      {children}
    </div>
  );
}
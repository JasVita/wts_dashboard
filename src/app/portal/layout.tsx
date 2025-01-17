'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { MessageSquare, LayoutDashboard, Sparkles, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await db.getCurrentUser();
      if (!user) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await db.signOut();
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
            <MessageSquare className="w-6 h-6" />
          </Link>
          <Link
            href="/portal/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-6 h-6" />
          </Link>
          <Link
            href="/portal/playground"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Sparkles className="w-6 h-6" />
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
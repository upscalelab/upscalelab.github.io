'use client';

import { useAuthStore } from '@/src/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StartupSidebar } from '@/src/components/StartupSidebar';

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Verificar se usuário é startup
    if (user && user.role !== 'startup') {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex h-screen bg-dark-bg">
      <StartupSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

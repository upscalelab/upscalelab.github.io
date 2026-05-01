'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export function PageLayout({
  children,
  title,
  description,
  showBackButton = true,
  backPath = '/dashboard',
}: PageLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-dark-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header com botão voltar */}
        {showBackButton && (
          <div className="bg-dark-card border-b border-dark-border px-8 py-4 flex items-center gap-4">
            <button
              onClick={() => router.push(backPath)}
              className="p-2 hover:bg-dark-bg4 rounded-lg transition-colors group"
              title="Voltar ao Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-text-muted group-hover:text-orange-upscale transition-colors" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
              {description && <p className="text-sm text-text-muted">{description}</p>}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAuthStore } from '@/src/store/authStore';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BookOpen,
  MessageSquare,
  Video,
  BarChart3,
  LogOut,
  Rocket,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuSections = [
  {
    section: 'ADMINISTRAÇÃO',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/dashboard',
        roles: ['admin', 'mentor'],
      },
      {
        icon: Briefcase,
        label: 'Projetos',
        href: '/projects',
        roles: ['admin', 'mentor', 'startup'],
      },
      {
        icon: Users,
        label: 'Mentores',
        href: '/mentors',
        roles: ['admin'],
      },
      {
        icon: BookOpen,
        label: 'Cursos (Ignite)',
        href: '/courses',
        roles: ['admin', 'startup'],
      },
      {
        icon: Video,
        label: 'Reuniões',
        href: '/meetings',
        roles: ['admin', 'mentor', 'startup'],
      },
      {
        icon: MessageSquare,
        label: 'Chat',
        href: '/chat',
        roles: ['admin', 'mentor', 'startup'],
      },
      {
        icon: BarChart3,
        label: 'Relatórios',
        href: '/reports',
        roles: ['admin'],
      },
      {
        icon: Users,
        label: 'Mentorias',
        href: '/mentorship',
        roles: ['admin', 'mentor', 'startup'],
      },
      {
        icon: Bell,
        label: 'Notificações',
        href: '/notifications',
        roles: ['admin', 'mentor', 'startup'],
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">UpScale Lab</h1>
            <p className="text-xs text-slate-400">Aceleração</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuSections.map((section) => (
          <div key={section.section} className="mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items
                .filter((item) => item.roles.includes(user?.role || 'admin'))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                        isActive
                          ? 'bg-orange-900/40 text-orange-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <div className="absolute right-4 w-2 h-2 bg-orange-400 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-dark-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || 'F'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Felipe Froes'}</p>
            <p className="text-xs text-slate-400 truncate">
              {user?.role === 'admin' ? 'Administrador' : user?.role === 'mentor' ? 'Mentor' : 'Startup'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            window.location.href = '/auth/login';
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

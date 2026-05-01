'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, Archive, Check, CheckCheck, Settings } from 'lucide-react';
import { useNotifications } from '@/src/hooks/useNotifications';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, archive, archiveAll } = useNotifications();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      'new-inscription': '📝',
      'project-update': '📊',
      'stage-change': '🔄',
      'mentor-assigned': '👥',
      'meeting-scheduled': '📅',
      'course-completed': '🎓',
      'submission-received': '📤',
      'submission-graded': '⭐',
      'message-received': '💬',
      'system-alert': '⚠️',
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      orange: 'bg-orange-upscale/10 border-orange-upscale/20 text-orange-upscale',
      green: 'bg-green-upscale/10 border-green-upscale/20 text-green-upscale-light',
      red: 'bg-red-500/10 border-red-500/20 text-red-400',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={cn('relative', className)}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-dark-bg4 rounded-lg transition-colors group"
        title="Notificações"
      >
        <Bell className="w-5 h-5 text-text-muted group-hover:text-orange-upscale transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 bg-dark-card border border-dark-border rounded-lg shadow-2xl z-50 flex flex-col max-h-96"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-border">
            <div>
              <h3 className="font-bold text-text-primary">Notificações</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-orange-upscale">{unreadCount} não lidas</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 hover:bg-dark-bg4 rounded transition-colors"
                title="Configurações"
              >
                <Settings className="w-4 h-4 text-text-muted hover:text-orange-upscale" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-dark-bg4 rounded transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          {!showSettings && (
            <>
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-text-muted/30 mx-auto mb-2" />
                    <p className="text-text-muted text-sm">Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="divide-y divide-dark-border">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 hover:bg-dark-bg3 transition-colors cursor-pointer border-l-4',
                          notification.status === 'unread'
                            ? 'bg-dark-bg3 border-l-orange-upscale'
                            : 'border-l-transparent'
                        )}
                        onClick={() => {
                          if (notification.status === 'unread') {
                            markAsRead(notification.id);
                          }
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl;
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <span className="text-2xl flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-text-primary text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-text-muted mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-text-muted/50 mt-2">
                              {new Date(notification.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {notification.status === 'unread' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 hover:bg-dark-border rounded transition-colors"
                                title="Marcar como lido"
                              >
                                <Check className="w-4 h-4 text-blue-400" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                archive(notification.id);
                              }}
                              className="p-1 hover:bg-dark-border rounded transition-colors"
                              title="Arquivar"
                            >
                              <Archive className="w-4 h-4 text-text-muted hover:text-orange-upscale" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-dark-border p-3 flex gap-2 bg-dark-bg3">
                  <button
                    onClick={markAllAsRead}
                    className="flex-1 px-3 py-2 text-xs font-medium text-text-primary hover:bg-dark-border rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Marcar tudo como lido
                  </button>
                  <button
                    onClick={archiveAll}
                    className="flex-1 px-3 py-2 text-xs font-medium text-text-primary hover:bg-dark-border rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Archive className="w-3 h-3" />
                    Arquivar tudo
                  </button>
                </div>
              )}
            </>
          )}

          {/* Settings */}
          {showSettings && (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <h4 className="font-semibold text-text-primary text-sm mb-3">
                  Notificações por Canal
                </h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-bg4 p-2 rounded">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <span className="text-text-primary">No App</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-bg4 p-2 rounded">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <span className="text-text-primary">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-bg4 p-2 rounded">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <span className="text-text-primary">Push (Navegador)</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-text-primary text-sm mb-3">
                  Tipos de Notificação
                </h4>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Novas Inscrições', key: 'new-inscription' },
                    { label: 'Atualizações de Projetos', key: 'project-update' },
                    { label: 'Mudanças de Etapa', key: 'stage-change' },
                    { label: 'Mentores Atribuídos', key: 'mentor-assigned' },
                    { label: 'Reuniões Agendadas', key: 'meeting-scheduled' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer hover:bg-dark-bg4 p-2 rounded">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-text-primary">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors text-sm font-medium">
                Salvar Preferências
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

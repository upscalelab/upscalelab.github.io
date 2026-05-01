'use client';

import { useState } from 'react';
import { Bell, Filter, Archive, Check, Trash2, Settings } from 'lucide-react';
import { PageLayout } from '@/src/components/PageLayout';
import { useNotifications } from '@/src/hooks/useNotifications';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'unread' | 'read' | 'archived';
type NotificationType = 'all' | 'new-inscription' | 'project-update' | 'stage-change' | 'mentor-assigned' | 'meeting-scheduled' | 'course-completed' | 'submission-received' | 'submission-graded' | 'message-received' | 'system-alert';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, archive, archiveAll } = useNotifications();
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [filterType, setFilterType] = useState<NotificationType>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Filtrar notificações
  const filteredNotifications = notifications.filter((n) => {
    if (filterStatus === 'unread' && n.status !== 'unread') return false;
    if (filterStatus === 'read' && n.status !== 'read') return false;
    if (filterStatus === 'archived' && n.status !== 'archived') return false;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  // Ordenar
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

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

  const getNotificationTitle = (type: string) => {
    const titles: Record<string, string> = {
      'new-inscription': 'Nova Inscrição',
      'project-update': 'Atualização de Projeto',
      'stage-change': 'Mudança de Etapa',
      'mentor-assigned': 'Mentor Atribuído',
      'meeting-scheduled': 'Reunião Agendada',
      'course-completed': 'Curso Concluído',
      'submission-received': 'Envio Recebido',
      'submission-graded': 'Envio Avaliado',
      'message-received': 'Mensagem Recebida',
      'system-alert': 'Alerta do Sistema',
    };
    return titles[type] || 'Notificação';
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
    <PageLayout
      title="Centro de Notificações"
      description="Gerencie todas as suas notificações e preferências"
      showBackButton={true}
      backPath="/dashboard"
    >
      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Total de Notificações</p>
            <p className="text-3xl font-bold text-orange-upscale">{notifications.length}</p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Não Lidas</p>
            <p className="text-3xl font-bold text-blue-400">
              {notifications.filter((n) => n.status === 'unread').length}
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Lidas</p>
            <p className="text-3xl font-bold text-green-upscale-light">
              {notifications.filter((n) => n.status === 'read').length}
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Arquivadas</p>
            <p className="text-3xl font-bold text-text-muted">
              {notifications.filter((n) => n.status === 'archived').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <Filter className="w-5 h-5 text-orange-upscale" />
              Filtros
            </h3>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="px-3 py-1 text-xs bg-dark-bg4 hover:bg-dark-border text-text-primary rounded transition-colors"
              >
                Marcar tudo como lido
              </button>
              <button
                onClick={archiveAll}
                className="px-3 py-1 text-xs bg-dark-bg4 hover:bg-dark-border text-text-primary rounded transition-colors"
              >
                Arquivar tudo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterType)}
                className="w-full px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-orange-upscale"
              >
                <option value="all">Todas</option>
                <option value="unread">Não Lidas</option>
                <option value="read">Lidas</option>
                <option value="archived">Arquivadas</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Tipo</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as NotificationType)}
                className="w-full px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-orange-upscale"
              >
                <option value="all">Todos</option>
                <option value="new-inscription">Novas Inscrições</option>
                <option value="project-update">Atualizações de Projetos</option>
                <option value="stage-change">Mudanças de Etapa</option>
                <option value="mentor-assigned">Mentores Atribuídos</option>
                <option value="meeting-scheduled">Reuniões Agendadas</option>
                <option value="course-completed">Cursos Concluídos</option>
                <option value="submission-received">Envios Recebidos</option>
                <option value="submission-graded">Envios Avaliados</option>
                <option value="message-received">Mensagens Recebidas</option>
                <option value="system-alert">Alertas do Sistema</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Ordenar</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="w-full px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-orange-upscale"
              >
                <option value="newest">Mais Recentes</option>
                <option value="oldest">Mais Antigas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {sortedNotifications.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-lg p-12 text-center">
              <Bell className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
              <p className="text-text-muted text-lg">Nenhuma notificação encontrada</p>
              <p className="text-text-muted/50 text-sm mt-2">Você está em dia com suas notificações!</p>
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'bg-dark-card border rounded-lg p-6 transition-all hover:border-orange-upscale',
                  notification.status === 'unread'
                    ? 'border-orange-upscale/50 bg-dark-bg3'
                    : 'border-dark-border'
                )}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0', getNotificationColor(notification.color))}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-text-primary">{notification.title}</h3>
                        <p className="text-sm text-text-muted mt-1">{notification.message}</p>
                        <p className="text-xs text-text-muted/50 mt-2">
                          {new Date(notification.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={cn(
                          'text-xs font-bold px-2 py-1 rounded whitespace-nowrap flex-shrink-0',
                          notification.status === 'unread'
                            ? 'bg-orange-upscale/20 text-orange-upscale'
                            : notification.status === 'read'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-text-muted/20 text-text-muted'
                        )}
                      >
                        {notification.status === 'unread' && 'Não Lida'}
                        {notification.status === 'read' && 'Lida'}
                        {notification.status === 'archived' && 'Arquivada'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {notification.actionUrl && (
                      <button
                        onClick={() => (window.location.href = notification.actionUrl!)}
                        className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Ver
                      </button>
                    )}
                    {notification.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-dark-bg4 rounded transition-colors"
                        title="Marcar como lido"
                      >
                        <Check className="w-4 h-4 text-blue-400" />
                      </button>
                    )}
                    <button
                      onClick={() => archive(notification.id)}
                      className="p-2 hover:bg-dark-bg4 rounded transition-colors"
                      title="Arquivar"
                    >
                      <Archive className="w-4 h-4 text-text-muted hover:text-orange-upscale" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}

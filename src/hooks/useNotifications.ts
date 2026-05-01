'use client';

import { useEffect, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'new-inscription' | 'project-update' | 'stage-change' | 'mentor-assigned' | 'meeting-scheduled' | 'course-completed' | 'submission-received' | 'submission-graded' | 'message-received' | 'system-alert';
  title: string;
  message: string;
  icon: string;
  color: 'blue' | 'orange' | 'green' | 'red';
  status: 'unread' | 'read' | 'archived';
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar notificações iniciais
  useEffect(() => {
    fetchNotifications();
    // Conectar WebSocket para notificações em tempo real
    connectWebSocket();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = () => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/api/notifications/ws`);

      ws.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Mostrar notificação do navegador
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: `/icons/${notification.icon}.svg`,
            tag: notification.id,
          });
        }
      };

      ws.onerror = (error) => {
        console.error('Erro WebSocket:', error);
      };

      return () => ws.close();
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
    }
  };

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, status: 'read' as const } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: 'read' as const }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todos como lido:', error);
    }
  }, []);

  const archive = useCallback(async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/archive`, { method: 'POST' });
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Erro ao arquivar notificação:', error);
    }
  }, []);

  const archiveAll = useCallback(async () => {
    try {
      await fetch('/api/notifications/archive-all', { method: 'POST' });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao arquivar todas:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    archive,
    archiveAll,
    refresh: fetchNotifications,
  };
}

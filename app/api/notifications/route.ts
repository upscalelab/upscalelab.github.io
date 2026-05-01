import { NextRequest, NextResponse } from 'next/server';

// Mock de notificações (em produção, viria do banco de dados)
const mockNotifications = [
  {
    id: '1',
    type: 'new-inscription' as const,
    title: 'Nova Inscrição - AgroSense AI',
    message: 'Uma nova startup se inscreveu no programa Ignite Up',
    icon: 'inbox',
    color: 'orange' as const,
    status: 'unread' as const,
    actionUrl: '/projects',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    type: 'stage-change' as const,
    title: 'Mudança de Etapa - Saúde+ Connect',
    message: 'Projeto movido para etapa de Aceleração',
    icon: 'arrow-right',
    color: 'green' as const,
    status: 'unread' as const,
    actionUrl: '/projects',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    type: 'mentor-assigned' as const,
    title: 'Mentor Atribuído - LogiTrack 360',
    message: 'Dr. Carlos Silva foi atribuído como mentor estratégico',
    icon: 'user-plus',
    color: 'blue' as const,
    status: 'read' as const,
    actionUrl: '/mentors',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: '4',
    type: 'submission-received' as const,
    title: 'Envio Recebido - AgroSense AI',
    message: 'Módulo 1 do Ignite Up foi enviado para avaliação',
    icon: 'upload',
    color: 'orange' as const,
    status: 'read' as const,
    actionUrl: '/courses',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: '5',
    type: 'meeting-scheduled' as const,
    title: 'Reunião Agendada',
    message: 'Triagem com AgroSense AI agendada para amanhã às 10:00',
    icon: 'calendar',
    color: 'green' as const,
    status: 'read' as const,
    actionUrl: '/meetings',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    // Em produção, buscar do banco de dados com base no usuário autenticado
    const unreadCount = mockNotifications.filter((n) => n.status === 'unread').length;

    return NextResponse.json({
      notifications: mockNotifications,
      unreadCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

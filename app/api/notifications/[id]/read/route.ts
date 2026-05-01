import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;

    // Em produção, atualizar no banco de dados
    console.log(`Notificação ${notificationId} marcada como lida`);

    return NextResponse.json({
      success: true,
      message: 'Notificação marcada como lida',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}

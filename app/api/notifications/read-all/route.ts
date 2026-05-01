import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Em produção, atualizar no banco de dados
    console.log('Todas as notificações marcadas como lidas');

    return NextResponse.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark all notifications as read' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Em produção, atualizar no banco de dados
    console.log('Todas as notificações arquivadas');

    return NextResponse.json({
      success: true,
      message: 'Todas as notificações foram arquivadas',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to archive all notifications' }, { status: 500 });
  }
}

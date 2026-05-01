import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;

    // Em produção, atualizar no banco de dados
    console.log(`Notificação ${notificationId} arquivada`);

    return NextResponse.json({
      success: true,
      message: 'Notificação arquivada',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to archive notification' }, { status: 500 });
  }
}

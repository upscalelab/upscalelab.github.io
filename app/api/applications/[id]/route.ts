import { NextRequest, NextResponse } from 'next/server';

interface UpdateData {
  status: 'pending-validation' | 'approved' | 'rejected';
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateData = await request.json();
    const { id } = params;

    // TODO: Verificar se usuário é admin
    // TODO: Atualizar no banco de dados

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso',
      applicationId: id,
      newStatus: body.status,
    });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar aplicação' },
      { status: 500 }
    );
  }
}

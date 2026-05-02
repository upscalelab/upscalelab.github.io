import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Verificar se usuário tem permissão para deletar
    // TODO: Deletar do banco de dados
    // TODO: Deletar arquivo do servidor

    // Exemplo de deleção de arquivo
    try {
      const filepath = join(process.cwd(), 'public', 'uploads', 'documents', id);
      await unlink(filepath);
    } catch (error) {
      console.error('File deletion error:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Documento deletado com sucesso',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar documento' },
      { status: 500 }
    );
  }
}

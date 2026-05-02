import { NextRequest, NextResponse } from 'next/server';

interface AssinafyCallback {
  sessionId: string;
  documentId: string;
  status: 'signed' | 'rejected' | 'expired';
  signedBy: string;
  signedAt: string;
  signature: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AssinafyCallback = await request.json();

    // TODO: Verificar assinatura do webhook (segurança)
    // TODO: Atualizar status do documento no banco de dados
    // TODO: Salvar assinatura

    if (body.status === 'signed') {
      // Documento foi assinado com sucesso
      console.log(`Documento ${body.documentId} assinado por ${body.signedBy}`);

      // TODO: Atualizar documento no banco
      // await db.update(documents)
      //   .set({
      //     status: 'signed',
      //     signedBy: body.signedBy,
      //     signedAt: body.signedAt,
      //     signature: body.signature,
      //   })
      //   .where(eq(documents.id, body.documentId));
    } else if (body.status === 'rejected') {
      // Assinatura foi rejeitada
      console.log(`Assinatura rejeitada para documento ${body.documentId}`);
    } else if (body.status === 'expired') {
      // Sessão expirou
      console.log(`Sessão de assinatura expirou para documento ${body.documentId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Callback processado com sucesso',
    });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar callback' },
      { status: 500 }
    );
  }
}

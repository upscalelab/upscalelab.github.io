import { NextRequest, NextResponse } from 'next/server';

interface SignRequest {
  method: 'assinafy' | 'govbr';
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: SignRequest = await request.json();
    const { id } = params;

    if (body.method === 'assinafy') {
      // Integração com Assinafy
      // TODO: Implementar chamada à API do Assinafy

      // Exemplo de resposta (você precisa de uma API Key do Assinafy)
      const assinafyApiKey = process.env.ASSINAFY_API_KEY;
      const assinafyApiUrl = 'https://api.assinafy.com/v1';

      if (!assinafyApiKey) {
        return NextResponse.json(
          { error: 'Assinafy não configurado' },
          { status: 500 }
        );
      }

      try {
        // Criar sessão de assinatura no Assinafy
        const response = await fetch(`${assinafyApiUrl}/signatures`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${assinafyApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: id,
            signers: [
              {
                email: 'user@example.com', // TODO: Pegar do usuário logado
                name: 'User Name', // TODO: Pegar do usuário logado
              },
            ],
            callbackUrl: `${process.env.NEXTAUTH_URL}/api/documents/callback`,
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar sessão de assinatura');
        }

        const data = await response.json();

        return NextResponse.json({
          success: true,
          signatureUrl: data.signatureUrl,
          sessionId: data.sessionId,
        });
      } catch (error) {
        console.error('Assinafy error:', error);
        return NextResponse.json(
          { error: 'Erro ao integrar com Assinafy' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Método de assinatura não suportado' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Sign error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar assinatura' },
      { status: 500 }
    );
  }
}

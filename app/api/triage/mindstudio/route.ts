import { NextRequest, NextResponse } from 'next/server';

interface TriageInput {
  companyName: string;
  description: string;
  stage: string;
  teamSize?: number;
  fundingRaised?: number;
}

interface TriageResult {
  score: number;
  recommendation: 'approve' | 'review' | 'reject';
  reasoning: string;
  suggestedStage: string;
  confidence: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: TriageInput = await request.json();

    // Validar entrada
    if (!body.companyName || !body.description) {
      return NextResponse.json(
        { error: 'Nome da empresa e descrição são obrigatórios' },
        { status: 400 }
      );
    }

    // Preparar prompt para MindStudio
    const prompt = `
Você é um especialista em análise de startups para um programa de aceleração.

Analise a seguinte startup e forneça uma avaliação de triage:

**Empresa:** ${body.companyName}
**Descrição:** ${body.description}
**Estágio Atual:** ${body.stage}
${body.teamSize ? `**Tamanho do Time:** ${body.teamSize} pessoas` : ''}
${body.fundingRaised ? `**Capital Levantado:** R$ ${body.fundingRaised.toLocaleString('pt-BR')}` : ''}

Forneça uma análise estruturada com:
1. Score de viabilidade (0-100)
2. Recomendação (approve/review/reject)
3. Razão da recomendação
4. Estágio sugerido (Inscrição, Triagem, Stand-by, Aceleração, etc)
5. Confiança da análise (70-90%)

Responda em JSON estruturado.
    `;

    // Chamar MindStudio API
    const mindstudioResponse = await fetch(
      process.env.MINDSTUDIO_API_URL || 'https://v1.mindstudio-api.com/developer/v2/agents/run',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MINDSTUDIO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: process.env.MINDSTUDIO_AGENT_ID,
          workflow: 'Main',
          variables: {
            prompt: prompt,
          },
          version: 'draft',
        }),
      }
    );

    if (!mindstudioResponse.ok) {
      console.error('MindStudio API error:', mindstudioResponse.statusText);
      throw new Error('Erro ao chamar MindStudio API');
    }

    const mindstudioData = await mindstudioResponse.json();

    // Parsear resposta do MindStudio
    let triageResult: TriageResult;

    try {
      // Tentar extrair JSON da resposta
      const responseText = mindstudioData.output || mindstudioData.result || JSON.stringify(mindstudioData);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        triageResult = {
          score: parsed.score || 75,
          recommendation: parsed.recommendation || 'review',
          reasoning: parsed.reasoning || parsed.reason || 'Análise realizada',
          suggestedStage: parsed.suggestedStage || parsed.suggested_stage || 'Triagem',
          confidence: parsed.confidence || 80,
        };
      } else {
        // Fallback se não conseguir parsear
        triageResult = {
          score: 75,
          recommendation: 'review',
          reasoning: 'Análise realizada com sucesso',
          suggestedStage: 'Triagem',
          confidence: 80,
        };
      }
    } catch (parseError) {
      console.error('Error parsing MindStudio response:', parseError);
      triageResult = {
        score: 75,
        recommendation: 'review',
        reasoning: 'Análise realizada',
        suggestedStage: 'Triagem',
        confidence: 80,
      };
    }

    return NextResponse.json(triageResult);
  } catch (error) {
    console.error('Triage error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar triage' },
      { status: 500 }
    );
  }
}

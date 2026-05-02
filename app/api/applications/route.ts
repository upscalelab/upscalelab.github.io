import { NextRequest, NextResponse } from 'next/server';

interface ApplicationData {
  companyName: string;
  description: string;
  website?: string;
  teamSize: number;
  marketSize: string;
  fundingNeeded: number;
  program: string;
  userEmail: string;
  userName: string;
  triageScore: number;
  triageRecommendation: string;
  triageDetails: string;
  status: string;
}

// Mock database - em produção, usar banco de dados real
const applications: ApplicationData[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: ApplicationData = await request.json();

    // Validar dados obrigatórios
    if (!body.companyName || !body.description || !body.userEmail) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Salvar aplicação
    applications.push(body);

    // TODO: Salvar no banco de dados real (PostgreSQL via Drizzle)
    // const result = await db.insert(applications).values(body);

    return NextResponse.json({
      success: true,
      message: 'Aplicação salva com sucesso',
      application: body,
    });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar aplicação' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar filtros e paginação
    // TODO: Verificar se usuário é admin

    return NextResponse.json({
      applications: applications,
      total: applications.length,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar aplicações' },
      { status: 500 }
    );
  }
}

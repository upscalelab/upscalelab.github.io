# Integração com MindStudio - Guia Técnico

## Visão Geral

A plataforma UpScale Lab está preparada para integração com **MindStudio** para automação inteligente de triagem e qualificação de funil. Este documento descreve os pontos de integração e como implementar a conexão.

## Arquitetura de Integração

```
┌─────────────────────┐
│  UpScale Lab        │
│  (Frontend/Backend) │
└──────────┬──────────┘
           │
           │ API Calls
           ▼
┌─────────────────────┐
│  MindStudio API     │
│  (Agentes de IA)    │
└─────────────────────┘
```

## Endpoints de Integração

### 1. Qualificação de Projeto

**Endpoint:** `POST /api/ai/qualify-project`

Qualifica um novo projeto usando IA para análise automática.

**Request:**
```json
{
  "projectId": "proj-123",
  "projectName": "AgroSense AI",
  "description": "Plataforma de IA para agricultura",
  "program": "ignite-up",
  "documents": ["url-1", "url-2"],
  "founderEmail": "founder@example.com"
}
```

**Response:**
```json
{
  "score": 85,
  "recommendation": "approve",
  "feedback": "Projeto com potencial interessante",
  "suggestedMentors": ["Felipe Froes", "Ana Costa"],
  "nextSteps": [
    "Agendar entrevista",
    "Solicitar documentação"
  ]
}
```

### 2. Análise de Documentos

**Endpoint:** `POST /api/ai/analyze-documents`

Analisa documentos do projeto (pitch deck, business plan, etc).

**Request:**
```json
{
  "projectId": "proj-123",
  "documents": ["url-1", "url-2"]
}
```

**Response:**
```json
{
  "summary": "Documentação completa e bem estruturada",
  "keyInsights": ["TAM $2.5B", "Equipe experiente"],
  "risks": ["Concorrência forte"],
  "opportunities": ["Expansão internacional"]
}
```

### 3. Recomendação de Mentores

**Endpoint:** `POST /api/ai/recommend-mentors`

Recomenda mentores baseado no perfil do projeto.

**Request:**
```json
{
  "projectId": "proj-123",
  "projectDescription": "Plataforma de IA para agricultura"
}
```

**Response:**
```json
{
  "mentors": [
    {
      "mentorId": "1",
      "mentorName": "Felipe Froes",
      "specialty": "Estratégia & Negócios",
      "matchScore": 0.92,
      "reason": "Experiência em startups de tech agrícola"
    }
  ]
}
```

### 4. Agendamento de Triagem com IA

**Endpoint:** `POST /api/ai/schedule-screening`

Agenda uma reunião de triagem automática com agente de IA.

**Request:**
```json
{
  "projectId": "proj-123",
  "projectName": "AgroSense AI",
  "founderEmail": "founder@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "meetingId": "meeting-123",
  "scheduledTime": "2026-03-10T10:00:00Z",
  "aiAgentName": "MindStudio Screening Agent",
  "instructions": "A reunião será conduzida por um agente de IA..."
}
```

### 5. Análise de Funil

**Endpoint:** `GET /api/ai/analyze-funnel`

Fornece análise inteligente do funil de projetos.

**Response:**
```json
{
  "conversionRates": {
    "inscricao-triagem": 0.75,
    "triagem-validacao": 0.8
  },
  "bottlenecks": [
    "Fase de triagem tem taxa de rejeição alta"
  ],
  "recommendations": [
    "Melhorar critérios de triagem"
  ],
  "predictedOutcome": {
    "successRate": 0.42,
    "averageTimeToExit": 6
  }
}
```

## Implementação

### 1. Configurar Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_MINDSTUDIO_API_URL=https://api.mindstudio.com
NEXT_PUBLIC_MINDSTUDIO_API_KEY=your_api_key
NEXT_PUBLIC_MINDSTUDIO_AGENT_ID=your_agent_id
```

### 2. Usar o Hook de IA

```typescript
import { useAIQualification } from '@/src/hooks/useAIQualification';

export function ProjectQualification() {
  const { qualifyProject } = useAIQualification();

  const handleQualify = async () => {
    try {
      const result = await qualifyProject({
        projectId: 'proj-123',
        projectName: 'AgroSense AI',
        description: 'Plataforma de IA para agricultura',
        program: 'ignite-up',
      });

      console.log('Qualificação:', result);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <button onClick={handleQualify}>
      Qualificar com IA
    </button>
  );
}
```

### 3. Criar Endpoint Backend

```typescript
// app/api/ai/qualify-project/route.ts
import { qualifyProject } from '@/src/hooks/useAIQualification';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const result = await qualifyProject(body);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: 'Erro ao qualificar' },
      { status: 500 }
    );
  }
}
```

## Fluxo de Triagem Automática

```
1. Novo Projeto Inscrito
   ↓
2. Qualificação Automática com IA
   ├─ Análise de Documentos
   ├─ Cálculo de Score
   └─ Recomendação (Approve/Review/Reject)
   ↓
3. Se Aprovado: Agendar Triagem com IA
   ├─ Entrevista Automática
   ├─ Coleta de Informações
   └─ Recomendação de Mentores
   ↓
4. Validação Manual (se necessário)
   ├─ Admin revisa resultado
   └─ Aprova ou Rejeita
   ↓
5. Projeto Entra no Pipeline
```

## Casos de Uso

### Caso 1: Triagem Automática de Inscrições

```typescript
// Quando um novo projeto é inscrito
const newProject = await createProject(data);

// Qualificar automaticamente
const qualification = await qualifyProject({
  projectId: newProject.id,
  projectName: newProject.name,
  description: newProject.description,
  program: newProject.program,
});

// Atualizar status baseado em qualificação
if (qualification.score > 80) {
  await moveToStage(newProject.id, 'triagem');
} else if (qualification.score > 60) {
  await moveToStage(newProject.id, 'validacao');
} else {
  await rejectProject(newProject.id, qualification.feedback);
}
```

### Caso 2: Recomendação de Mentores

```typescript
// Quando um projeto é aprovado
const mentors = await recommendMentors(
  project.id,
  project.description
);

// Atribuir mentores automaticamente
for (const mentor of mentors) {
  if (mentor.matchScore > 0.85) {
    await assignMentor(project.id, mentor.mentorId);
  }
}
```

### Caso 3: Análise de Funil para Decisões

```typescript
// Gerar insights para dashboard
const funnelAnalysis = await analyzeFunnel();

// Alertar admin sobre gargalos
if (funnelAnalysis.bottlenecks.length > 0) {
  await notifyAdmin('Gargalos identificados no funil', funnelAnalysis);
}
```

## Segurança

- **Autenticação:** Use API keys seguras em variáveis de ambiente
- **Rate Limiting:** Implemente limites de requisições
- **Validação:** Sempre valide dados antes de enviar para IA
- **Logs:** Registre todas as interações com IA para auditoria

## Tratamento de Erros

```typescript
try {
  const result = await qualifyProject(data);
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Implementar retry com backoff
  } else if (error.code === 'INVALID_API_KEY') {
    // Notificar admin
  } else {
    // Erro genérico
    console.error('Erro ao qualificar:', error);
  }
}
```

## Próximos Passos

1. **Obter credenciais MindStudio**
   - Contatar suporte do MindStudio
   - Configurar agente de IA para triagem
   - Obter API key e Agent ID

2. **Implementar endpoints backend**
   - Criar rotas API em `app/api/ai/`
   - Adicionar autenticação
   - Implementar cache de resultados

3. **Integrar em fluxos**
   - Triagem automática na inscrição
   - Recomendação de mentores
   - Análise de funil

4. **Testes**
   - Testar com dados de exemplo
   - Validar qualidade das recomendações
   - Ajustar critérios se necessário

## Suporte

Para dúvidas sobre integração:
- Documentação MindStudio: https://docs.mindstudio.com
- Email: support@upscalelab.com

# Guia de Integração - UpScale Lab Platform

## 📋 Visão Geral

Este guia descreve como integrar a plataforma UpScale Lab com seu site HTML existente, incluindo login e inscrição.

## 🏗️ Arquitetura

```
seu-dominio.com/
├── index.html (site público)
├── auth/
│   ├── login (integrado com OAuth)
│   └── signup (formulário de inscrição)
└── app/ (plataforma UpScale Lab)
    ├── dashboard (admin)
    ├── projects (Kanban)
    ├── courses (Ignite)
    ├── mentorship
    └── startup/ (versão para startups)
```

## 🔐 Autenticação

### 1. Login (OAuth)

**Fluxo:**
1. Usuário clica em "Entrar" no site
2. Redirecionado para `/auth/login`
3. Autentica com Google/Apple
4. Retorna para dashboard com token JWT

**Implementação:**
```typescript
// lib/auth.ts
export async function loginWithOAuth(provider: 'google' | 'apple') {
  const response = await fetch('/api/auth/oauth', {
    method: 'POST',
    body: JSON.stringify({ provider })
  });
  return response.json();
}
```

### 2. Inscrição (Signup)

**Fluxo:**
1. Usuário preenche formulário em `/auth/signup`
2. Dados salvos no banco de dados
3. Email de confirmação enviado
4. Redirecionado para triagem automática com IA

**Campos Obrigatórios:**
- Nome completo
- Email
- Senha
- Nome da startup
- Descrição da ideia
- Programa (Ignite Up / Scale Up)

## 🗄️ Banco de Dados

### Tabelas Principais

```sql
-- Usuários
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  role ENUM('admin', 'mentor', 'startup', 'instructor'),
  avatar TEXT,
  created_at TIMESTAMP
);

-- Empresas/Startups
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name VARCHAR(255),
  founder_id TEXT FOREIGN KEY,
  program ENUM('ignite-up', 'scale-up'),
  stage ENUM('inscricao', 'triagem', ..., 'churn'),
  ai_qualification_score DECIMAL(5,2),
  created_at TIMESTAMP
);

-- Projetos
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  company_id TEXT FOREIGN KEY,
  title VARCHAR(255),
  stage ENUM(...),
  progress INTEGER,
  created_at TIMESTAMP
);

-- Cursos
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title VARCHAR(255),
  program ENUM('ignite-up', 'scale-up'),
  instructor_id TEXT FOREIGN KEY
);

-- Módulos
CREATE TABLE course_modules (
  id TEXT PRIMARY KEY,
  course_id TEXT FOREIGN KEY,
  title VARCHAR(255),
  order INTEGER
);

-- Aulas
CREATE TABLE course_lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT FOREIGN KEY,
  title VARCHAR(255),
  video_url TEXT,
  duration INTEGER
);

-- Progresso
CREATE TABLE lesson_progress (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT FOREIGN KEY,
  lesson_id TEXT FOREIGN KEY,
  completed BOOLEAN
);

-- Envios de Projetos
CREATE TABLE module_submissions (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT FOREIGN KEY,
  module_id TEXT FOREIGN KEY,
  status ENUM('pending', 'reviewing', 'approved', 'rejected'),
  grade INTEGER,
  submitted_at TIMESTAMP
);

-- Documentos
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  company_id TEXT FOREIGN KEY,
  title VARCHAR(255),
  file_url TEXT,
  signature_required BOOLEAN,
  signed_at TIMESTAMP
);

-- Reuniões
CREATE TABLE meetings (
  id TEXT PRIMARY KEY,
  project_id TEXT FOREIGN KEY,
  mentor_id TEXT FOREIGN KEY,
  start_time TIMESTAMP,
  video_link TEXT,
  recording_url TEXT
);

-- Chat
CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  name VARCHAR(255),
  type ENUM('group', 'direct', 'support')
);

CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT FOREIGN KEY,
  user_id TEXT FOREIGN KEY,
  content TEXT,
  created_at TIMESTAMP
);
```

## 🔗 URLs e Rotas

### Site Público
- `/` - Homepage
- `/sobre` - Sobre UpScale Lab
- `/programas` - Ignite Up e Scale Up
- `/auth/login` - Login
- `/auth/signup` - Inscrição

### Plataforma Admin
- `/dashboard` - Dashboard principal
- `/projects` - Gestão de projetos (Kanban)
- `/pipeline` - Pipeline de etapas
- `/courses` - Gestão de cursos
- `/mentors` - Gestão de mentores
- `/mentorship` - Solicitações de mentoria
- `/meetings` - Reuniões e vídeo chamadas
- `/chat` - Chat integrado
- `/reports` - Relatórios e analytics

### Plataforma Startup
- `/startup/dashboard` - Meu projeto
- `/startup/inscription` - Inscrição
- `/startup/documents` - Meus documentos
- `/startup/courses` - Cursos Ignite
- `/startup/meetings` - Minhas reuniões
- `/startup/chat` - Suporte

## 🤖 Integração com IA (MindStudio)

### Qualificação Automática

**Fluxo:**
1. Startup preenche inscrição
2. Dados enviados para MindStudio API
3. IA analisa: mercado, equipe, inovação, viabilidade
4. Retorna score de 0-100 com acurácia 70-90%
5. Startups com score > 70 avançam para triagem manual

**Implementação:**
```typescript
// src/hooks/useAIQualification.ts
export async function qualifyStartup(companyData: any) {
  const response = await fetch('/api/ai/qualify', {
    method: 'POST',
    body: JSON.stringify(companyData)
  });
  const { score, details } = await response.json();
  return { score, details };
}
```

## 📊 Visão Admin vs Startup

### Admin Pode:
- ✅ Editar todos os projetos
- ✅ Atribuir mentores
- ✅ Mover projetos entre etapas
- ✅ Criar/editar cursos e módulos
- ✅ Ver analytics e relatórios
- ✅ Gerenciar usuários
- ✅ Agendar reuniões
- ✅ Dar notas em envios

### Startup Pode:
- ✅ Ver seu projeto no pipeline
- ✅ Completar cursos Ignite
- ✅ Enviar projetos parciais
- ✅ Ver notas recebidas
- ✅ Agendar reuniões com mentores
- ✅ Usar chat de suporte
- ❌ Editar cursos
- ❌ Ver outros projetos
- ❌ Acessar analytics

## 🚀 Deploy

### Opção 1: Seu Domínio Existente

```bash
# 1. Configurar DNS
seu-dominio.com → IP da plataforma

# 2. Certificado SSL
certbot certonly --standalone -d seu-dominio.com

# 3. Deploy com Docker
docker build -t upscale-lab .
docker run -p 80:3000 -p 443:3000 upscale-lab
```

### Opção 2: Subdomínio

```
seu-dominio.com → Site público (HTML)
app.seu-dominio.com → Plataforma UpScale Lab
```

## 📱 Responsividade

- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## 🔄 Fluxo Completo de Uma Startup

### 1. Inscrição
```
Homepage → "Inscrever-se" → Formulário → Validação IA → Triagem
```

### 2. Triagem
```
Análise IA → Entrevista com Admin → Aprovação/Rejeição
```

### 3. Aceleração
```
Cursos Ignite → Envios Parciais → Mentoria → Demo Day → Pitch Final
```

### 4. Investimento
```
Decisão de Investimento → Contrato → Equity/Mensalidade
```

## 📞 Suporte

Para dúvidas sobre integração, entre em contato com o time técnico.

---

**Última atualização:** Abril 2026

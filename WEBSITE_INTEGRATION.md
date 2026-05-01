# Guia de Integração: Site + Plataforma UpScale Lab

## 📋 Visão Geral

Este documento descreve como integrar seu site HTML existente com a plataforma UpScale Lab, criando um fluxo contínuo de:

**Site Público** → **Login/Inscrição** → **Plataforma Admin/Startup**

## 🏗️ Arquitetura de Integração

```
seu-dominio.com/
├── index.html (site público)
├── sobre/
├── programas/
├── blog/
├── auth/
│   ├── login (Next.js)
│   ├── signup (Next.js)
│   └── forgot-password (Next.js)
└── app/ (plataforma UpScale Lab - Next.js)
    ├── dashboard
    ├── projects
    ├── courses
    └── startup/
```

## 🔄 Fluxo de Usuário

### 1. Novo Usuário (Startup)

```
Homepage → Botão "Inscrever-se" → /auth/signup
  ↓
Preenche dados (4 passos)
  ↓
Cria conta → Salva no banco de dados
  ↓
Redireciona para /startup/inscription
  ↓
Formulário de inscrição no programa
  ↓
Triagem automática com IA (MindStudio)
  ↓
Dashboard /startup/dashboard
```

### 2. Usuário Existente

```
Homepage → Botão "Entrar" → /auth/login
  ↓
Autentica com email/senha ou OAuth
  ↓
Redireciona para /dashboard (admin) ou /startup/dashboard (startup)
```

## 🛠️ Configuração Técnica

### Opção 1: Subdomínio (Recomendado)

```
seu-dominio.com → Site público (HTML estático)
app.seu-dominio.com → Plataforma UpScale Lab (Next.js)
```

**Configuração DNS:**
```
A seu-dominio.com → IP do servidor de site estático
A app.seu-dominio.com → IP do servidor Next.js
```

**Nginx (seu-dominio.com):**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/upscale-site;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

**Nginx (app.seu-dominio.com):**
```nginx
server {
    listen 80;
    server_name app.seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Opção 2: Mesmo Domínio (Alternativa)

```
seu-dominio.com/ → Site público
seu-dominio.com/app → Plataforma UpScale Lab
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    # Site público
    location / {
        root /var/www/upscale-site;
        try_files $uri $uri/ =404;
    }
    
    # Plataforma
    location /app {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 Autenticação

### OAuth com Google

1. **Criar aplicação no Google Cloud Console:**
   - Ir para https://console.cloud.google.com
   - Criar novo projeto
   - Ativar Google+ API
   - Criar credenciais (OAuth 2.0)
   - Adicionar URIs autorizados:
     - `https://seu-dominio.com/auth/callback`
     - `https://app.seu-dominio.com/auth/callback`

2. **Variáveis de ambiente (.env.local):**
   ```
   GOOGLE_CLIENT_ID=seu_client_id
   GOOGLE_CLIENT_SECRET=seu_client_secret
   NEXTAUTH_URL=https://app.seu-dominio.com
   NEXTAUTH_SECRET=gere_uma_chave_segura
   ```

### JWT (JSON Web Token)

**Fluxo:**
1. Usuário faz login
2. Servidor gera JWT com dados do usuário
3. JWT armazenado em cookie seguro (httpOnly)
4. Requisições subsequentes incluem JWT
5. Servidor valida JWT

**Exemplo de payload JWT:**
```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "role": "admin",
  "company": "AgroSense AI",
  "program": "ignite-up",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## 📱 Páginas de Autenticação

### Login (/auth/login)

**Componentes:**
- Campo de email
- Campo de senha
- Checkbox "Lembrar de mim"
- Link "Esqueceu a senha?"
- Botão "Entrar"
- Botão "Entrar com Google"
- Link para inscrição

**Validações:**
- Email válido
- Senha com mínimo 8 caracteres
- Comparar com banco de dados

**Redirecionamento:**
- Admin → `/dashboard`
- Mentor → `/dashboard`
- Startup → `/startup/dashboard`

### Inscrição (/auth/signup)

**4 Passos:**

1. **Informações Pessoais**
   - Nome completo
   - Email
   - Senha (com validação de força)
   - Confirmação de senha

2. **Sobre a Empresa**
   - Nome da empresa
   - Descrição da ideia
   - Setor/Indústria

3. **Escolher Programa**
   - Ignite Up (6-12 meses)
   - Scale Up (2-6 meses)

4. **Confirmação**
   - Revisar dados
   - Aceitar termos de serviço
   - Criar conta

**Após inscrição:**
- Salvar no banco de dados
- Enviar email de confirmação
- Redirecionar para triagem com IA

## 🤖 Integração com IA (MindStudio)

### Fluxo de Triagem Automática

```
Startup preenche inscrição
  ↓
Dados enviados para MindStudio API
  ↓
IA analisa:
  - Mercado (TAM, SAM, SOM)
  - Equipe (experiência, skills)
  - Inovação (diferencial, propriedade intelectual)
  - Viabilidade financeira (burn rate, runway)
  ↓
Retorna score 0-100 com acurácia 70-90%
  ↓
Score > 70 → Avança para triagem manual
Score ≤ 70 → Fila de espera ou rejeição
```

### Chamada à API MindStudio

```typescript
// src/hooks/useAIQualification.ts
async function qualifyStartup(data: StartupData) {
  const response = await fetch('/api/ai/qualify', {
    method: 'POST',
    body: JSON.stringify({
      companyName: data.companyName,
      description: data.description,
      market: data.market,
      teamSize: data.teamSize,
      foundingYear: data.foundingYear,
      revenue: data.revenue,
    })
  });
  
  return response.json(); // { score, details, recommendation }
}
```

## 📊 Banco de Dados

### Tabelas Principais

```sql
-- Usuários
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  role ENUM('admin', 'mentor', 'startup', 'instructor'),
  created_at TIMESTAMP
);

-- Empresas/Startups
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  founder_id TEXT FOREIGN KEY,
  name VARCHAR(255),
  description TEXT,
  program ENUM('ignite-up', 'scale-up'),
  stage ENUM('inscricao', 'triagem', 'validacao', ...),
  ai_score DECIMAL(5,2),
  created_at TIMESTAMP
);

-- Sessões
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT FOREIGN KEY,
  token TEXT UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);
```

## 🚀 Deploy

### Pré-requisitos

- Node.js 18+
- PostgreSQL ou MySQL
- Domínio com SSL/TLS
- Servidor (VPS, AWS, Vercel, etc)

### Passos de Deploy

1. **Clonar repositório**
   ```bash
   git clone seu-repo
   cd upscale-lab-platform
   ```

2. **Instalar dependências**
   ```bash
   pnpm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   # Editar .env.local com suas credenciais
   ```

4. **Build**
   ```bash
   pnpm build
   ```

5. **Iniciar servidor**
   ```bash
   pnpm start
   ```

6. **Configurar SSL com Let's Encrypt**
   ```bash
   certbot certonly --standalone -d seu-dominio.com -d app.seu-dominio.com
   ```

### Docker (Recomendado)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/upscale
      - NEXTAUTH_URL=https://app.seu-dominio.com
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=upscale
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔗 Links Úteis

- **Login:** `/auth/login`
- **Inscrição:** `/auth/signup`
- **Dashboard Admin:** `/dashboard`
- **Dashboard Startup:** `/startup/dashboard`
- **Centro de Notificações:** `/notifications`
- **Cursos Ignite:** `/courses`
- **Pipeline:** `/projects`

## 📞 Suporte

Para dúvidas sobre integração, entre em contato com o time técnico.

---

**Última atualização:** Abril 2026

# 🚀 Guia de Deployment - UpScale Lab Platform

Guia completo com passo a passo para implementar os 3 próximos passos críticos.

---

## 📋 Índice

1. [Ativar Banco de Dados Real](#1-ativar-banco-de-dados-real)
2. [Implementar WebRTC (Vídeo Chamadas)](#2-implementar-webrtc-vídeo-chamadas)
3. [Configurar Domínio](#3-configurar-domínio)

---

## 1. Ativar Banco de Dados Real

### 1.1 Escolher Provedor de Banco de Dados

**Opções recomendadas:**

| Provedor | Custo | Escalabilidade | Facilidade | Recomendação |
|----------|-------|-----------------|-----------|--------------|
| **Railway** | $5-50/mês | Média | ⭐⭐⭐⭐⭐ | **Melhor para começar** |
| **Vercel Postgres** | $15-200/mês | Alta | ⭐⭐⭐⭐⭐ | Integrado com Next.js |
| **AWS RDS** | $10-300+/mês | Muito Alta | ⭐⭐⭐ | Mais complexo |
| **DigitalOcean** | $15-100/mês | Alta | ⭐⭐⭐⭐ | Boa relação custo-benefício |
| **PlanetScale** | Free-$99/mês | Alta | ⭐⭐⭐⭐ | Otimizado para MySQL |

**Recomendação:** Use **Railway** ou **Vercel Postgres** para começar (mais fácil).

---

### 1.2 Configurar Railway (Recomendado)

#### Passo 1: Criar Conta no Railway

1. Acesse https://railway.app
2. Clique em "Start a New Project"
3. Faça login com GitHub
4. Autorize o acesso

#### Passo 2: Criar Banco de Dados PostgreSQL

1. No dashboard do Railway, clique em "+ New"
2. Selecione "Database"
3. Escolha "PostgreSQL"
4. Aguarde a criação (2-3 minutos)

#### Passo 3: Obter String de Conexão

1. Clique no banco de dados criado
2. Abra a aba "Connect"
3. Copie a URL de conexão (DATABASE_URL)

Exemplo:
```
postgresql://user:password@host:5432/railway
```

#### Passo 4: Configurar Variáveis de Ambiente

1. No seu projeto Next.js, crie/edite `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/railway

# NextAuth
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=gere_uma_chave_segura_aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret

# MindStudio AI
MINDSTUDIO_API_KEY=sua_chave_api
MINDSTUDIO_API_URL=https://api.mindstudio.com

# Twilio (para vídeo chamadas)
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_API_KEY=seu_api_key
TWILIO_API_SECRET=seu_api_secret
```

#### Passo 5: Executar Migrações Drizzle

1. No seu terminal local:

```bash
# Instalar Drizzle CLI
npm install -D drizzle-kit

# Gerar migrações
npm run db:generate

# Executar migrações
npm run db:migrate
```

2. Verificar se as tabelas foram criadas:

```bash
# Conectar ao banco de dados
psql postgresql://user:password@host:5432/railway

# Listar tabelas
\dt

# Sair
\q
```

#### Passo 6: Fazer Seed (Popular com Dados Iniciais)

Criar arquivo `scripts/seed.ts`:

```typescript
import { db } from '@/lib/db';
import { users, courses, modules } from '@/drizzle/schema';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  await db.insert(users).values({
    id: 'admin_1',
    email: 'admin@upscalelab.com',
    name: 'Administrador',
    role: 'admin',
    passwordHash: 'hash_da_senha_aqui',
  });

  // Criar cursos Ignite
  const igniteUp = await db.insert(courses).values({
    id: 'course_ignite_1',
    title: 'Fundamentos de Startups',
    description: 'Aprenda os conceitos básicos de uma startup',
    program: 'ignite-up',
    duration: 180, // minutos
  });

  console.log('✅ Seed concluído com sucesso!');
}

seed().catch(console.error);
```

Executar:
```bash
npx ts-node scripts/seed.ts
```

---

### 1.3 Configurar Vercel Postgres (Alternativa)

#### Passo 1: Criar Projeto no Vercel

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Clique em "Deploy"

#### Passo 2: Adicionar Banco de Dados

1. No dashboard do Vercel, vá para "Storage"
2. Clique em "Create Database"
3. Escolha "Postgres"
4. Selecione a região mais próxima
5. Clique em "Create"

#### Passo 3: Conectar ao Projeto

1. Clique no banco de dados criado
2. Vá para "Connect"
3. Copie a string de conexão
4. Adicione ao `.env.local`

#### Passo 4: Executar Migrações

```bash
npm run db:generate
npm run db:migrate
```

---

### 1.4 Testar Conexão com Banco de Dados

Criar arquivo `scripts/test-db.ts`:

```typescript
import { db } from '@/lib/db';
import { users } from '@/drizzle/schema';

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com banco de dados...');
    
    const allUsers = await db.select().from(users);
    console.log(`✅ Conexão bem-sucedida! Total de usuários: ${allUsers.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
    process.exit(1);
  }
}

testConnection();
```

Executar:
```bash
npx ts-node scripts/test-db.ts
```

---

### 1.5 Integrar Banco de Dados com API

Atualizar `app/api/auth/login/route.ts`:

```typescript
import { db } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Buscar usuário no banco
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user.length) {
      return Response.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      );
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(
      password,
      user[0].passwordHash
    );

    if (!validPassword) {
      return Response.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    // Gerar JWT
    const token = jwt.sign(
      {
        userId: user[0].id,
        email: user[0].email,
        role: user[0].role,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    return Response.json({ token, user: user[0] });
  } catch (error) {
    return Response.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}
```

---

## 2. Implementar WebRTC (Vídeo Chamadas)

### 2.1 Escolher Provedor de Vídeo

**Opções recomendadas:**

| Provedor | Custo | Qualidade | Facilidade | Recomendação |
|----------|-------|-----------|-----------|--------------|
| **Twilio** | $0.01-0.10/min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Melhor opção** |
| **Jitsi** | Free/Self-hosted | ⭐⭐⭐⭐ | ⭐⭐⭐ | Open source |
| **Daily.co** | $0.01-0.15/min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Muito simples |
| **Whereby** | $0.02-0.05/min | ⭐⭐⭐⭐ | ⭐⭐⭐ | Bom custo-benefício |

**Recomendação:** Use **Twilio** (mais confiável) ou **Daily.co** (mais simples).

---

### 2.2 Configurar Twilio (Recomendado)

#### Passo 1: Criar Conta no Twilio

1. Acesse https://www.twilio.com/console
2. Clique em "Sign Up"
3. Preencha o formulário
4. Verifique seu email
5. Faça login

#### Passo 2: Obter Credenciais

1. No dashboard, vá para "Account"
2. Copie:
   - **Account SID**
   - **Auth Token**

3. Crie uma API Key:
   - Vá para "API Keys & Tokens"
   - Clique em "Create API Key"
   - Salve a chave e secret

#### Passo 3: Adicionar Variáveis de Ambiente

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your_api_secret
```

#### Passo 4: Instalar SDK Twilio

```bash
npm install twilio twilio-video
```

#### Passo 5: Criar API para Gerar Token

Criar `app/api/video/token/route.ts`:

```typescript
import { Twilio } from 'twilio';

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: Request) {
  try {
    const { roomName, userName } = await request.json();

    // Gerar token de acesso
    const token = twilio.jwt.AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_SECRET!
    );

    // Adicionar permissão de vídeo
    token.addVideoGrant({ room: roomName });
    token.identity = userName;

    return Response.json({
      token: token.toJwt(),
      roomName,
      userName,
    });
  } catch (error) {
    return Response.json({ error: 'Erro ao gerar token' }, { status: 500 });
  }
}
```

#### Passo 6: Criar Componente de Vídeo Chamada

Criar `src/components/VideoRoom.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { connect, Room, Participant } from 'twilio-video';
import Participant from './Participant';

interface VideoRoomProps {
  roomName: string;
  userName: string;
  token: string;
}

export default function VideoRoom({ roomName, userName, token }: VideoRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    // Conectar à sala de vídeo
    const videoConnect = async () => {
      try {
        const room = await connect(token, {
          name: roomName,
          audio: true,
          video: { width: 640 },
        });

        setRoom(room);
        setParticipants(Array.from(room.participants.values()));

        // Adicionar novos participantes
        room.on('participantConnected', (participant) => {
          setParticipants((prev) => [...prev, participant]);
        });

        // Remover participantes que saíram
        room.on('participantDisconnected', (participant) => {
          setParticipants((prev) =>
            prev.filter((p) => p !== participant)
          );
        });
      } catch (error) {
        console.error('Erro ao conectar à sala:', error);
      }
    };

    videoConnect();

    // Desconectar ao sair
    return () => {
      if (room) {
        room.localParticipant.tracks.forEach((track) => {
          track.stop();
        });
        room.disconnect();
      }
    };
  }, [roomName, token]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {room && (
        <Participant
          key={room.localParticipant.sid}
          participant={room.localParticipant}
        />
      )}
      {participants.map((participant) => (
        <Participant
          key={participant.sid}
          participant={participant}
        />
      ))}
    </div>
  );
}
```

#### Passo 7: Criar Página de Reunião

Criar `app/meetings/[id]/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import VideoRoom from '@/src/components/VideoRoom';

export default function MeetingPage({ params }: { params: { id: string } }) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/video/token', {
          method: 'POST',
          body: JSON.stringify({
            roomName: params.id,
            userName: 'Usuário', // Obter do usuário logado
          }),
        });

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error('Erro ao obter token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [params.id]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="h-screen bg-dark-bg">
      <VideoRoom
        roomName={params.id}
        userName="Usuário"
        token={token}
      />
    </div>
  );
}
```

---

### 2.3 Configurar Daily.co (Alternativa Mais Simples)

#### Passo 1: Criar Conta

1. Acesse https://dashboard.daily.co
2. Clique em "Sign Up"
3. Preencha o formulário
4. Verifique seu email

#### Passo 2: Obter API Key

1. Vá para "Developers"
2. Clique em "API Keys"
3. Copie sua API Key

#### Passo 3: Instalar SDK

```bash
npm install @daily-co/daily-js
```

#### Passo 4: Criar Componente

```typescript
'use client';

import { useEffect, useRef } from 'react';
import Daily from '@daily-co/daily-js';

export default function DailyVideoRoom({ roomUrl }: { roomUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callFrame = Daily.createFrame({
      iframeStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
      },
    });

    callFrame.join({ url: roomUrl });

    return () => {
      callFrame.leave();
      callFrame.destroy();
    };
  }, [roomUrl]);

  return <div ref={containerRef} />;
}
```

---

## 3. Configurar Domínio

### 3.1 Registrar Domínio

**Provedores recomendados:**

- **Namecheap** - Barato, suporte bom
- **GoDaddy** - Populares, muitos recursos
- **Google Domains** - Integrado com Google
- **Cloudflare** - Excelente DNS e segurança

**Passo a passo:**

1. Escolha um provedor
2. Busque seu domínio (ex: upscalelab.com.br)
3. Adicione ao carrinho
4. Complete a compra
5. Configure o DNS

---

### 3.2 Configurar DNS

#### Opção 1: Usar Cloudflare (Recomendado)

**Passo 1: Criar Conta no Cloudflare**

1. Acesse https://dash.cloudflare.com
2. Clique em "Sign Up"
3. Preencha o formulário

**Passo 2: Adicionar Domínio**

1. Clique em "Add a Site"
2. Digite seu domínio
3. Selecione o plano (Free é suficiente)
4. Clique em "Continue"

**Passo 3: Atualizar Nameservers**

1. Copie os nameservers do Cloudflare
2. Vá para seu provedor de domínio
3. Atualize os nameservers
4. Aguarde propagação (até 48h)

**Passo 4: Configurar Registros DNS**

No Cloudflare, vá para "DNS" e adicione:

```
Type    Name                    Value
A       seu-dominio.com         IP_DO_SERVIDOR
A       app.seu-dominio.com     IP_DO_SERVIDOR
CNAME   www                     seu-dominio.com
```

---

### 3.3 Configurar SSL/TLS

#### Opção 1: Cloudflare (Automático)

1. No Cloudflare, vá para "SSL/TLS"
2. Selecione "Full" ou "Full (strict)"
3. Pronto! SSL configurado automaticamente

#### Opção 2: Let's Encrypt (Manual)

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --standalone \
  -d seu-dominio.com \
  -d app.seu-dominio.com \
  -d www.seu-dominio.com

# Renovar automaticamente
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

### 3.4 Configurar Nginx

Criar `/etc/nginx/sites-available/upscale-lab`:

```nginx
# Redirecionar HTTP para HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com app.seu-dominio.com www.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

# Site público (HTTPS)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    root /var/www/upscale-site;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Plataforma (HTTPS)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3000/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Ativar configuração:

```bash
sudo ln -s /etc/nginx/sites-available/upscale-lab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### 3.5 Fazer Deploy

#### Opção 1: VPS (DigitalOcean, Linode, etc)

**Passo 1: Criar Droplet**

1. Vá para https://cloud.digitalocean.com
2. Clique em "Create" → "Droplets"
3. Escolha:
   - **Image:** Ubuntu 22.04
   - **Size:** $5-10/mês (suficiente para começar)
   - **Region:** Mais próxima do seu público

**Passo 2: Conectar via SSH**

```bash
ssh root@IP_DO_DROPLET
```

**Passo 3: Instalar Dependências**

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Instalar Nginx
apt install -y nginx

# Instalar PM2 (gerenciador de processos)
npm install -g pm2

# Instalar Git
apt install -y git
```

**Passo 4: Clonar Repositório**

```bash
cd /var/www
git clone seu-repositorio upscale-lab
cd upscale-lab
```

**Passo 5: Instalar Dependências do Projeto**

```bash
npm install
npm run build
```

**Passo 6: Iniciar com PM2**

```bash
pm2 start npm --name "upscale-lab" -- start
pm2 startup
pm2 save
```

---

#### Opção 2: Vercel (Mais Fácil)

**Passo 1: Conectar Repositório**

1. Acesse https://vercel.com
2. Clique em "Import Project"
3. Selecione seu repositório GitHub
4. Clique em "Import"

**Passo 2: Configurar Variáveis de Ambiente**

1. Vá para "Settings" → "Environment Variables"
2. Adicione todas as variáveis do `.env.local`

**Passo 3: Conectar Domínio**

1. Vá para "Settings" → "Domains"
2. Adicione seu domínio
3. Siga as instruções para atualizar DNS

**Passo 4: Deploy**

Vercel faz deploy automático a cada push no GitHub!

---

### 3.6 Testar Deployment

```bash
# Testar HTTPS
curl -I https://seu-dominio.com
curl -I https://app.seu-dominio.com

# Testar DNS
nslookup seu-dominio.com
nslookup app.seu-dominio.com

# Testar certificado SSL
openssl s_client -connect seu-dominio.com:443
```

---

## 📊 Checklist de Deployment

- [ ] Banco de dados criado e testado
- [ ] Migrações Drizzle executadas
- [ ] Dados iniciais (seed) inseridos
- [ ] Vídeo chamadas configuradas (Twilio/Daily)
- [ ] Domínio registrado
- [ ] DNS configurado
- [ ] SSL/TLS ativado
- [ ] Nginx configurado
- [ ] Variáveis de ambiente definidas
- [ ] Projeto deployado
- [ ] Testes end-to-end realizados
- [ ] Monitoramento configurado

---

## 🆘 Troubleshooting

### Erro: "Connection refused" ao conectar ao banco

**Solução:**
```bash
# Verificar se o banco está rodando
psql -U user -h host -d database -c "SELECT 1"

# Verificar firewall
sudo ufw allow 5432
```

### Erro: "SSL certificate problem"

**Solução:**
```bash
# Renovar certificado
sudo certbot renew --force-renewal

# Verificar certificado
openssl x509 -in /etc/letsencrypt/live/seu-dominio.com/fullchain.pem -text -noout
```

### Erro: "WebSocket connection failed"

**Solução:**
```bash
# Verificar se Nginx está proxy passando WebSocket
# Adicionar ao Nginx:
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

---

## 📞 Suporte

Para dúvidas sobre deployment, consulte:
- Documentação do Railway: https://docs.railway.app
- Documentação do Twilio: https://www.twilio.com/docs
- Documentação do Nginx: https://nginx.org/en/docs/

---

**Última atualização:** Abril 2026

# UpScale Lab - Plataforma de Aceleração

Plataforma web profissional para gestão de programas de aceleração de startups **Ignite Up** e **Scale Up**.

## 🚀 Recursos

- **Dashboard Admin** com visão geral de programas
- **Pipeline Visual** com Kanban por etapa
- **Vídeo Chamadas** integradas para reuniões
- **Chat em Tempo Real** (estilo Microsoft Teams)
- **Integração com IA** (MindStudio) para qualificação de funil
- **Gestão de Mentores** e atribuições
- **Relatórios e Analytics**
- **Autenticação OAuth** com role-based access

## 📋 Programas

### Ignite Up
- **Duração:** 6-12 meses
- **Foco:** Early Stage / Pré-Seed
- **Modelo:** Equity + Mensalidade
- **Etapas:** Inscrição → Triagem → Validação → Entrevista → Aceleração → Mentoria → Demo Day → Pitch Final

### Scale Up
- **Duração:** 2-6 meses
- **Foco:** Empresas com Venda
- **Modelo:** Equity
- **Etapas:** Inscrição → Triagem → Validação → Entrevista → Aceleração → Mentoria → Demo Day → Pitch Final

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React
- **Real-time:** Socket.io
- **API:** Axios

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
upscale-lab-platform/
├── app/
│   ├── api/              # Rotas API
│   ├── auth/             # Autenticação
│   ├── dashboard/        # Dashboard principal
│   ├── projects/         # Gestão de projetos
│   ├── mentors/          # Gestão de mentores
│   ├── chat/             # Chat integrado
│   ├── meetings/         # Vídeo chamadas
│   ├── reports/          # Relatórios
│   ├── layout.tsx        # Layout raiz
│   ├── page.tsx          # Página inicial
│   └── globals.css       # Estilos globais
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários
│   ├── store/            # Zustand stores
│   └── types/            # Tipos TypeScript
├── public/               # Arquivos estáticos
├── tailwind.config.js    # Configuração Tailwind
├── tsconfig.json         # Configuração TypeScript
└── next.config.js        # Configuração Next.js
```

## 🔐 Autenticação

A plataforma suporta autenticação OAuth com diferentes roles:

- **Admin:** Acesso completo à plataforma
- **Mentor:** Gestão de mentorias e projetos
- **Startup:** Acesso ao seu projeto e recursos de aprendizado

## 🤖 Integração com IA

Hooks preparados para integração com **MindStudio** para:
- Qualificação automática de funil
- Análise de ideias
- Recomendações de mentores
- Agendamento de reuniões

## 📊 Relatórios

Dashboard com analytics em tempo real:
- Pipeline por etapa
- Distribuição de programas
- Estatísticas de mentores
- Progresso de projetos

## 💬 Chat e Reuniões

- Chat integrado com suporte a canais e mensagens diretas
- Vídeo chamadas para reuniões de mentoria
- Gravação de sessões
- Compartilhamento de tela

## 📝 Próximos Passos

- [ ] Implementar backend com autenticação OAuth
- [ ] Integração com banco de dados
- [ ] Implementar vídeo chamadas com WebRTC
- [ ] Chat em tempo real com Socket.io
- [ ] Integração com MindStudio para IA
- [ ] Testes automatizados
- [ ] Deploy em produção

## 📄 Licença

Propriedade de UpScale Lab

## 👤 Desenvolvido por

Manus AI - Plataforma de Desenvolvimento

'use client';

import { CheckCircle, Clock, AlertCircle, FileText, Users, Calendar, MessageSquare, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stage {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  description: string;
}

const stages: Stage[] = [
  {
    name: 'Inscrição',
    status: 'completed',
    dueDate: '2024-01-15',
    description: 'Formulário de inscrição preenchido',
  },
  {
    name: 'Triagem',
    status: 'in-progress',
    dueDate: '2024-02-01',
    description: 'Análise automática com IA em andamento',
  },
  {
    name: 'Validação',
    status: 'pending',
    dueDate: '2024-02-15',
    description: 'Validação pela equipe UpScale Lab',
  },
  {
    name: 'Entrevista',
    status: 'pending',
    dueDate: '2024-03-01',
    description: 'Entrevista com mentores',
  },
  {
    name: 'Aceleração',
    status: 'pending',
    dueDate: '2024-03-15',
    description: 'Programa de aceleração',
  },
];

export default function StartupDashboard() {
  const completedStages = stages.filter((s) => s.status === 'completed').length;
  const totalStages = stages.length;
  const progress = (completedStages / totalStages) * 100;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">Bem-vindo ao UpScale Lab</h1>
        <p className="text-text-muted">Acompanhe o progresso do seu projeto na jornada de aceleração</p>
      </div>

      {/* Project Info Card */}
      <div className="bg-gradient-brand rounded-lg p-6 text-white space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">AgroSense AI</h2>
            <p className="text-orange-100 mt-1">Plataforma de IA para agricultura de precisão</p>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">Ignite Up</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-orange-100 text-sm">Equipe</p>
            <p className="text-2xl font-bold">3 membros</p>
          </div>
          <div>
            <p className="text-orange-100 text-sm">Mentores</p>
            <p className="text-2xl font-bold">2 atribuídos</p>
          </div>
          <div>
            <p className="text-orange-100 text-sm">Progresso</p>
            <p className="text-2xl font-bold">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-bg3 border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary">Etapas Concluídas</h3>
            <CheckCircle className="w-5 h-5 text-green-upscale-light" />
          </div>
          <p className="text-3xl font-bold text-text-primary">{completedStages}</p>
          <p className="text-sm text-text-muted mt-1">de {totalStages} etapas</p>
        </div>

        <div className="bg-dark-bg3 border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary">Em Progresso</h3>
            <Clock className="w-5 h-5 text-orange-upscale" />
          </div>
          <p className="text-3xl font-bold text-text-primary">1</p>
          <p className="text-sm text-text-muted mt-1">Triagem com IA</p>
        </div>

        <div className="bg-dark-bg3 border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary">Próximas Ações</h3>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-text-primary">2</p>
          <p className="text-sm text-text-muted mt-1">Aguardando validação</p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-dark-bg3 border border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-text-primary mb-6">Sua Jornada de Aceleração</h2>

        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.name} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    stage.status === 'completed'
                      ? 'bg-green-upscale/20 text-green-upscale-light'
                      : stage.status === 'in-progress'
                      ? 'bg-orange-upscale/20 text-orange-upscale'
                      : 'bg-dark-bg4 text-text-muted'
                  )}
                >
                  {stage.status === 'completed' ? '✓' : index + 1}
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={cn(
                      'w-1 h-12 mt-2',
                      stage.status === 'completed' ? 'bg-green-upscale/20' : 'bg-dark-border'
                    )}
                  ></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-text-primary">{stage.name}</h3>
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-1 rounded',
                      stage.status === 'completed'
                        ? 'bg-green-upscale/20 text-green-upscale-light'
                        : stage.status === 'in-progress'
                        ? 'bg-orange-upscale/20 text-orange-upscale'
                        : 'bg-dark-bg4 text-text-muted'
                    )}
                  >
                    {stage.status === 'completed'
                      ? 'Concluído'
                      : stage.status === 'in-progress'
                      ? 'Em Progresso'
                      : 'Pendente'}
                  </span>
                </div>
                <p className="text-sm text-text-muted mb-2">{stage.description}</p>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Prazo: {new Date(stage.dueDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-bg3 border border-dark-border rounded-lg p-6 hover:border-orange-upscale transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-orange-upscale" />
            <h3 className="font-semibold text-text-primary">Enviar Documentos</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Compartilhe documentação, pitch deck e plano financeiro
          </p>
          <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors text-sm">
            Acessar Drive
          </button>
        </div>

        <div className="bg-dark-bg3 border border-dark-border rounded-lg p-6 hover:border-orange-upscale transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-orange-upscale" />
            <h3 className="font-semibold text-text-primary">Agendar Reunião</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Marque uma reunião com mentores ou equipe UpScale Lab
          </p>
          <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors text-sm">
            Agendar
          </button>
        </div>

        <div className="bg-dark-bg3 border border-dark-border rounded-lg p-6 hover:border-orange-upscale transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-orange-upscale" />
            <h3 className="font-semibold text-text-primary">Acessar Cursos</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Comece a trilha de formação Ignite com conteúdo especializado
          </p>
          <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors text-sm">
            Explorar
          </button>
        </div>

        <div className="bg-dark-bg3 border border-dark-border rounded-lg p-6 hover:border-orange-upscale transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-orange-upscale" />
            <h3 className="font-semibold text-text-primary">Chat de Suporte</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Converse com a equipe UpScale Lab em tempo real
          </p>
          <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors text-sm">
            Abrir Chat
          </button>
        </div>
      </div>
    </div>
  );
}

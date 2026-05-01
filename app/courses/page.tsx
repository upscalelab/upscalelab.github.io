'use client';

import { useState } from 'react';
import { Calendar, Clock, BookOpen, Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { PageLayout } from '@/src/components/PageLayout';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  videoUrl?: string;
}

interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  lessons: Lesson[];
  progress: number;
}

const mockModules: Module[] = [
  {
    id: '1',
    number: 1,
    title: 'Fundamentos de Startups',
    description: 'Conceitos básicos, ecossistema de inovação e estrutura de uma startup',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    progress: 100,
    lessons: [
      { id: '1-1', title: 'O que é uma Startup?', duration: 45, completed: true },
      { id: '1-2', title: 'Ecossistema de Inovação', duration: 60, completed: true },
      { id: '1-3', title: 'Estrutura Organizacional', duration: 50, completed: true },
      { id: '1-4', title: 'Métricas e KPIs', duration: 55, completed: true },
    ],
  },
  {
    id: '2',
    number: 2,
    title: 'Validação de Ideias',
    description: 'Técnicas de validação, pesquisa de mercado e análise de viabilidade',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    progress: 75,
    lessons: [
      { id: '2-1', title: 'Problema vs Solução', duration: 50, completed: true },
      { id: '2-2', title: 'Pesquisa de Mercado', duration: 65, completed: true },
      { id: '2-3', title: 'Entrevistas com Usuários', duration: 55, completed: true },
      { id: '2-4', title: 'MVP - Produto Mínimo Viável', duration: 60, completed: false },
    ],
  },
  {
    id: '3',
    number: 3,
    title: 'Modelo de Negócios Canvas',
    description: 'Estruturação do modelo de negócios usando a metodologia Canvas',
    startDate: '2024-03-01',
    endDate: '2024-03-14',
    progress: 50,
    lessons: [
      { id: '3-1', title: 'Introdução ao Canvas', duration: 45, completed: true },
      { id: '3-2', title: 'Segmentos de Clientes', duration: 50, completed: true },
      { id: '3-3', title: 'Proposição de Valor', duration: 55, completed: false },
      { id: '3-4', title: 'Canais e Receita', duration: 60, completed: false },
    ],
  },
  {
    id: '4',
    number: 4,
    title: 'Gestão Financeira para Startups',
    description: 'Controle financeiro, projeções e planejamento de caixa',
    startDate: '2024-03-15',
    endDate: '2024-03-28',
    progress: 0,
    lessons: [
      { id: '4-1', title: 'Demonstrações Financeiras', duration: 70, completed: false },
      { id: '4-2', title: 'Projeções de Receita', duration: 65, completed: false },
      { id: '4-3', title: 'Gestão de Caixa', duration: 60, completed: false },
      { id: '4-4', title: 'Burn Rate e Runway', duration: 55, completed: false },
    ],
  },
  {
    id: '5',
    number: 5,
    title: 'Pitch e Apresentação',
    description: 'Como apresentar sua startup para investidores e stakeholders',
    startDate: '2024-03-29',
    endDate: '2024-04-11',
    progress: 0,
    lessons: [
      { id: '5-1', title: 'Estrutura do Pitch', duration: 50, completed: false },
      { id: '5-2', title: 'Storytelling', duration: 60, completed: false },
      { id: '5-3', title: 'Design de Apresentação', duration: 55, completed: false },
      { id: '5-4', title: 'Prática e Feedback', duration: 45, completed: false },
    ],
  },
  {
    id: '6',
    number: 6,
    title: 'Marketing de Crescimento',
    description: 'Estratégias de growth hacking e aquisição de usuários',
    startDate: '2024-04-12',
    endDate: '2024-04-25',
    progress: 0,
    lessons: [
      { id: '6-1', title: 'Estratégia de Growth', duration: 65, completed: false },
      { id: '6-2', title: 'Canais de Aquisição', duration: 60, completed: false },
      { id: '6-3', title: 'Retenção e Engagement', duration: 55, completed: false },
      { id: '6-4', title: 'Análise de Dados', duration: 50, completed: false },
    ],
  },
];

export default function CoursesPage() {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [expandedModule, setExpandedModule] = useState<string | null>('1');

  const totalProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length
  );

  const completedModules = modules.filter((m) => m.progress === 100).length;

  return (
    <PageLayout
      title="Cursos Ignite"
      description="Trilha de formação para aceleração de startups"
      showBackButton={true}
      backPath="/dashboard"
    >
      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Progresso Geral</p>
            <p className="text-3xl font-bold text-orange-upscale">{totalProgress}%</p>
            <div className="w-full bg-dark-bg4 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-brand h-2 rounded-full transition-all"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Módulos Concluídos</p>
            <p className="text-3xl font-bold text-green-upscale-light">
              {completedModules}/{modules.length}
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Horas de Aprendizado</p>
            <p className="text-3xl font-bold text-blue-400">
              {Math.round(modules.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0), 0) / 60)}h
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Próximo Módulo</p>
            <p className="text-lg font-bold text-text-primary truncate">
              {modules.find((m) => m.progress < 100)?.title || 'Concluído!'}
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-upscale" />
            Calendário de Módulos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-dark-bg4 border border-dark-border rounded-lg p-4 hover:border-orange-upscale transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-orange-upscale/20 text-orange-upscale">
                    Módulo {module.number}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-bold px-2 py-1 rounded',
                      module.progress === 100
                        ? 'bg-green-upscale/20 text-green-upscale-light'
                        : 'bg-blue-500/20 text-blue-400'
                    )}
                  >
                    {module.progress}%
                  </span>
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{module.title}</h3>
                <p className="text-xs text-text-muted mb-3">
                  {new Date(module.startDate).toLocaleDateString('pt-BR')} -{' '}
                  {new Date(module.endDate).toLocaleDateString('pt-BR')}
                </p>
                <div className="w-full bg-dark-bg3 rounded-full h-1">
                  <div
                    className="bg-gradient-brand h-1 rounded-full transition-all"
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-upscale" />
            Módulos e Aulas
          </h2>

          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-dark-card border border-dark-border rounded-lg overflow-hidden"
            >
              {/* Module Header */}
              <button
                onClick={() =>
                  setExpandedModule(expandedModule === module.id ? null : module.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-dark-bg3 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div className="w-12 h-12 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold">
                    {module.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary">{module.title}</h3>
                    <p className="text-sm text-text-muted">{module.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-upscale">{module.progress}%</p>
                      <p className="text-xs text-text-muted">{module.lessons.length} aulas</p>
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-5 h-5 text-text-muted transition-transform',
                        expandedModule === module.id && 'rotate-90'
                      )}
                    />
                  </div>
                </div>
              </button>

              {/* Module Lessons */}
              {expandedModule === module.id && (
                <div className="border-t border-dark-border bg-dark-bg3 p-6 space-y-3">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 p-4 bg-dark-bg4 rounded-lg border border-dark-border hover:border-orange-upscale transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={lesson.completed}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">{lesson.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                          <Clock className="w-3 h-3" />
                          {lesson.duration} min
                        </div>
                      </div>
                      {lesson.completed && (
                        <span className="text-xs font-bold px-2 py-1 rounded bg-green-upscale/20 text-green-upscale-light">
                          Concluída
                        </span>
                      )}
                      <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors text-sm">
                        Assistir
                      </button>
                    </div>
                  ))}

                  {/* Module Submission */}
                  <div className="mt-6 p-4 bg-orange-upscale/10 border border-orange-upscale/20 rounded-lg">
                    <p className="text-sm font-bold text-orange-upscale mb-2">
                      Envio Parcial do Projeto
                    </p>
                    <p className="text-xs text-text-muted mb-3">
                      Após concluir todas as aulas, envie documentos e vídeo do seu projeto para avaliação.
                    </p>
                    <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors text-sm">
                      Enviar Projeto
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

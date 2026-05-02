'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data - em produção, vir do banco de dados
const mockModules = [
  {
    id: '1',
    number: 1,
    title: 'Fundamentos de Startups',
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
    lessons: [
      { id: '2-1', title: 'Problema vs Solução', duration: 50, completed: true },
      { id: '2-2', title: 'Pesquisa de Mercado', duration: 65, completed: true },
      { id: '2-3', title: 'Entrevistas com Usuários', duration: 55, completed: true },
      { id: '2-4', title: 'MVP - Produto Mínimo Viável', duration: 60, completed: false },
    ],
  },
];

interface PageProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
}

export default function LessonPage({ params }: PageProps) {
  const router = useRouter();
  const { moduleId, lessonId } = params;

  // Encontrar módulo e aula
  const module = mockModules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  const lessonIndex = module?.lessons.findIndex((l) => l.id === lessonId) ?? -1;

  const previousLesson = lessonIndex > 0 ? module?.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < (module?.lessons.length ?? 0) - 1 ? module?.lessons[lessonIndex + 1] : null;

  const [isCompleted, setIsCompleted] = useState(lesson?.completed ?? false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  if (!module || !lesson) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Aula não encontrada</h1>
          <Link href="/courses" className="text-brand-primary hover:text-brand-primary-dark">
            Voltar para Cursos
          </Link>
        </div>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    setIsCompleted(true);
    // TODO: Salvar progresso no banco de dados
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-bg to-slate-900 border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/courses" className="text-brand-primary hover:text-brand-primary-dark flex items-center gap-2 mb-4">
            <ChevronLeft className="w-4 h-4" />
            Voltar para Cursos
          </Link>
          <div>
            <p className="text-slate-400 text-sm mb-1">
              Módulo {module.number} • Aula {lessonIndex + 1} de {module.lessons.length}
            </p>
            <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-l-8 border-l-white border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1"></div>
                  </div>
                  <p className="text-slate-400">Vídeo da aula</p>
                  <p className="text-sm text-slate-500 mt-1">{lesson.duration} minutos</p>
                </div>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Sobre esta Aula</h2>
                {isCompleted && (
                  <span className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Concluída
                  </span>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300">
                  Nesta aula, você aprenderá os conceitos fundamentais sobre {lesson.title.toLowerCase()}. 
                  Vamos explorar as melhores práticas, exemplos reais e como aplicar esses conhecimentos 
                  em sua startup.
                </p>

                <h3 className="text-white font-semibold mt-4 mb-2">O que você vai aprender:</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>✓ Conceitos principais e definições</li>
                  <li>✓ Casos de uso práticos</li>
                  <li>✓ Erros comuns a evitar</li>
                  <li>✓ Exercícios e desafios</li>
                </ul>

                <h3 className="text-white font-semibold mt-4 mb-2">Recursos:</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>📄 Slides da apresentação</li>
                  <li>📊 Planilha de exercícios</li>
                  <li>🔗 Links úteis e referências</li>
                  <li>💬 Fórum de discussão</li>
                </ul>
              </div>
            </div>

            {/* Mark Complete Button */}
            {!isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="w-full bg-gradient-brand text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Marcar como Concluída
              </button>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              {previousLesson ? (
                <Link
                  href={`/courses/${moduleId}/${previousLesson.id}`}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Aula Anterior
                </Link>
              ) : (
                <div className="flex-1 bg-slate-800 text-slate-500 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                  <ChevronLeft className="w-5 h-5" />
                  Primeira Aula
                </div>
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${moduleId}/${nextLesson.id}`}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Próxima Aula
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <div className="flex-1 bg-slate-800 text-slate-500 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                  Última Aula
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Module Progress */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <h3 className="font-bold text-white mb-4">Progresso do Módulo</h3>
              <div className="space-y-3">
                {module.lessons.map((l, idx) => (
                  <Link
                    key={l.id}
                    href={`/courses/${moduleId}/${l.id}`}
                    className={`p-3 rounded-lg border transition-colors ${
                      l.id === lessonId
                        ? 'bg-brand-primary/20 border-brand-primary'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {l.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${l.id === lessonId ? 'text-white' : 'text-slate-300'}`}>
                          {l.title}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {l.duration} min
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Module Info */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <h3 className="font-bold text-white mb-2">{module.title}</h3>
              <p className="text-sm text-slate-400 mb-4">
                Módulo {module.number} da trilha Ignite Up
              </p>
              <Link
                href="/courses"
                className="text-brand-primary hover:text-brand-primary-dark text-sm font-semibold"
              >
                Ver todos os módulos →
              </Link>
            </div>

            {/* Resources */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <h3 className="font-bold text-white mb-4">Recursos</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-slate-300 text-sm">
                  <FileText className="w-4 h-4" />
                  Baixar Slides
                </button>
                <button className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-slate-300 text-sm">
                  <FileText className="w-4 h-4" />
                  Exercícios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

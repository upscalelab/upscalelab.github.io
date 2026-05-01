'use client';

import { BookOpen, Play, Lock, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const mockCourses = [
  {
    id: 1,
    title: 'Fundamentos de Startups',
    description: 'Aprenda os conceitos básicos para criar uma startup de sucesso',
    instructor: 'Felipe Froes',
    duration: '4 horas',
    modules: 8,
    progress: 100,
    status: 'completed',
    thumbnail: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Validação de Ideias',
    description: 'Técnicas para validar sua ideia antes de investir recursos',
    instructor: 'Ana Costa',
    duration: '3 horas',
    modules: 6,
    progress: 65,
    status: 'in-progress',
    thumbnail: 'bg-gradient-to-br from-purple-500 to-purple-600',
  },
  {
    id: 3,
    title: 'Pitch Perfeito',
    description: 'Como apresentar sua startup para investidores',
    instructor: 'Roberto Lima',
    duration: '2 horas',
    modules: 4,
    progress: 0,
    status: 'locked',
    thumbnail: 'bg-gradient-to-br from-orange-500 to-orange-600',
  },
  {
    id: 4,
    title: 'Modelo de Negócios Canvas',
    description: 'Estruture seu modelo de negócios de forma clara e objetiva',
    instructor: 'Carla Mendes',
    duration: '3.5 horas',
    modules: 7,
    progress: 30,
    status: 'in-progress',
    thumbnail: 'bg-gradient-to-br from-green-500 to-green-600',
  },
  {
    id: 5,
    title: 'Gestão Financeira para Startups',
    description: 'Controle financeiro e projeções para sua empresa',
    instructor: 'Roberto Lima',
    duration: '5 horas',
    modules: 10,
    progress: 0,
    status: 'locked',
    thumbnail: 'bg-gradient-to-br from-red-500 to-red-600',
  },
  {
    id: 6,
    title: 'Marketing de Crescimento',
    description: 'Estratégias para crescer sua base de usuários rapidamente',
    instructor: 'Carla Mendes',
    duration: '4 horas',
    modules: 8,
    progress: 0,
    status: 'locked',
    thumbnail: 'bg-gradient-to-br from-pink-500 to-pink-600',
  },
];

export default function StartupCoursesPage() {
  const [courses] = useState(mockCourses);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredCourses = courses.filter((course) => {
    if (selectedFilter === 'completed') return course.status === 'completed';
    if (selectedFilter === 'in-progress') return course.status === 'in-progress';
    if (selectedFilter === 'locked') return course.status === 'locked';
    return true;
  });

  const stats = {
    completed: courses.filter((c) => c.status === 'completed').length,
    inProgress: courses.filter((c) => c.status === 'in-progress').length,
    total: courses.length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Cursos Ignite</h1>
        <p className="text-text-muted">Trilha de formação para aceleração de startups</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Cursos Concluídos</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Em Progresso</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total de Cursos</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'all'
              ? 'bg-orange-upscale text-white'
              : 'bg-dark-card text-slate-400 hover:text-white'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedFilter('in-progress')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'in-progress'
              ? 'bg-orange-upscale text-white'
              : 'bg-dark-card text-slate-400 hover:text-white'
          }`}
        >
          Em Progresso
        </button>
        <button
          onClick={() => setSelectedFilter('completed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'completed'
              ? 'bg-orange-upscale text-white'
              : 'bg-dark-card text-slate-400 hover:text-white'
          }`}
        >
          Concluídos
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-orange-upscale transition-colors group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className={`${course.thumbnail} h-40 flex items-center justify-center relative overflow-hidden`}>
              {course.status === 'locked' ? (
                <Lock className="w-12 h-12 text-white opacity-50" />
              ) : (
                <Play className="w-12 h-12 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{course.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Instrutor: {course.instructor}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  {course.duration} • {course.modules} módulos
                </div>

                {course.status !== 'locked' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Progresso</span>
                      <span className="text-xs font-bold text-white">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-gradient-brand h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors mt-4 ${
                    course.status === 'locked'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-orange-upscale text-white hover:opacity-90'
                  }`}
                  disabled={course.status === 'locked'}
                >
                  {course.status === 'completed'
                    ? 'Revisitar'
                    : course.status === 'in-progress'
                    ? 'Continuar'
                    : 'Bloqueado'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

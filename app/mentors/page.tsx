'use client';

import { Users, Plus, Search, Star } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/src/components/PageHeader';

const mockMentors = [
  {
    id: 1,
    name: 'Felipe Froes',
    specialty: 'Estratégia & Negócios',
    bio: 'Empreendedor com 15 anos de experiência',
    available: true,
    projects: 4,
    rating: 4.8,
    avatar: 'F',
  },
  {
    id: 2,
    name: 'Ana Costa',
    specialty: 'Tecnologia & Produto',
    bio: 'CTO em startups de sucesso',
    available: true,
    projects: 3,
    rating: 4.9,
    avatar: 'A',
  },
  {
    id: 3,
    name: 'Roberto Lima',
    specialty: 'Finanças & Investimento',
    bio: 'Analista de investimentos com MBA',
    available: false,
    projects: 5,
    rating: 4.7,
    avatar: 'R',
  },
  {
    id: 4,
    name: 'Carla Mendes',
    specialty: 'Marketing & Crescimento',
    bio: 'Growth hacker com histórico comprovado',
    available: true,
    projects: 2,
    rating: 4.6,
    avatar: 'C',
  },
];

export default function MentorsPage() {
  const [mentors, setMentors] = useState(mockMentors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailable = !filterAvailable || mentor.available;
    return matchesSearch && matchesAvailable;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
            <Users className="w-8 h-8" />
            Mentores
          </h1>
          <p className="text-slate-400">Gestão e atribuição de mentores</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-brand text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          Adicionar Mentor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-dark-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Filter */}
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-dark-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
            <input
              type="checkbox"
              checked={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-300">Apenas Disponíveis</span>
          </label>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-brand-primary transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-lg font-bold text-white">
                  {mentor.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white">{mentor.name}</h3>
                  <p className="text-xs text-slate-400">{mentor.specialty}</p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  mentor.available
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-slate-900/30 text-slate-400'
                }`}
              >
                {mentor.available ? 'Disponível' : 'Ocupado'}
              </span>
            </div>

            {/* Bio */}
            <p className="text-sm text-slate-400 mb-4">{mentor.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-xs text-slate-400">Projetos</p>
                <p className="text-lg font-bold text-white">{mentor.projects}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Rating
                </p>
                <p className="text-lg font-bold text-white">{mentor.rating}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-dark-border">
              <button className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                Atribuir
              </button>
              <button className="flex-1 px-4 py-2 border border-dark-border text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Nenhum mentor encontrado</p>
        </div>
      )}
    </div>
  );
}

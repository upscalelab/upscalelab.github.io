'use client';

import { useState } from 'react';
import { Calendar, MapPin, Star, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/src/components/PageHeader';
import { cn } from '@/lib/utils';

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  type: 'strategic' | 'technical';
  specialization: string;
  rating: number;
  reviews: number;
  hoursAvailable: number;
  bio: string;
  expertise: string[];
}

interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  type: 'strategic' | 'technical';
  status: 'pending' | 'accepted' | 'completed';
  scheduledDate?: string;
  topic: string;
  duration: number;
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Felipe Froes',
    avatar: 'F',
    type: 'strategic',
    specialization: 'Estratégia & Negócios',
    rating: 4.8,
    reviews: 42,
    hoursAvailable: 8,
    bio: 'Fundador de 3 startups, investidor anjo e mentor experiente',
    expertise: ['Fundraising', 'Go-to-Market', 'Estratégia de Negócios', 'Escalabilidade'],
  },
  {
    id: '2',
    name: 'Ana Costa',
    avatar: 'A',
    type: 'technical',
    specialization: 'Produto & Tecnologia',
    rating: 4.9,
    reviews: 38,
    hoursAvailable: 6,
    bio: 'CTO em 2 startups de sucesso, especialista em arquitetura de software',
    expertise: ['Arquitetura de Software', 'IA/ML', 'DevOps', 'Escalabilidade Técnica'],
  },
  {
    id: '3',
    name: 'Roberto Lima',
    avatar: 'R',
    type: 'strategic',
    specialization: 'Finanças & Investimento',
    rating: 4.7,
    reviews: 35,
    hoursAvailable: 4,
    bio: 'Diretor de Investimentos com 15 anos de experiência no mercado',
    expertise: ['Estrutura de Cap Table', 'Valuation', 'Due Diligence', 'Negociação'],
  },
];

const MOCK_REQUESTS: MentorshipRequest[] = [
  {
    id: '1',
    mentorId: '1',
    mentorName: 'Felipe Froes',
    type: 'strategic',
    status: 'accepted',
    scheduledDate: '2024-02-15 14:00',
    topic: 'Estratégia de Go-to-Market',
    duration: 60,
  },
  {
    id: '2',
    mentorId: '2',
    mentorName: 'Ana Costa',
    type: 'technical',
    status: 'pending',
    topic: 'Arquitetura de Microserviços',
    duration: 90,
  },
];

export default function MentorshipPage() {
  const [mentorshipType, setMentorshipType] = useState<'all' | 'strategic' | 'technical'>('all');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requests] = useState<MentorshipRequest[]>(MOCK_REQUESTS);

  const filteredMentors = MOCK_MENTORS.filter((mentor) => {
    if (mentorshipType === 'all') return true;
    return mentor.type === mentorshipType;
  });

  const getTypeLabel = (type: 'strategic' | 'technical') => {
    return type === 'strategic' ? 'Mentoria Estratégica' : 'Mentoria Técnica';
  };

  const getTypeColor = (type: 'strategic' | 'technical') => {
    return type === 'strategic'
      ? 'bg-purple-500/20 text-purple-300'
      : 'bg-cyan-500/20 text-cyan-300';
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Mentorias"
        description="Conecte-se com mentores especializados em estratégia e tecnologia"
      />

      {/* Tabs */}
      <div className="flex gap-2">
        {(['all', 'strategic', 'technical'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMentorshipType(tab)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              mentorshipType === tab
                ? 'bg-orange-upscale text-white'
                : 'bg-dark-bg3 text-text-muted hover:text-text-primary'
            )}
          >
            {tab === 'all' && 'Todos os Mentores'}
            {tab === 'strategic' && 'Estratégica'}
            {tab === 'technical' && 'Técnica'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentors List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-dark-bg3 border border-dark-border rounded-lg p-6 hover:border-orange-upscale transition-all cursor-pointer"
              onClick={() => setSelectedMentor(mentor)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center text-xl font-bold text-white">
                    {mentor.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{mentor.name}</h3>
                    <p className="text-text-muted text-sm">{mentor.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-orange-upscale text-orange-upscale" />
                        <span className="text-sm font-semibold text-text-primary">{mentor.rating}</span>
                        <span className="text-xs text-text-muted">({mentor.reviews} avaliações)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={cn('text-xs font-medium px-3 py-1 rounded', getTypeColor(mentor.type))}>
                  {getTypeLabel(mentor.type)}
                </span>
              </div>

              <p className="text-text-muted text-sm mb-3">{mentor.bio}</p>

              <div className="mb-4">
                <p className="text-xs text-text-muted mb-2">Áreas de Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((exp) => (
                    <span key={exp} className="text-xs bg-dark-bg4 text-text-muted px-2 py-1 rounded">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Clock className="w-4 h-4" />
                  {mentor.hoursAvailable}h disponíveis
                </div>
                <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors">
                  Solicitar Mentoria
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* My Requests */}
          <div className="bg-dark-bg3 border border-dark-border rounded-lg p-4">
            <h3 className="font-bold text-text-primary mb-4">Minhas Solicitações</h3>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="bg-dark-bg4 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-text-primary text-sm">{request.mentorName}</p>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded',
                        request.status === 'accepted'
                          ? 'bg-green-upscale/20 text-green-upscale-light'
                          : 'bg-orange-upscale/20 text-orange-upscale'
                      )}
                    >
                      {request.status === 'accepted' ? 'Aceita' : 'Pendente'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mb-2">{request.topic}</p>
                  {request.scheduledDate && (
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar className="w-3 h-3" />
                      {request.scheduledDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-dark-bg3 border border-dark-border rounded-lg p-4 space-y-3">
            <div>
              <p className="text-text-muted text-xs mb-1">Total de Mentores</p>
              <p className="text-2xl font-bold text-text-primary">{MOCK_MENTORS.length}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs mb-1">Mentorias Ativas</p>
              <p className="text-2xl font-bold text-text-primary">
                {requests.filter((r) => r.status === 'accepted').length}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs mb-1">Horas Disponíveis</p>
              <p className="text-2xl font-bold text-text-primary">
                {MOCK_MENTORS.reduce((sum, m) => sum + m.hoursAvailable, 0)}h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

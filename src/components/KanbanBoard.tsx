'use client';

import { useState } from 'react';
import { GripVertical, Plus, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

interface Mentor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
}

interface ProjectCard {
  id: string;
  name: string;
  program: 'ignite-up' | 'scale-up';
  team: TeamMember[];
  mentors: Mentor[];
  progress: number;
  hasContract: boolean;
  hasMeeting: boolean;
  documents: number;
}

interface KanbanStage {
  id: string;
  name: string;
  color: string;
  cards: ProjectCard[];
}

const STAGES: KanbanStage[] = [
  { id: '1', name: 'Inscrição', color: '#e85d04', cards: [] },
  { id: '2', name: 'Triagem', color: '#ff7e3a', cards: [] },
  { id: '3', name: 'Stand-by', color: '#5db329', cards: [] },
  { id: '4', name: 'Aceleração', color: '#7ed44a', cards: [] },
  { id: '5', name: 'Pós-Aceleração', color: '#1e6b00', cards: [] },
  { id: '6', name: 'Investimento', color: '#c44a00', cards: [] },
  { id: '7', name: 'Equity', color: '#1e2a44', cards: [] },
  { id: '8', name: 'Exit', color: '#8a95a8', cards: [] },
  { id: '9', name: 'Churn', color: '#a8b2c4', cards: [] },
];

// Mock data
const MOCK_PROJECTS: ProjectCard[] = [
  {
    id: '1',
    name: 'AgroSense AI',
    program: 'ignite-up',
    team: [
      { id: '1', name: 'João Silva', avatar: 'J' },
      { id: '2', name: 'Maria Santos', avatar: 'M' },
    ],
    mentors: [
      { id: '1', name: 'Felipe Froes', specialization: 'Estratégia', rating: 4.8 },
    ],
    progress: 65,
    hasContract: true,
    hasMeeting: true,
    documents: 5,
  },
  {
    id: '2',
    name: 'Saúde+ Connect',
    program: 'ignite-up',
    team: [{ id: '3', name: 'Carlos Oliveira', avatar: 'C' }],
    mentors: [],
    progress: 40,
    hasContract: false,
    hasMeeting: false,
    documents: 2,
  },
  {
    id: '3',
    name: 'LogiTrack 360',
    program: 'scale-up',
    team: [
      { id: '4', name: 'Ana Costa', avatar: 'A' },
      { id: '5', name: 'Roberto Lima', avatar: 'R' },
    ],
    mentors: [
      { id: '2', name: 'Ana Costa', specialization: 'Técnica', rating: 4.9 },
    ],
    progress: 80,
    hasContract: true,
    hasMeeting: true,
    documents: 8,
  },
];

export function KanbanBoard() {
  const [stages, setStages] = useState<KanbanStage[]>(
    STAGES.map((stage, idx) => ({
      ...stage,
      cards: idx === 0 ? MOCK_PROJECTS : [],
    }))
  );
  const [draggedCard, setDraggedCard] = useState<{ card: ProjectCard; fromStage: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDragStart = (card: ProjectCard, stageId: string) => {
    setDraggedCard({ card, fromStage: stageId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toStageId: string) => {
    if (!draggedCard) return;

    setStages((prevStages) =>
      prevStages.map((stage) => {
        if (stage.id === draggedCard.fromStage) {
          return {
            ...stage,
            cards: stage.cards.filter((c) => c.id !== draggedCard.card.id),
          };
        }
        if (stage.id === toStageId) {
          return {
            ...stage,
            cards: [...stage.cards, draggedCard.card],
          };
        }
        return stage;
      })
    );

    setDraggedCard(null);
  };

  const filteredStages = stages.map((stage) => ({
    ...stage,
    cards: stage.cards.filter((card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-bg3 border border-dark-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-upscale"
          />
        </div>
        <button className="px-4 py-2 bg-dark-bg3 border border-dark-border rounded-lg text-text-muted hover:text-text-primary transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </button>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {filteredStages.map((stage) => (
            <div
              key={stage.id}
              className="w-80 flex-shrink-0 bg-dark-bg2 rounded-lg border border-dark-border overflow-hidden"
            >
              {/* Stage Header */}
              <div
                className="px-4 py-3 border-b border-dark-border"
                style={{
                  backgroundColor: stage.color + '15',
                  borderTopColor: stage.color,
                  borderTopWidth: '3px',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    ></div>
                    <h3 className="font-semibold text-text-primary">{stage.name}</h3>
                    <span className="text-xs text-text-muted bg-dark-bg3 px-2 py-1 rounded">
                      {stage.cards.length}
                    </span>
                  </div>
                  <button className="text-text-muted hover:text-text-primary transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cards Container */}
              <div
                className="p-3 space-y-3 min-h-96 max-h-[600px] overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {stage.cards.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                    Arraste projetos aqui
                  </div>
                ) : (
                  stage.cards.map((card) => (
                    <ProjectCardComponent
                      key={card.id}
                      card={card}
                      stageId={stage.id}
                      onDragStart={handleDragStart}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProjectCardComponentProps {
  card: ProjectCard;
  stageId: string;
  onDragStart: (card: ProjectCard, stageId: string) => void;
}

function ProjectCardComponent({ card, stageId, onDragStart }: ProjectCardComponentProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(card, stageId)}
      className="bg-dark-bg3 border border-dark-border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-orange-upscale transition-all group"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-text-primary text-sm mb-1">{card.name}</h4>
          <span
            className={cn(
              'text-xs font-medium px-2 py-1 rounded',
              card.program === 'ignite-up'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-cyan-500/20 text-cyan-300'
            )}
          >
            {card.program === 'ignite-up' ? 'Ignite Up' : 'Scale Up'}
          </span>
        </div>
        <GripVertical className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-muted">Progresso</span>
          <span className="text-xs font-semibold text-text-primary">{card.progress}%</span>
        </div>
        <div className="w-full bg-dark-bg4 rounded-full h-2">
          <div
            className="bg-gradient-progress h-2 rounded-full transition-all"
            style={{ width: `${card.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Team Members */}
      {card.team.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-text-muted mb-2">Equipe</p>
          <div className="flex -space-x-2">
            {card.team.map((member) => (
              <div
                key={member.id}
                className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white border border-dark-bg2"
                title={member.name}
              >
                {member.avatar}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mentors */}
      {card.mentors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-text-muted mb-2">Mentores</p>
          <div className="space-y-1">
            {card.mentors.map((mentor) => (
              <div key={mentor.id} className="flex items-center justify-between bg-dark-bg4 rounded px-2 py-1">
                <span className="text-xs text-text-primary">{mentor.name}</span>
                <span className="text-xs text-orange-upscale">⭐ {mentor.rating}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-border">
        <button
          className={cn(
            'text-xs py-1 rounded transition-colors',
            card.hasContract
              ? 'bg-green-upscale/20 text-green-upscale-light'
              : 'bg-dark-bg4 text-text-muted hover:text-text-primary'
          )}
          title="Contrato"
        >
          📄 Contrato
        </button>
        <button
          className={cn(
            'text-xs py-1 rounded transition-colors',
            card.hasMeeting
              ? 'bg-green-upscale/20 text-green-upscale-light'
              : 'bg-dark-bg4 text-text-muted hover:text-text-primary'
          )}
          title="Reunião"
        >
          📞 Reunião
        </button>
        <button className="text-xs py-1 rounded bg-dark-bg4 text-text-muted hover:text-text-primary transition-colors">
          📁 {card.documents}
        </button>
      </div>
    </div>
  );
}

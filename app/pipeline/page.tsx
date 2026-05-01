'use client';

import { useState } from 'react';
import { BarChart3, Plus, Search, Filter } from 'lucide-react';
import { PageHeader } from '@/src/components/PageHeader';

const stages = [
  { id: 'inscricao', label: 'Inscrição', color: 'from-blue-500 to-blue-600' },
  { id: 'triagem', label: 'Triagem', color: 'from-purple-500 to-purple-600' },
  { id: 'validacao', label: 'Validação', color: 'from-pink-500 to-pink-600' },
  { id: 'entrevista', label: 'Entrevista', color: 'from-orange-500 to-orange-600' },
  { id: 'aceleracao', label: 'Aceleração', color: 'from-cyan-500 to-cyan-600' },
  { id: 'mentoria', label: 'Mentoria', color: 'from-green-500 to-green-600' },
  { id: 'demo-day', label: 'Demo Day', color: 'from-indigo-500 to-indigo-600' },
  { id: 'pitch-final', label: 'Pitch Final', color: 'from-rose-500 to-rose-600' },
];

const mockCards = {
  inscricao: [
    { id: 1, title: 'FinTrader Pro', program: 'Ignite Up', score: 85 },
    { id: 2, title: 'TechFlow', program: 'Scale Up', score: 72 },
    { id: 3, title: 'GreenEnergy AI', program: 'Ignite Up', score: 90 },
  ],
  triagem: [
    { id: 4, title: 'AgroSense AI', program: 'Ignite Up', score: 88 },
    { id: 5, title: 'HealthTech Plus', program: 'Scale Up', score: 75 },
  ],
  validacao: [
    { id: 6, title: 'Saúde+ Connect', program: 'Ignite Up', score: 82 },
  ],
  entrevista: [
    { id: 7, title: 'DataViz Pro', program: 'Scale Up', score: 78 },
  ],
  aceleracao: [
    { id: 8, title: 'LogiTrack 360', program: 'Scale Up', score: 91 },
  ],
  mentoria: [],
  'demo-day': [],
  'pitch-final': [],
};

export default function PipelinePage() {
  const [cards, setCards] = useState(mockCards);
  const [draggedCard, setDraggedCard] = useState<any>(null);

  const handleDragStart = (e: React.DragEvent, card: any, fromStage: string) => {
    setDraggedCard({ card, fromStage });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toStage: string) => {
    e.preventDefault();
    if (!draggedCard) return;

    const { card, fromStage } = draggedCard;

    if (fromStage !== toStage) {
      setCards((prev) => ({
        ...prev,
        [fromStage]: prev[fromStage as keyof typeof prev].filter((c) => c.id !== card.id),
        [toStage]: [...prev[toStage as keyof typeof prev], card],
      }));
    }

    setDraggedCard(null);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Pipeline de Projetos"
        description="Arraste os cards para mover entre etapas"
      />

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 bg-dark-card border border-dark-border rounded-xl p-4"
            >
              {/* Stage Header */}
              <div className="mb-4 pb-4 border-b border-dark-border">
                <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${stage.color} text-white text-sm font-semibold mb-2`}>
                  {stage.label}
                </div>
                <p className="text-xs text-slate-400">
                  {cards[stage.id as keyof typeof cards]?.length || 0} projetos
                </p>
              </div>

              {/* Cards Container */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="space-y-3 min-h-96 bg-slate-800/20 rounded-lg p-3"
              >
                {cards[stage.id as keyof typeof cards]?.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card, stage.id)}
                    className="bg-dark-card border border-dark-border rounded-lg p-4 cursor-move hover:border-brand-primary transition-colors group"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <GripVertical className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{card.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{card.program}</p>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
                      <span className="text-xs text-slate-400">Score IA</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              card.score >= 85
                                ? 'bg-green-500'
                                : card.score >= 70
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${card.score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-white">{card.score}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Card Button */}
                <button className="w-full py-2 px-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-slate-300 hover:border-slate-500 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-dark-card border border-dark-border rounded-xl">
        <h3 className="text-sm font-semibold text-white mb-3">Legenda de Score IA</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-400">Excelente (85+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-slate-400">Bom (70-84)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-slate-400">Revisar (&lt;70)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

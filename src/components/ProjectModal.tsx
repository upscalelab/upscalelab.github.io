'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  options?: string[];
  required?: boolean;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: {
    id: string;
    name: string;
    program: string;
    stage: string;
    team: string[];
    mentors: string[];
    documents: string[];
  };
  onSave?: (data: any) => void;
}

const defaultFields: ProjectField[] = [
  { id: 'name', label: 'Nome do Projeto', value: '', type: 'text', required: true },
  { id: 'program', label: 'Programa', value: '', type: 'select', options: ['Ignite Up', 'Scale Up'], required: true },
  { id: 'stage', label: 'Etapa', value: '', type: 'select', options: ['Inscrição', 'Triagem', 'Stand-by', 'Aceleração', 'Pós-Aceleração', 'Investimento', 'Equity', 'Exit', 'Churn'], required: true },
  { id: 'description', label: 'Descrição', value: '', type: 'textarea' },
  { id: 'marketSize', label: 'Tamanho do Mercado', value: '', type: 'text' },
  { id: 'teamSize', label: 'Tamanho da Equipe', value: '', type: 'number' },
];

export function ProjectModal({ isOpen, onClose, project, onSave }: ProjectModalProps) {
  const [fields, setFields] = useState<ProjectField[]>(
    project
      ? defaultFields.map((f) => ({
          ...f,
          value: (project as any)[f.id] || '',
        }))
      : defaultFields
  );
  const [team, setTeam] = useState<string[]>(project?.team || []);
  const [mentors, setMentors] = useState<string[]>(project?.mentors || []);
  const [newTeamMember, setNewTeamMember] = useState('');
  const [newMentor, setNewMentor] = useState('');

  const handleFieldChange = (id: string, value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.trim()) {
      setTeam([...team, newTeamMember]);
      setNewTeamMember('');
    }
  };

  const handleRemoveTeamMember = (index: number) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  const handleAddMentor = () => {
    if (newMentor.trim()) {
      setMentors([...mentors, newMentor]);
      setNewMentor('');
    }
  };

  const handleRemoveMentor = (index: number) => {
    setMentors(mentors.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const data = {
      ...Object.fromEntries(fields.map((f) => [f.id, f.value])),
      team,
      mentors,
    };
    onSave?.(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">
            {project ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg4 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Informações do Projeto</h3>
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {field.label}
                  {field.required && <span className="text-orange-upscale ml-1">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-upscale resize-none"
                    rows={4}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-orange-upscale"
                  >
                    <option value="">Selecione...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-upscale"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-text-primary">Membros da Equipe</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                placeholder="Nome do membro..."
                className="flex-1 px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-upscale"
              />
              <button
                onClick={handleAddTeamMember}
                className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            <div className="space-y-2">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-dark-bg4 p-3 rounded-lg border border-dark-border"
                >
                  <span className="text-text-primary">{member}</span>
                  <button
                    onClick={() => handleRemoveTeamMember(idx)}
                    className="p-1 hover:bg-dark-border rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mentors */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-text-primary">Mentores Atribuídos</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMentor}
                onChange={(e) => setNewMentor(e.target.value)}
                placeholder="Nome do mentor..."
                className="flex-1 px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-upscale"
              />
              <button
                onClick={handleAddMentor}
                className="px-4 py-2 bg-green-upscale hover:opacity-90 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            <div className="space-y-2">
              {mentors.map((mentor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-dark-bg4 p-3 rounded-lg border border-dark-border"
                >
                  <span className="text-text-primary">{mentor}</span>
                  <button
                    onClick={() => handleRemoveMentor(idx)}
                    className="p-1 hover:bg-dark-border rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-dark-card border-t border-dark-border p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-dark-bg4 hover:bg-dark-border text-text-primary rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors"
          >
            Salvar Projeto
          </button>
        </div>
      </div>
    </div>
  );
}

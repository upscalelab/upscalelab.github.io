'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageLayout } from '@/src/components/PageLayout';
import { ProjectModal } from '@/src/components/ProjectModal';
import { KanbanBoard } from '@/src/components/KanbanBoard';

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleNewProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (data: any) => {
    console.log('Projeto salvo:', data);
    // TODO: Integrar com banco de dados
  };

  return (
    <PageLayout
      title="Gestão de Projetos"
      description="Acompanhe todos os projetos através do pipeline de aceleração com sistema Kanban interativo"
      showBackButton={true}
      backPath="/dashboard"
    >
      <div className="p-8 space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div></div>
          <button
            onClick={handleNewProject}
            className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </button>
        </div>

        {/* Kanban Board */}
        <div className="bg-dark-bg3 rounded-lg border border-dark-border p-6">
          <KanbanBoard onEditProject={handleEditProject} />
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />
    </PageLayout>
  );
}

'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
}

const formSteps: FormStep[] = [
  {
    id: 1,
    title: 'Informações Básicas',
    description: 'Dados fundamentais sobre sua startup',
    fields: ['Nome da Empresa', 'Setor/Indústria', 'Data de Fundação', 'Website'],
  },
  {
    id: 2,
    title: 'Descrição da Ideia',
    description: 'Detalhe sua proposta de valor',
    fields: ['Problema a Resolver', 'Solução Proposta', 'Mercado Alvo', 'Diferencial Competitivo'],
  },
  {
    id: 3,
    title: 'Equipe',
    description: 'Informações sobre os fundadores',
    fields: ['Nome Fundador 1', 'Experiência Fundador 1', 'Nome Fundador 2', 'Experiência Fundador 2'],
  },
  {
    id: 4,
    title: 'Financeiro',
    description: 'Dados de receita e projeções',
    fields: ['Receita Mensal Atual', 'Clientes Ativos', 'Projeção 12 Meses', 'Rodada de Investimento'],
  },
  {
    id: 5,
    title: 'Documentos',
    description: 'Envie seus documentos',
    fields: ['Pitch Deck', 'Plano Financeiro', 'Demonstrações Financeiras', 'Termo de Constituição'],
  },
];

export default function InscriptionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Aqui você enviaria os dados para a IA
  };

  const step = formSteps[currentStep - 1];
  const progress = (currentStep / formSteps.length) * 100;

  if (submitted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-upscale/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-upscale-light" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Inscrição Recebida!</h1>
          <p className="text-text-muted mb-6">
            Sua inscrição foi enviada com sucesso. Nosso sistema de IA analisará sua startup e você receberá um feedback em até 24 horas.
          </p>
          <div className="bg-dark-bg3 border border-dark-border rounded-lg p-4 mb-6">
            <p className="text-sm text-text-muted mb-2">Próximas Etapas:</p>
            <ul className="text-sm text-text-muted space-y-1">
              <li>✓ Análise automática com IA</li>
              <li>✓ Validação pela equipe UpScale Lab</li>
              <li>✓ Entrevista com mentores</li>
            </ul>
          </div>
          <button
            onClick={() => setCurrentStep(1)}
            className="w-full px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Formulário de Inscrição</h1>
        <p className="text-text-muted">Preencha todas as informações para sua inscrição no programa UpScale Lab</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-text-primary">Etapa {currentStep} de {formSteps.length}</p>
          <p className="text-sm text-text-muted">{Math.round(progress)}%</p>
        </div>
        <div className="w-full bg-dark-bg4 rounded-full h-2">
          <div
            className="bg-gradient-progress h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-dark-bg3 border border-dark-border rounded-lg p-8 space-y-6">
        {/* Step Header */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">{step.title}</h2>
          <p className="text-text-muted">{step.description}</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {step.fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-text-primary mb-2">{field}</label>
              <input
                type="text"
                placeholder={`Digite ${field.toLowerCase()}...`}
                value={formData[field] || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-upscale"
              />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-6 border-t border-dark-border">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={cn(
              'px-6 py-2 rounded-lg transition-colors',
              currentStep === 1
                ? 'bg-dark-bg4 text-text-muted cursor-not-allowed'
                : 'bg-dark-bg4 text-text-primary hover:bg-dark-border'
            )}
          >
            Anterior
          </button>

          {currentStep < formSteps.length ? (
            <button
              onClick={handleNext}
              className="ml-auto px-6 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-2 bg-green-upscale hover:bg-green-upscale-light text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar Inscrição
            </button>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-orange-upscale/10 border border-orange-upscale/20 rounded-lg p-4">
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-orange-upscale">💡 Dica:</span> Quanto mais detalhes você fornecer, melhor será a análise da IA. Certifique-se de que todas as informações estão corretas antes de enviar.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useMindStudioTriage } from '@/src/hooks/useMindStudioTriage';
import { CheckCircle, AlertCircle, XCircle, Loader } from 'lucide-react';

interface TriageFormProps {
  onTriageComplete?: (result: any) => void;
}

export function TriageForm({ onTriageComplete }: TriageFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('Inscrição');
  const [teamSize, setTeamSize] = useState('');
  const [fundingRaised, setFundingRaised] = useState('');
  const [result, setResult] = useState<any>(null);

  const { runTriage, isLoading, error } = useMindStudioTriage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const triageResult = await runTriage({
      companyName,
      description,
      stage,
      teamSize: teamSize ? parseInt(teamSize) : undefined,
      fundingRaised: fundingRaised ? parseFloat(fundingRaised) : undefined,
    });

    if (triageResult) {
      setResult(triageResult);
      onTriageComplete?.(triageResult);
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'approve':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'reject':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'approve':
        return 'Aprovado';
      case 'reject':
        return 'Rejeitado';
      default:
        return 'Revisão Necessária';
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Nome da Empresa *
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex: TechStartup Brasil"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Descrição da Startup *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o modelo de negócio, problema que resolve, mercado alvo, etc..."
            rows={4}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary resize-none"
            required
          />
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Estágio Atual
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
          >
            <option>Inscrição</option>
            <option>Triagem</option>
            <option>Stand-by</option>
            <option>Aceleração</option>
            <option>Pós-Aceleração</option>
          </select>
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tamanho do Time
          </label>
          <input
            type="number"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            placeholder="Número de pessoas"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* Funding Raised */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Capital Levantado (R$)
          </label>
          <input
            type="number"
            value={fundingRaised}
            onChange={(e) => setFundingRaised(e.target.value)}
            placeholder="Ex: 100000"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-brand text-white font-semibold py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Analisando...
            </>
          ) : (
            'Executar Triage'
          )}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            {getRecommendationIcon(result.recommendation)}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {getRecommendationText(result.recommendation)}
              </h3>
              <p className="text-sm text-slate-400">
                Confiança: {result.confidence}%
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Score de Viabilidade:</span>
              <span className="text-white font-semibold">{result.score}/100</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-brand h-2 rounded-full"
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-sm">Razão:</span>
            <p className="text-white mt-1">{result.reasoning}</p>
          </div>

          <div>
            <span className="text-slate-400 text-sm">Estágio Sugerido:</span>
            <p className="text-white font-semibold mt-1">{result.suggestedStage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

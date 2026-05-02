'use client';

import { useState } from 'react';
import { TriageForm } from '@/src/components/TriageForm';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const stages = [
  'Inscrição',
  'Triagem',
  'Stand-by',
  'Aceleração',
  'Pós-Aceleração',
  'Investimento',
  'Equity',
  'Exit',
  'Churn',
];

export default function TriagePage() {
  const [triageResults, setTriageResults] = useState<any[]>([]);

  const handleTriageComplete = (result: any) => {
    setTriageResults([result, ...triageResults]);
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'approve':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'reject':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'approve':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'reject':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-bg to-slate-900 border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Triagem de Startups</h1>
          <p className="text-slate-400">
            Analise automaticamente startups com IA para determinar o melhor caminho no programa de aceleração
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Novo Triage</h2>
              <TriageForm onTriageComplete={handleTriageComplete} />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {triageResults.length === 0 ? (
              <div className="bg-dark-card border border-dark-border rounded-lg p-12 text-center">
                <div className="text-slate-400 mb-4">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Nenhum triage realizado</h3>
                <p className="text-slate-400">
                  Preencha o formulário à esquerda para começar a análise de startups
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Histórico de Triages ({triageResults.length})
                </h2>

                {triageResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-brand-primary transition-colors"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getRecommendationIcon(result.recommendation)}
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Triage #{triageResults.length - index}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {new Date().toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRecommendationBadge(
                          result.recommendation
                        )}`}
                      >
                        {result.recommendation === 'approve'
                          ? 'Aprovado'
                          : result.recommendation === 'reject'
                          ? 'Rejeitado'
                          : 'Revisar'}
                      </span>
                    </div>

                    {/* Score Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-300">Score de Viabilidade</span>
                        <span className="text-lg font-bold text-white">{result.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-brand h-2 rounded-full transition-all"
                          style={{ width: `${result.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-800/50 rounded p-3">
                        <p className="text-xs text-slate-400 mb-1">Confiança</p>
                        <p className="text-lg font-semibold text-white">{result.confidence}%</p>
                      </div>
                      <div className="bg-slate-800/50 rounded p-3">
                        <p className="text-xs text-slate-400 mb-1">Próximo Estágio</p>
                        <p className="text-lg font-semibold text-brand-primary">{result.suggestedStage}</p>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="bg-slate-800/30 rounded p-4 border border-slate-700">
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-slate-200">Análise: </span>
                        {result.reasoning}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 rounded-lg transition-colors">
                        Aprovar
                      </button>
                      <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors">
                        Revisar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

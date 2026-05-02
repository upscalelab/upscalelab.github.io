'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ApplicationFormData {
  companyName: string;
  description: string;
  website?: string;
  teamSize: number;
  marketSize: string;
  fundingNeeded: number;
  program: 'ignite-up' | 'scale-up';
}

export default function ApplyPage() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState<'login' | 'form' | 'submitted'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    companyName: '',
    description: '',
    website: '',
    teamSize: 1,
    marketSize: '',
    fundingNeeded: 0,
    program: 'ignite-up',
  });
  const [error, setError] = useState<string | null>(null);
  const [triageResult, setTriageResult] = useState<any>(null);

  // Redirect if already logged in
  if (status === 'authenticated' && step === 'login') {
    setStep('form');
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { redirect: false });
    } catch (err) {
      setError('Erro ao fazer login com Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'teamSize' || name === 'fundingNeeded' ? Number(value) : value,
    }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Enviar para triage automática (MindStudio)
      const triageResponse = await fetch('/api/triage/mindstudio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          description: formData.description,
          stage: 'Inscrição',
          teamSize: formData.teamSize,
          fundingRaised: 0,
        }),
      });

      if (!triageResponse.ok) {
        throw new Error('Erro ao processar triage');
      }

      const triage = await triageResponse.json();
      setTriageResult(triage);

      // 2. Salvar inscrição no banco de dados
      const applicationResponse = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userEmail: session?.user?.email,
          userName: session?.user?.name,
          triageScore: triage.score,
          triageRecommendation: triage.recommendation,
          triageDetails: triage.reasoning,
          status: 'pending-validation', // Aguardando validação humana
        }),
      });

      if (!applicationResponse.ok) {
        throw new Error('Erro ao salvar inscrição');
      }

      setStep('submitted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-bg to-slate-900 border-b border-dark-border">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Inscrição - UpScale Lab</h1>
          <p className="text-slate-400">
            Junte-se ao programa de aceleração de startups mais inovador do Brasil
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step 1: Login */}
        {step === 'login' && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Faça Login</h2>
              <p className="text-slate-400">Você precisa estar autenticado para se inscrever</p>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-slate-100 text-dark-bg font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Entrar com Google
                </>
              )}
            </button>

            <div className="text-center text-sm text-slate-400">
              Já tem uma conta?{' '}
              <Link href="/auth/login" className="text-brand-primary hover:text-brand-primary-dark">
                Faça login aqui
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Application Form */}
        {step === 'form' && session && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Informações da Startup</h2>
              <p className="text-slate-400">Bem-vindo, {session.user?.name}!</p>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleFormChange}
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
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Descreva seu modelo de negócio, problema que resolve, mercado alvo..."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary resize-none"
                  required
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleFormChange}
                  placeholder="https://exemplo.com"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tamanho do Time *
                </label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleFormChange}
                  min="1"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              {/* Market Size */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tamanho do Mercado *
                </label>
                <select
                  name="marketSize"
                  value={formData.marketSize}
                  onChange={handleFormChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="< 1M">Menor que R$ 1M</option>
                  <option value="1M - 10M">R$ 1M - R$ 10M</option>
                  <option value="10M - 100M">R$ 10M - R$ 100M</option>
                  <option value="100M - 1B">R$ 100M - R$ 1B</option>
                  <option value="> 1B">Maior que R$ 1B</option>
                </select>
              </div>

              {/* Funding Needed */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Capital Necessário (R$)
                </label>
                <input
                  type="number"
                  name="fundingNeeded"
                  value={formData.fundingNeeded}
                  onChange={handleFormChange}
                  placeholder="0"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Program */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Programa *
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleFormChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  required
                >
                  <option value="ignite-up">Ignite Up (Startups Iniciais)</option>
                  <option value="scale-up">Scale Up (Startups em Escala)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-brand text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Enviar Inscrição'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Submitted */}
        {step === 'submitted' && triageResult && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-8 space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Inscrição Recebida!</h2>
              <p className="text-slate-400">
                Sua inscrição foi processada com sucesso. Você receberá um email com o resultado da análise em breve.
              </p>
            </div>

            {/* Triage Result */}
            <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-white">Análise Automática (IA)</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Score</p>
                  <p className="text-2xl font-bold text-white">{triageResult.score}/100</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Recomendação</p>
                  <p className="text-lg font-bold text-brand-primary capitalize">
                    {triageResult.recommendation === 'approve'
                      ? 'Aprovado'
                      : triageResult.recommendation === 'reject'
                      ? 'Rejeitado'
                      : 'Revisar'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">Análise</p>
                <p className="text-slate-300">{triageResult.reasoning}</p>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500">
                  ⚠️ Esta é uma análise automática. Um especialista revisará sua inscrição em breve.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/dashboard"
                className="inline-block bg-gradient-brand text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                Ir para Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building2, ArrowRight, Loader, Check } from 'lucide-react';

type SignupStep = 'info' | 'company' | 'program' | 'confirm';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: Company
    companyName: '',
    companyDescription: '',
    // Step 3: Program
    program: 'ignite-up' as 'ignite-up' | 'scale-up',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setError('');

    if (step === 'info') {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Por favor, preencha todos os campos');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não conferem');
        return;
      }
      setStep('company');
    } else if (step === 'company') {
      if (!formData.companyName || !formData.companyDescription) {
        setError('Por favor, preencha todos os campos');
        return;
      }
      setStep('program');
    } else if (step === 'program') {
      setStep('confirm');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Aqui você faria uma chamada real para sua API
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });

      // Mock para demonstração
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        role: 'startup',
        company: formData.companyName,
        program: formData.program,
      }));

      // Redirecionar para triagem com IA
      router.push('/startup/inscription');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles: Record<SignupStep, { title: string; description: string }> = {
    info: {
      title: 'Crie sua conta',
      description: 'Informações pessoais para acessar a plataforma',
    },
    company: {
      title: 'Sobre sua empresa',
      description: 'Conte-nos sobre sua startup',
    },
    program: {
      title: 'Escolha seu programa',
      description: 'Selecione o programa mais adequado para sua empresa',
    },
    confirm: {
      title: 'Confirme seus dados',
      description: 'Revise as informações antes de criar sua conta',
    },
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 65% 35%, rgba(232,93,4,.13) 0%, transparent 60%),
              radial-gradient(ellipse 55% 45% at 15% 75%, rgba(93,179,41,.09) 0%, transparent 55%)
            `,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-upscale to-orange-upscale-dark rounded-lg mb-4">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">UpScale Lab</h1>
          <p className="text-text-muted">Inscreva-se para acelerar seu crescimento</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {(['info', 'company', 'program', 'confirm'] as SignupStep[]).map((s, idx) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                step === s || (['info', 'company', 'program', 'confirm'] as SignupStep[]).indexOf(step) > idx
                  ? 'bg-gradient-to-r from-orange-upscale to-orange-upscale-dark'
                  : 'bg-dark-border'
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{stepTitles[step].title}</h2>
            <p className="text-text-muted text-sm">{stepTitles[step].description}</p>
          </div>

          {/* Step 1: Info */}
          {step === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-3 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-orange-upscale transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-orange-upscale transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-orange-upscale transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-orange-upscale transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company */}
          {step === 'company' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nome da Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Nome da sua startup"
                    className="w-full pl-10 pr-4 py-3 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-orange-upscale transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Descrição da Ideia</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  placeholder="Descreva sua ideia de negócio..."
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-orange-upscale transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Program */}
          {step === 'program' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    id: 'ignite-up',
                    title: 'Ignite Up',
                    description: 'Para startups em estágio inicial (pré-seed)',
                    duration: '6-12 meses',
                    pricing: 'Equity + Mensalidade',
                  },
                  {
                    id: 'scale-up',
                    title: 'Scale Up',
                    description: 'Para empresas com tração e gargalos estruturais',
                    duration: '2-6 meses',
                    pricing: 'Equity',
                  },
                ].map((prog) => (
                  <label
                    key={prog.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.program === prog.id
                        ? 'border-orange-upscale bg-orange-upscale/10'
                        : 'border-dark-border hover:border-dark-border/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="program"
                        value={prog.id}
                        checked={formData.program === prog.id}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-text-primary">{prog.title}</h3>
                        <p className="text-sm text-text-muted mt-1">{prog.description}</p>
                        <div className="flex gap-4 mt-3 text-xs text-text-muted">
                          <span>⏱️ {prog.duration}</span>
                          <span>💰 {prog.pricing}</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-dark-bg4 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">Nome:</span>
                  <span className="text-text-primary font-medium">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">Email:</span>
                  <span className="text-text-primary font-medium">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">Empresa:</span>
                  <span className="text-text-primary font-medium">{formData.companyName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">Programa:</span>
                  <span className="text-orange-upscale font-medium">
                    {formData.program === 'ignite-up' ? 'Ignite Up' : 'Scale Up'}
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-bg4" />
                <span className="text-sm text-text-muted">
                  Concordo com os{' '}
                  <Link href="/terms" className="text-orange-upscale hover:text-orange-upscale-light">
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link href="/privacy" className="text-orange-upscale hover:text-orange-upscale-light">
                    Política de Privacidade
                  </Link>
                </span>
              </label>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mt-4">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            {step !== 'info' && (
              <button
                onClick={() => {
                  const steps: SignupStep[] = ['info', 'company', 'program', 'confirm'];
                  const currentIdx = steps.indexOf(step);
                  if (currentIdx > 0) setStep(steps[currentIdx - 1]);
                }}
                className="flex-1 py-3 bg-dark-bg4 hover:bg-dark-border text-text-primary font-bold rounded-lg transition-colors"
              >
                Voltar
              </button>
            )}

            {step !== 'confirm' ? (
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 bg-gradient-to-r from-orange-upscale to-orange-upscale-dark hover:shadow-lg hover:shadow-orange-upscale/30 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-3 bg-gradient-to-r from-green-upscale to-green-upscale-dark hover:shadow-lg hover:shadow-green-upscale/30 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Criar Conta
                  </>
                )}
              </button>
            )}
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-text-muted mt-6">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-orange-upscale hover:text-orange-upscale-light font-medium transition-colors">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

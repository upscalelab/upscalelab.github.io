'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Redirecionar para dashboard por padrão (usuário autenticado)
    // Em produção, verificar token aqui
    if (!redirected) {
      router.push('/dashboard');
      setRedirected(true);
    }
  }, [router, redirected]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p className="text-slate-400">Carregando plataforma...</p>
      </div>
    </div>
  );
}

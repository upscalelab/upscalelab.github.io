import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UpScale Lab - Plataforma de Aceleração',
  description: 'Plataforma profissional para gestão de programas de aceleração Ignite Up e Scale Up',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-dark-bg text-slate-100">
        {children}
      </body>
    </html>
  );
}

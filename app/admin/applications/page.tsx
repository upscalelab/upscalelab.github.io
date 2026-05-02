'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Application {
  id: string;
  companyName: string;
  userEmail: string;
  userName: string;
  triageScore: number;
  triageRecommendation: string;
  status: 'pending-validation' | 'approved' | 'rejected';
  createdAt: string;
}

const ADMIN_EMAIL = 'fsfroez@gmail.com';

export default function AdminApplicationsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Verificar se é admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login');
    }
    if (status === 'authenticated' && session?.user?.email !== ADMIN_EMAIL) {
      redirect('/dashboard');
    }
  }, [status, session]);

  // Carregar aplicações
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications');
        const data = await response.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email === ADMIN_EMAIL) {
      fetchApplications();
    }
  }, [session]);

  const handleApprove = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: 'approved' } : app
          )
        );
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: 'rejected' } : app
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'rejected':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-bg to-slate-900 border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-slate-400">Validação de Inscrições - UpScale Lab</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === f
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {f === 'all'
                ? 'Todas'
                : f === 'pending'
                ? 'Pendentes'
                : f === 'approved'
                ? 'Aprovadas'
                : 'Rejeitadas'}
              {f === 'pending' && ` (${applications.filter((a) => a.status === 'pending-validation').length})`}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">Nenhuma inscrição encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-dark-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Empresa</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Score IA</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, idx) => (
                    <tr
                      key={app.id}
                      className={`border-b border-dark-border hover:bg-slate-800/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-slate-900/20' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{app.companyName}</p>
                        <p className="text-sm text-slate-400">{app.userName}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{app.userEmail}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{app.triageScore}/100</span>
                          <span className="text-xs text-slate-500">
                            ({app.triageRecommendation})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status === 'pending-validation'
                            ? 'Pendente'
                            : app.status === 'approved'
                            ? 'Aprovada'
                            : 'Rejeitada'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {app.status === 'pending-validation' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Total de Inscrições</p>
            <p className="text-3xl font-bold text-white">{applications.length}</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Pendentes de Validação</p>
            <p className="text-3xl font-bold text-yellow-400">
              {applications.filter((a) => a.status === 'pending-validation').length}
            </p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Aprovadas</p>
            <p className="text-3xl font-bold text-green-400">
              {applications.filter((a) => a.status === 'approved').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

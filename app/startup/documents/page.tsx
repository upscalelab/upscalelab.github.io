'use client';

import { useState } from 'react';
import { Upload, FileText, Trash2, Download, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: 'required' | 'optional';
  status: 'uploaded' | 'pending' | 'reviewing';
  uploadedDate?: string;
  fileSize?: string;
}

const documents: Document[] = [
  {
    id: '1',
    name: 'Pitch Deck',
    type: 'required',
    status: 'uploaded',
    uploadedDate: '2024-01-20',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    name: 'Plano Financeiro',
    type: 'required',
    status: 'reviewing',
    uploadedDate: '2024-01-19',
    fileSize: '1.8 MB',
  },
  {
    id: '3',
    name: 'Demonstrações Financeiras',
    type: 'required',
    status: 'pending',
  },
  {
    id: '4',
    name: 'Termo de Constituição',
    type: 'required',
    status: 'uploaded',
    uploadedDate: '2024-01-18',
    fileSize: '0.9 MB',
  },
  {
    id: '5',
    name: 'Contrato de Sócios',
    type: 'optional',
    status: 'uploaded',
    uploadedDate: '2024-01-17',
    fileSize: '1.2 MB',
  },
  {
    id: '6',
    name: 'Pesquisa de Mercado',
    type: 'optional',
    status: 'pending',
  },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(documents);

  const requiredDocs = docs.filter((d) => d.type === 'required');
  const optionalDocs = docs.filter((d) => d.type === 'optional');
  const uploadedDocs = docs.filter((d) => d.status === 'uploaded').length;
  const totalRequired = requiredDocs.length;
  const completionPercentage = (requiredDocs.filter((d) => d.status !== 'pending').length / totalRequired) * 100;

  const handleDelete = (id: string) => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, status: 'pending' as const } : d)));
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Documentos</h1>
        <p className="text-text-muted">Gerencie e compartilhe os documentos da sua startup</p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-brand rounded-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Documentação Obrigatória</h2>
            <p className="text-orange-100">Envie todos os documentos necessários para avançar no processo</p>
          </div>
          <span className="text-3xl font-bold">{Math.round(completionPercentage)}%</span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        <p className="text-sm text-orange-100 mt-3">
          {requiredDocs.filter((d) => d.status !== 'pending').length} de {totalRequired} documentos obrigatórios
        </p>
      </div>

      {/* Required Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Documentos Obrigatórios</h2>

        <div className="space-y-3">
          {requiredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-dark-bg3 border border-dark-border rounded-lg p-4 hover:border-orange-upscale transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      doc.status === 'pending'
                        ? 'bg-dark-bg4 text-text-muted'
                        : doc.status === 'reviewing'
                        ? 'bg-orange-upscale/20 text-orange-upscale'
                        : 'bg-green-upscale/20 text-green-upscale-light'
                    )}
                  >
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{doc.name}</h3>
                    {doc.uploadedDate && (
                      <p className="text-xs text-text-muted">
                        Enviado em {new Date(doc.uploadedDate).toLocaleDateString('pt-BR')} • {doc.fileSize}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-1 rounded',
                      doc.status === 'pending'
                        ? 'bg-dark-bg4 text-text-muted'
                        : doc.status === 'reviewing'
                        ? 'bg-orange-upscale/20 text-orange-upscale'
                        : 'bg-green-upscale/20 text-green-upscale-light'
                    )}
                  >
                    {doc.status === 'pending'
                      ? 'Pendente'
                      : doc.status === 'reviewing'
                      ? 'Em Análise'
                      : 'Enviado'}
                  </span>

                  {doc.status !== 'pending' && (
                    <>
                      <button className="p-2 hover:bg-dark-bg4 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-text-muted hover:text-text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 hover:bg-dark-bg4 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-text-muted hover:text-red-500" />
                      </button>
                    </>
                  )}

                  {doc.status === 'pending' && (
                    <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors flex items-center gap-2 text-sm">
                      <Upload className="w-4 h-4" />
                      Enviar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Documentos Opcionais</h2>

        <div className="space-y-3">
          {optionalDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-dark-bg3 border border-dark-border rounded-lg p-4 hover:border-orange-upscale transition-colors opacity-75"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      doc.status === 'pending'
                        ? 'bg-dark-bg4 text-text-muted'
                        : 'bg-green-upscale/20 text-green-upscale-light'
                    )}
                  >
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{doc.name}</h3>
                    {doc.uploadedDate && (
                      <p className="text-xs text-text-muted">
                        Enviado em {new Date(doc.uploadedDate).toLocaleDateString('pt-BR')} • {doc.fileSize}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-dark-bg4 text-text-muted">
                    Opcional
                  </span>

                  {doc.status !== 'pending' && (
                    <>
                      <button className="p-2 hover:bg-dark-bg4 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-text-muted hover:text-text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 hover:bg-dark-bg4 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-text-muted hover:text-red-500" />
                      </button>
                    </>
                  )}

                  {doc.status === 'pending' && (
                    <button className="px-4 py-2 bg-dark-bg4 hover:bg-dark-border text-text-primary rounded-lg transition-colors flex items-center gap-2 text-sm">
                      <Upload className="w-4 h-4" />
                      Enviar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-blue-400">ℹ️ Informação:</span> Seus documentos são armazenados com segurança no Google Drive. Você pode acessá-los a qualquer momento.
        </p>
      </div>
    </div>
  );
}

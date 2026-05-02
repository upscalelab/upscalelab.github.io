'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Trash2, Eye, Signature, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'uploaded' | 'signed' | 'pending-signature';
  url: string;
  signedBy?: string;
  signedAt?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Contrato de Aceleração.pdf',
      type: 'pdf',
      size: 2.5,
      uploadedAt: '2026-05-01',
      status: 'pending-signature',
      url: '/documents/contrato-aceleracao.pdf',
    },
    {
      id: '2',
      name: 'Termo de Confidencialidade.pdf',
      type: 'pdf',
      size: 1.8,
      uploadedAt: '2026-04-30',
      status: 'signed',
      url: '/documents/termo-confidencialidade.pdf',
      signedBy: 'João Silva',
      signedAt: '2026-04-30 14:30',
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const newDocument: Document = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type.split('/')[1] || 'unknown',
            size: file.size / 1024 / 1024,
            uploadedAt: new Date().toISOString().split('T')[0],
            status: 'uploaded',
            url: data.url,
          };
          setDocuments((prev) => [newDocument, ...prev]);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este documento?')) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSignDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'assinafy' }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirecionar para Assinafy
        window.location.href = data.signatureUrl;
      }
    } catch (error) {
      console.error('Sign error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending-signature':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'pending-signature':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      default:
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-bg to-slate-900 border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Documentos</h1>
          <p className="text-slate-400">Gerencie seus documentos e assinaturas eletrônicas</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Upload de Documentos</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-gradient-brand text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isUploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Enviar Documento
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-brand-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-slate-400 text-sm">Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, TXT</p>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Meus Documentos</h2>

          {documents.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400">Nenhum documento enviado ainda</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-brand-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(doc.status)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{doc.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                        <span>{doc.size.toFixed(2)} MB</span>
                        <span>•</span>
                        <span>{doc.uploadedAt}</span>
                        {doc.signedAt && (
                          <>
                            <span>•</span>
                            <span>Assinado por {doc.signedBy} em {doc.signedAt}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${getStatusBadge(
                        doc.status
                      )}`}
                    >
                      {doc.status === 'signed'
                        ? 'Assinado'
                        : doc.status === 'pending-signature'
                        ? 'Pendente'
                        : 'Enviado'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedDocument(doc);
                        setShowViewer(true);
                      }}
                      className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    {doc.status !== 'signed' && (
                      <button
                        onClick={() => handleSignDocument(doc.id)}
                        className="p-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        title="Assinar"
                      >
                        <Signature className="w-5 h-5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <h2 className="text-xl font-bold text-white">{selectedDocument.name}</h2>
              <button
                onClick={() => setShowViewer(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Viewer */}
            <div className="flex-1 overflow-auto bg-slate-900 flex items-center justify-center p-6">
              {selectedDocument.type === 'pdf' ? (
                <iframe
                  src={selectedDocument.url}
                  className="w-full h-full rounded-lg"
                  title="Document Viewer"
                />
              ) : (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">Visualização não disponível para este tipo de arquivo</p>
                  <a
                    href={selectedDocument.url}
                    download
                    className="inline-block bg-gradient-brand text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Baixar Documento
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-dark-border flex gap-2">
              <button
                onClick={() => setShowViewer(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Fechar
              </button>
              {selectedDocument.status !== 'signed' && (
                <button
                  onClick={() => {
                    handleSignDocument(selectedDocument.id);
                    setShowViewer(false);
                  }}
                  className="flex-1 bg-gradient-brand hover:opacity-90 text-white font-semibold py-2 rounded-lg transition-opacity flex items-center justify-center gap-2"
                >
                  <Signature className="w-5 h-5" />
                  Assinar Documento
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

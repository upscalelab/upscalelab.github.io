'use client';

import { Send, Paperclip, Smile } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  sender: string;
  senderRole: 'startup' | 'support';
  content: string;
  timestamp: string;
  avatar: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Equipe UpScale Lab',
    senderRole: 'support',
    content: 'Olá! Bem-vindo ao chat de suporte. Como podemos ajudar?',
    timestamp: '10:30',
    avatar: '🚀',
  },
  {
    id: '2',
    sender: 'Você',
    senderRole: 'startup',
    content: 'Olá! Tenho uma dúvida sobre o processo de triagem.',
    timestamp: '10:32',
    avatar: '👤',
  },
  {
    id: '3',
    sender: 'Equipe UpScale Lab',
    senderRole: 'support',
    content: 'Claro! A triagem é realizada por um sistema de IA que analisa sua startup em 5 dimensões: mercado, equipe, inovação, viabilidade financeira e encaixe com o programa.',
    timestamp: '10:33',
    avatar: '🚀',
  },
  {
    id: '4',
    sender: 'Você',
    senderRole: 'startup',
    content: 'Quanto tempo leva para receber o resultado?',
    timestamp: '10:35',
    avatar: '👤',
  },
  {
    id: '5',
    sender: 'Equipe UpScale Lab',
    senderRole: 'support',
    content: 'Você receberá o resultado em até 24 horas. Se sua startup for qualificada, você será convidado para uma entrevista com nossos mentores.',
    timestamp: '10:36',
    avatar: '🚀',
  },
];

export default function StartupChatPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: String(messages.length + 1),
        sender: 'Você',
        senderRole: 'startup',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        avatar: '👤',
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-1">Chat de Suporte</h1>
        <p className="text-text-muted">Converse com a equipe UpScale Lab em tempo real</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-dark-bg3 border border-dark-border rounded-lg flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.senderRole === 'startup' ? 'justify-end' : 'justify-start'}`}
            >
              {message.senderRole === 'support' && (
                <div className="w-8 h-8 rounded-full bg-orange-upscale/20 flex items-center justify-center text-lg flex-shrink-0">
                  {message.avatar}
                </div>
              )}

              <div
                className={`max-w-xs ${
                  message.senderRole === 'startup'
                    ? 'bg-orange-upscale text-white rounded-l-lg rounded-tr-lg'
                    : 'bg-dark-bg4 text-text-primary rounded-r-lg rounded-tl-lg'
                }`}
              >
                <p className="px-4 py-2">{message.content}</p>
                <p className={`text-xs px-4 pb-2 ${message.senderRole === 'startup' ? 'text-orange-100' : 'text-text-muted'}`}>
                  {message.timestamp}
                </p>
              </div>

              {message.senderRole === 'startup' && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-lg flex-shrink-0">
                  {message.avatar}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-dark-border p-4">
          <div className="flex gap-3">
            <button className="p-2 hover:bg-dark-bg4 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-text-muted hover:text-text-primary" />
            </button>

            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2 bg-dark-bg4 border border-dark-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-upscale"
            />

            <button className="p-2 hover:bg-dark-bg4 rounded-lg transition-colors">
              <Smile className="w-5 h-5 text-text-muted hover:text-text-primary" />
            </button>

            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

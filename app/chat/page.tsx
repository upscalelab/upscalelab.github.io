'use client';

import { useState } from 'react';
import { Send, Plus, Search } from 'lucide-react';
import { PageHeader } from '@/src/components/PageHeader';

const mockChannels = [
  { id: 1, name: 'Geral', type: 'group', unread: 0 },
  { id: 2, name: 'AgroSense AI', type: 'project', unread: 3 },
  { id: 3, name: 'Saúde+ Connect', type: 'project', unread: 0 },
  { id: 4, name: 'Felipe Froes', type: 'direct', unread: 1 },
  { id: 5, name: 'Ana Costa', type: 'direct', unread: 0 },
];

const mockMessages = [
  { id: 1, sender: 'Felipe Froes', avatar: 'F', message: 'Olá pessoal! Como estão os projetos?', time: '10:30', isOwn: false },
  { id: 2, sender: 'Você', avatar: 'V', message: 'Ótimo Felipe! AgroSense está avançando bem', time: '10:32', isOwn: true },
  { id: 3, sender: 'Ana Costa', avatar: 'A', message: 'Confirmado! Reunião de mentoria agendada para amanhã', time: '10:35', isOwn: false },
  { id: 4, sender: 'Você', avatar: 'V', message: 'Perfeito! Até amanhã então', time: '10:36', isOwn: true },
];

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState(mockChannels[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'Você',
          avatar: 'V',
          message,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
        },
      ]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-dark-bg">
      {/* Sidebar */}
      <div className="w-80 bg-dark-card border-r border-dark-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-dark-border">
          <h2 className="text-lg font-bold text-white mb-3">Mensagens</h2>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-dark-border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {mockChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedChannel.id === channel.id
                    ? 'bg-brand-primary text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {channel.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{channel.name}</p>
                      <p className="text-xs opacity-75">{channel.type === 'group' ? 'Grupo' : channel.type === 'project' ? 'Projeto' : 'Direto'}</p>
                    </div>
                  </div>
                  {channel.unread > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full flex-shrink-0">
                      {channel.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-dark-border bg-dark-card">
          <h3 className="text-lg font-bold text-white">{selectedChannel.name}</h3>
          <p className="text-sm text-slate-400">
            {selectedChannel.type === 'group' ? 'Grupo' : selectedChannel.type === 'project' ? 'Canal de Projeto' : 'Conversa Direta'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isOwn && (
                <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {msg.avatar}
                </div>
              )}
              <div className={`max-w-xs ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                {!msg.isOwn && (
                  <p className="text-xs text-slate-400 mb-1">{msg.sender}</p>
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? 'bg-brand-primary text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-dark-border bg-dark-card">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite uma mensagem..."
              className="flex-1 px-4 py-2 bg-slate-800 border border-dark-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

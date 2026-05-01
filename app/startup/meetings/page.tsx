'use client';

import { Calendar, Clock, User, Video, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';

interface Meeting {
  id: string;
  title: string;
  mentor: string;
  type: 'mentorship' | 'triage' | 'follow-up';
  date: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  videoLink?: string;
}

const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Triagem Inicial - AgroSense AI',
    mentor: 'Felipe Froes',
    type: 'triage',
    date: '2024-02-05',
    time: '14:00',
    duration: '30 min',
    status: 'scheduled',
    videoLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: '2',
    title: 'Mentoria Estratégica - Modelo de Negócios',
    mentor: 'Ana Costa',
    type: 'mentorship',
    date: '2024-02-08',
    time: '10:00',
    duration: '1 hora',
    status: 'scheduled',
    videoLink: 'https://meet.google.com/xyz-uvwx-yz',
  },
  {
    id: '3',
    title: 'Follow-up - Validação de Mercado',
    mentor: 'Roberto Lima',
    type: 'follow-up',
    date: '2024-01-28',
    time: '15:30',
    duration: '45 min',
    status: 'completed',
  },
];

export default function StartupMeetingsPage() {
  const [upcomingMeetings] = useState(meetings.filter((m) => m.status === 'scheduled'));
  const [pastMeetings] = useState(meetings.filter((m) => m.status === 'completed'));

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'triage':
        return 'Triagem';
      case 'mentorship':
        return 'Mentoria';
      case 'follow-up':
        return 'Follow-up';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'triage':
        return 'bg-orange-upscale/20 text-orange-upscale';
      case 'mentorship':
        return 'bg-green-upscale/20 text-green-upscale-light';
      case 'follow-up':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-dark-bg4 text-text-muted';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Reuniões</h1>
          <p className="text-text-muted">Gerencie suas reuniões com mentores e equipe UpScale Lab</p>
        </div>
        <button className="px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agendar Reunião
        </button>
      </div>

      {/* Upcoming Meetings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Próximas Reuniões</h2>

        {upcomingMeetings.length === 0 ? (
          <div className="bg-dark-bg3 border border-dark-border rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-text-muted">Nenhuma reunião agendada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-dark-bg3 border border-dark-border rounded-lg p-6 hover:border-orange-upscale transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">{meeting.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {meeting.mentor}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(meeting.type)}`}>
                        {getTypeLabel(meeting.type)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-dark-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-orange-upscale" />
                    <span className="text-text-muted">
                      {new Date(meeting.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-orange-upscale" />
                    <span className="text-text-muted">{meeting.time} • {meeting.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="w-4 h-4 text-orange-upscale" />
                    <span className="text-text-muted">Vídeo Chamada</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={meeting.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-orange-upscale hover:bg-orange-upscale-light text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Entrar na Reunião
                  </a>
                  <button className="px-4 py-2 bg-dark-bg4 hover:bg-dark-border text-text-primary rounded-lg transition-colors">
                    Reagendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Meetings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Reuniões Anteriores</h2>

        {pastMeetings.length === 0 ? (
          <div className="bg-dark-bg3 border border-dark-border rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-text-muted">Nenhuma reunião anterior</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-dark-bg3 border border-dark-border rounded-lg p-6 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">{meeting.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {meeting.mentor}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(meeting.type)}`}>
                        {getTypeLabel(meeting.type)}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-upscale/20 text-green-upscale-light">
                        Concluída
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-sm text-text-muted">
                    <p>{new Date(meeting.date).toLocaleDateString('pt-BR')}</p>
                    <p>{meeting.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

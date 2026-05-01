'use client';

import { useState } from 'react';
import { Video, Calendar, Users, Plus, Clock, MapPin, Phone, PhoneOff } from 'lucide-react';
import { PageHeader } from '@/src/components/PageHeader';
import { VideoRoom } from '@/src/components/VideoRoom';

const mockMeetings = [
  {
    id: 1,
    title: 'Entrevista de Triagem — FinTrader Pro',
    type: 'screening',
    date: '06/03/2026',
    time: '10:00',
    participants: ['Felipe Froes', 'João Silva', 'Maria Santos'],
    status: 'scheduled',
    project: 'FinTrader Pro',
  },
  {
    id: 2,
    title: 'Sessão de Mentoria — AgroSense AI',
    type: 'mentoring',
    date: '05/03/2026',
    time: '14:00',
    participants: ['Felipe Froes', 'Carlos Oliveira'],
    status: 'scheduled',
    project: 'AgroSense AI',
  },
  {
    id: 3,
    title: 'Check-in Semanal — Scale Up Cohort',
    type: 'general',
    date: '28/02/2026',
    time: '09:00',
    participants: ['Ana Costa', 'Roberto Lima', 'Lucas Martins'],
    status: 'completed',
    project: 'Scale Up Cohort',
  },
  {
    id: 4,
    title: 'Apresentação Final — Saúde+ Connect',
    type: 'presentation',
    date: '10/03/2026',
    time: '16:00',
    participants: ['Felipe Froes', 'Ana Costa', 'Investidores'],
    status: 'scheduled',
    project: 'Saúde+ Connect',
  },
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [inVideoCall, setInVideoCall] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

  const handleJoinMeeting = (meeting: any) => {
    setSelectedMeeting(meeting);
    setInVideoCall(true);
  };

  const handleLeaveMeeting = () => {
    setInVideoCall(false);
    setSelectedMeeting(null);
  };

  if (inVideoCall && selectedMeeting) {
    return (
      <VideoRoom
        roomName={`meeting-${selectedMeeting.id}`}
        userName="Felipe Froes"
        onLeave={handleLeaveMeeting}
      />
    );
  }

  const filteredMeetings = meetings.filter((m) =>
    filter === 'all' ? true : m.status === filter
  );

  const getMeetingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      screening: 'Triagem',
      mentoring: 'Mentoria',
      presentation: 'Apresentação',
      general: 'Geral',
    };
    return labels[type] || type;
  };

  const getMeetingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      screening: 'from-blue-500 to-blue-600',
      mentoring: 'from-purple-500 to-purple-600',
      presentation: 'from-pink-500 to-pink-600',
      general: 'from-slate-500 to-slate-600',
    };
    return colors[type] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
            <Video className="w-8 h-8" />
            Reuniões
          </h1>
          <p className="text-slate-400">Gestão de vídeo chamadas e mentoria</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-brand text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          Agendar Reunião
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {(['all', 'scheduled', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-brand-primary text-white'
                : 'bg-dark-card border border-dark-border text-slate-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'scheduled' ? 'Agendadas' : 'Realizadas'}
          </button>
        ))}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-brand-primary transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getMeetingTypeColor(meeting.type)} text-white text-xs font-semibold`}>
                    {getMeetingTypeLabel(meeting.type)}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      meeting.status === 'scheduled'
                        ? 'bg-blue-900/30 text-blue-400'
                        : 'bg-green-900/30 text-green-400'
                    }`}
                  >
                    {meeting.status === 'scheduled' ? 'Agendada' : 'Realizada'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{meeting.title}</h3>
              </div>
              {meeting.status === 'scheduled' && (
                <button 
                  onClick={() => handleJoinMeeting(meeting)}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Iniciar
                </button>
              )}
            </div>

            {/* Meeting Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-800/30 rounded-lg">
              {/* Date & Time */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-400">Data e Hora</p>
                  <p className="text-sm font-semibold text-white">
                    {meeting.date} às {meeting.time}
                  </p>
                </div>
              </div>

              {/* Project */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-400">Projeto</p>
                  <p className="text-sm font-semibold text-white">{meeting.project}</p>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-400">Participantes</p>
                  <p className="text-sm font-semibold text-white">{meeting.participants.length} pessoas</p>
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2">Participantes:</p>
              <div className="flex flex-wrap gap-2">
                {meeting.participants.map((participant, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1 bg-slate-800 border border-dark-border rounded-full text-sm text-slate-300"
                  >
                    {participant}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-dark-border">
              {meeting.status === 'scheduled' && (
                <>
                  <button 
                    onClick={() => handleJoinMeeting(meeting)}
                    className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Entrar na Chamada
                  </button>
                  <button className="flex-1 px-4 py-2 border border-dark-border text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                    Editar
                  </button>
                </>
              )}
              {meeting.status === 'completed' && (
                <>
                  <button className="flex-1 px-4 py-2 border border-dark-border text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                    Ver Gravação
                  </button>
                  <button className="flex-1 px-4 py-2 border border-dark-border text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                    Anotações
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Nenhuma reunião encontrada</p>
        </div>
      )}
    </div>
  );
}

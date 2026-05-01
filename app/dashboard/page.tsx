'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, TrendingUp, Calendar } from 'lucide-react';

const pipelineData = [
  { stage: 'Inscrição', ignite: 8, scale: 3 },
  { stage: 'Triagem', ignite: 6, scale: 2 },
  { stage: 'Validação', ignite: 5, scale: 2 },
  { stage: 'Entrevista', ignite: 4, scale: 2 },
  { stage: 'Aceleração', ignite: 3, scale: 1 },
  { stage: 'Mentoria', ignite: 2, scale: 1 },
  { stage: 'Demo Day', ignite: 1, scale: 0 },
  { stage: 'Pitch Final', ignite: 1, scale: 0 },
];

const distributionData = [
  { name: 'Ignite Up', value: 3, color: '#A78BFA' },
  { name: 'Scale Up', value: 2, color: '#22D3EE' },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Visão Geral</h1>
        <p className="text-slate-400">Acompanhamento em tempo real dos programas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Briefcase}
          label="Total de Projetos"
          value="5"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Users}
          label="Mentores Ativos"
          value="3"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Ignite Up"
          value="3"
          subtitle="Startups iniciais"
          color="from-purple-400 to-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Scale Up"
          value="2"
          subtitle="Em escala"
          color="from-cyan-400 to-cyan-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Chart */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Pipeline por Etapa
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="stage" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Legend />
              <Bar dataKey="ignite" fill="#A78BFA" name="Ignite Up" />
              <Bar dataKey="scale" fill="#22D3EE" name="Scale Up" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Chart */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-white mb-4 w-full">Distribuição</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-slate-400">
                  {item.name}: <span className="text-white font-semibold">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Próximas Reuniões
          </h2>
          <div className="space-y-3">
            <MeetingItem
              title="Entrevista de Triagem — FinTrader Pro"
              time="06/03/2026, 10:00:00"
              status="agendada"
            />
            <MeetingItem
              title="Sessão de Mentoria — AgroSense AI"
              time="05/03/2026, 14:00:00"
              status="agendada"
            />
            <MeetingItem
              title="Check-in Semanal — Scale Up Cohort"
              time="28/02/2026, 09:00:00"
              status="realizada"
            />
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Projetos Recentes
          </h2>
          <div className="space-y-3">
            <ProjectItem
              name="AgroSense AI"
              program="Ignite Up"
              stage="Aceleração"
              programColor="from-purple-400 to-purple-500"
            />
            <ProjectItem
              name="Saúde+ Connect"
              program="Ignite Up"
              stage="Validação"
              programColor="from-purple-400 to-purple-500"
            />
            <ProjectItem
              name="LogiTrack 360"
              program="Scale Up"
              stage="Mentoria"
              programColor="from-cyan-400 to-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-brand-primary transition-colors">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function MeetingItem({
  title,
  time,
  status,
}: {
  title: string;
  time: string;
  status: 'agendada' | 'realizada';
}) {
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-slate-400 mt-1">{time}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            status === 'agendada'
              ? 'bg-blue-900/30 text-blue-400'
              : 'bg-green-900/30 text-green-400'
          }`}
        >
          {status === 'agendada' ? 'Agendada' : 'Realizada'}
        </span>
      </div>
    </div>
  );
}

function ProjectItem({
  name,
  program,
  stage,
  programColor,
}: {
  name: string;
  program: string;
  stage: string;
  programColor: string;
}) {
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-white">{name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded bg-gradient-to-r ${programColor} text-white`}>
              {program}
            </span>
          </div>
          <p className="text-xs text-slate-400">{stage}</p>
        </div>
      </div>
    </div>
  );
}

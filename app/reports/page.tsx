'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Download, Filter } from 'lucide-react';
import { PageHeader } from '@/src/components/PageHeader';

const timelineData = [
  { month: 'Jan', ignite: 2, scale: 1 },
  { month: 'Fev', ignite: 5, scale: 2 },
  { month: 'Mar', ignite: 3, scale: 2 },
  { month: 'Abr', ignite: 8, scale: 3 },
  { month: 'Mai', ignite: 6, scale: 2 },
  { month: 'Jun', ignite: 9, scale: 4 },
];

const stageConversionData = [
  { stage: 'Inscrição', rate: 100 },
  { stage: 'Triagem', rate: 75 },
  { stage: 'Validação', rate: 60 },
  { stage: 'Entrevista', rate: 50 },
  { stage: 'Aceleração', rate: 40 },
  { stage: 'Mentoria', rate: 35 },
  { stage: 'Demo Day', rate: 30 },
  { stage: 'Pitch Final', rate: 25 },
];

const programDistribution = [
  { name: 'Ignite Up', value: 65, color: '#A78BFA' },
  { name: 'Scale Up', value: 35, color: '#22D3EE' },
];

const mentorEffectiveness = [
  { mentor: 'Felipe Froes', score: 92 },
  { mentor: 'Ana Costa', score: 88 },
  { mentor: 'Roberto Lima', score: 85 },
  { mentor: 'Carla Mendes', score: 90 },
];

export default function ReportsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="Relatórios"
        description="Analytics e insights da plataforma"
      />

      <div className="flex items-center justify-end mb-8">
        <button className="flex items-center gap-2 px-4 py-2 border border-dark-border text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
          <Download className="w-5 h-5" />
          Exportar
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Total de Projetos" value="28" change="+12%" />
        <MetricCard label="Taxa de Conversão" value="42%" change="+8%" />
        <MetricCard label="Tempo Médio" value="4.2 meses" change="-0.5 meses" />
        <MetricCard label="Satisfação" value="4.7/5" change="+0.2" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Timeline */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Inscrições por Mês</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94A3B8" />
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

        {/* Conversion Funnel */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Taxa de Conversão por Etapa</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageConversionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94A3B8" />
              <YAxis dataKey="stage" type="category" stroke="#94A3B8" width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Bar dataKey="rate" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution & Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Distribution */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold text-white mb-4 w-full">Distribuição de Programas</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={programDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {programDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm w-full">
            {programDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-white font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor Effectiveness */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Efetividade de Mentores</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mentorEffectiveness}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="mentor" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Bar dataKey="score" fill="#A78BFA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="mt-8 bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Métricas Detalhadas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Métrica</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Ignite Up</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Scale Up</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-border hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 text-white">Inscrições</td>
                <td className="py-3 px-4 text-slate-300">18</td>
                <td className="py-3 px-4 text-slate-300">10</td>
                <td className="py-3 px-4 text-white font-semibold">28</td>
              </tr>
              <tr className="border-b border-dark-border hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 text-white">Aprovados</td>
                <td className="py-3 px-4 text-slate-300">12</td>
                <td className="py-3 px-4 text-slate-300">7</td>
                <td className="py-3 px-4 text-white font-semibold">19</td>
              </tr>
              <tr className="border-b border-dark-border hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 text-white">Em Aceleração</td>
                <td className="py-3 px-4 text-slate-300">8</td>
                <td className="py-3 px-4 text-slate-300">5</td>
                <td className="py-3 px-4 text-white font-semibold">13</td>
              </tr>
              <tr className="border-b border-dark-border hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 text-white">Concluídos</td>
                <td className="py-3 px-4 text-slate-300">3</td>
                <td className="py-3 px-4 text-slate-300">2</td>
                <td className="py-3 px-4 text-white font-semibold">5</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 text-white">Taxa de Sucesso</td>
                <td className="py-3 px-4 text-slate-300">25%</td>
                <td className="py-3 px-4 text-slate-300">20%</td>
                <td className="py-3 px-4 text-white font-semibold">23%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className="text-xs text-green-400">{change}</p>
    </div>
  );
}

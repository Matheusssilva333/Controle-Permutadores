import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { usePermutadores } from '../context/PermutadoresContext';
import type { CategoriaPermutador } from '../types/permutador';

export const SCurveChart: React.FC = () => {
  const { curvaS, permutadores } = usePermutadores();

  // Aggregate progress per category
  const categoriesList: CategoriaPermutador[] = [
    'Casco e Tubos',
    'Permutador de Placas',
    'Condensador',
    'Reboiler',
    'Resfriador',
    'Evaporador'
  ];

  const categoryProgressData = categoriesList.map(cat => {
    const items = permutadores.filter(p => p.categoria === cat);
    const count = items.length;
    const avgProgress = count > 0 
      ? Math.round(items.reduce((acc, p) => acc + p.avancoFisicoPct, 0) / count)
      : 0;

    return {
      categoria: cat,
      progresso: avgProgress,
      quantidade: count
    };
  }).filter(c => c.quantidade > 0);

  const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* Curva S - Line Chart (2 Cols) */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Curva S - Avanço Físico Acumulado (Parada RPBC)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparativo entre o Avanço Físico Planejado (%) e Realizado (%) por semana
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" /> Realizado
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-400">
              <span className="w-3 h-0.5 bg-slate-400 inline-block border-dashed" /> Planejado
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curvaS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="semana" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                formatter={(value: any) => [`${value}%`, 'Avanço']}
              />
              <Line 
                type="monotone" 
                dataKey="planejadoAcumulado" 
                name="Planejado %" 
                stroke="#64748b" 
                strokeDasharray="5 5" 
                strokeWidth={2} 
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="realizadoAcumulado" 
                name="Realizado %" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#06b6d4' }}
                activeDot={{ r: 8, stroke: '#67e8f9', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress per Category - Bar Chart (1 Col) */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-400" />
              Progresso por Categoria
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Média de avanço % por tipo de equipamento</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryProgressData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} unit="%" />
              <YAxis dataKey="categoria" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={100} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                formatter={(value: any) => [`${value}%`, 'Média Avanço']}
              />
              <Bar dataKey="progresso" radius={[0, 8, 8, 0]}>
                {categoryProgressData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

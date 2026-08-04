import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Layers, 
  Zap, 
  Users 
} from 'lucide-react';
import { usePermutadores } from '../context/PermutadoresContext';

export const KPIOverview: React.FC = () => {
  const { permutadores } = usePermutadores();

  const totalEquipamentos = permutadores.length;
  
  const totalAvancoReal = permutadores.reduce((acc, p) => acc + p.avancoFisicoPct, 0);
  const totalAvancoPlan = permutadores.reduce((acc, p) => acc + p.avancoPlanejadoPct, 0);
  const mediaAvancoReal = totalEquipamentos > 0 ? Math.round(totalAvancoReal / totalEquipamentos) : 0;
  const mediaAvancoPlan = totalEquipamentos > 0 ? Math.round(totalAvancoPlan / totalEquipamentos) : 0;

  const concluidos = permutadores.filter(p => p.status === 'CONCLUIDO').length;
  const emAtraso = permutadores.filter(p => p.status === 'ATRASADO').length;
  const emAlerta = permutadores.filter(p => p.status === 'ALERTA').length;
  const emDia = permutadores.filter(p => p.status === 'EM_DIA').length;

  const testeHidroConcluido = permutadores.filter(p => 
    p.etapaAtual === 'Teste Hidrostático' || p.etapaAtual === 'Fechamento & Torqueamento' || p.etapaAtual === 'Liberação QA/QC'
  ).length;

  const totalHHPrevisto = permutadores.reduce((acc, p) => acc + p.hhPrevisto, 0);
  const totalHHRealizado = permutadores.reduce((acc, p) => acc + p.hhRealizado, 0);

  // Schedule Performance Index (SPI) = % Real / % Plan
  const spi = mediaAvancoPlan > 0 ? (mediaAvancoReal / mediaAvancoPlan).toFixed(2) : '1.00';
  const spiNumber = parseFloat(spi);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      
      {/* Card 1: Total Equipamentos */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/40 transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Permutadores UT2</span>
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-black text-white">{totalEquipamentos}</p>
          <span className="text-[11px] font-medium text-slate-400">Total Obra 114</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
          <span className="text-cyan-400 font-semibold">{concluidos} entregues</span> • {totalEquipamentos - concluidos} em manutenção
        </div>
      </div>

      {/* Card 2: Avanço Físico Global */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-emerald-500/40 transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avanço Físico Real</span>
          <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-black text-emerald-400">{mediaAvancoReal}%</p>
          <span className="text-xs text-slate-400">Meta: <strong className="text-slate-200">{mediaAvancoPlan}%</strong></span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${mediaAvancoReal}%` }}
          />
        </div>
      </div>

      {/* Card 3: Status da Parada */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-amber-500/40 transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status dos Prazos</span>
          <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/40">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-emerald-400">{emDia}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Em Dia</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-2xl font-black text-amber-400">{emAlerta}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Alerta</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-2xl font-black text-rose-500">{emAtraso}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Atraso</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2.5 border-t border-slate-800/80 pt-2 flex items-center gap-1">
          {emAtraso > 0 ? (
            <span className="text-rose-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {emAtraso} requer atenção de engenharia
            </span>
          ) : (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Cronograma dentro da margem
            </span>
          )}
        </p>
      </div>

      {/* Card 4: Teste Hidrostático & QA-QC */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/40 transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teste Hidrostático</span>
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-black text-cyan-300">{testeHidroConcluido} <span className="text-sm font-normal text-slate-400">/ {totalEquipamentos}</span></p>
          <span className="text-xs text-cyan-400 font-semibold">
            {totalEquipamentos > 0 ? Math.round((testeHidroConcluido / totalEquipamentos) * 100) : 0}%
          </span>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
          <span>Aprovados por IE Petrobras</span>
          <span className="font-mono text-white font-bold">{concluidos} Liberados</span>
        </div>
      </div>

      {/* Card 5: Homens-Hora & SPI */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-blue-500/40 transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Desempenho (SPI)</span>
          <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/40">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <p className={`text-3xl font-black ${spiNumber >= 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {spi} <span className="text-xs font-semibold text-slate-400">SPI</span>
          </p>
          <span className="text-[11px] font-mono text-slate-300">{totalHHRealizado} HH</span>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
          <span>HH Previsto total:</span>
          <span className="font-mono text-slate-300 font-semibold">{totalHHPrevisto} HH</span>
        </div>
      </div>

    </div>
  );
};

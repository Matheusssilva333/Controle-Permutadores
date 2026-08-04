import React from 'react';
import { 
  Wrench, 
  Edit3, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar
} from 'lucide-react';
import type { Permutador } from '../types/permutador';
import { useAuth } from '../context/AuthContext';

interface EquipmentCardProps {
  permutador: Permutador;
  onEdit: (permutador: Permutador) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ permutador, onEdit }) => {
  const { canEdit } = useAuth();

  const getStatusBadge = (status: Permutador['status']) => {
    switch (status) {
      case 'CONCLUIDO':
        return (
          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> CONCLUÍDO
          </span>
        );
      case 'ATRASADO':
        return (
          <span className="bg-rose-950/80 text-rose-400 border border-rose-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> ATRASADO
          </span>
        );
      case 'ALERTA':
        return (
          <span className="bg-amber-950/80 text-amber-400 border border-amber-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> EM ALERTA
          </span>
        );
      default:
        return (
          <span className="bg-blue-950/80 text-blue-400 border border-blue-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-400" /> EM DIA
          </span>
        );
    }
  };

  const getCategoryBadgeColor = (cat: Permutador['categoria']) => {
    switch (cat) {
      case 'Casco e Tubos': return 'bg-cyan-950 text-cyan-300 border-cyan-800/50';
      case 'Permutador de Placas': return 'bg-blue-950 text-blue-300 border-blue-800/50';
      case 'Condensador': return 'bg-purple-950 text-purple-300 border-purple-800/50';
      case 'Reboiler': return 'bg-amber-950 text-amber-300 border-amber-800/50';
      case 'Resfriador': return 'bg-teal-950 text-teal-300 border-teal-800/50';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between relative group shadow-xl hover:shadow-cyan-950/20">
      
      {/* Top Tag & Status */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white font-mono tracking-wider">{permutador.tag}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeColor(permutador.categoria)}`}>
                {permutador.categoria}
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-300 mt-1 line-clamp-2 leading-snug">
              {permutador.descricao}
            </h4>
          </div>
          <div>{getStatusBadge(permutador.status)}</div>
        </div>

        {/* Sub-Unidade Pill & Criticality */}
        <div className="flex items-center justify-between gap-2 my-2.5 pt-2 border-t border-slate-800/60 text-[11px]">
          <span className="text-slate-400 truncate max-w-[200px]" title={permutador.subUnidade}>
            {permutador.subUnidade}
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
            permutador.criticidade === 'ALTA' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' : 'bg-slate-800 text-slate-300'
          }`}>
            CRIT. {permutador.criticidade}
          </span>
        </div>

        {/* Technical Parameters */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900/90 rounded-xl p-2.5 text-center my-3 border border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-medium">Pressão Teste</span>
            <span className="text-xs font-bold text-slate-200 font-mono">{permutador.pressaoTesteKgf} <span className="text-[9px] text-slate-400">kgf</span></span>
          </div>
          <div className="border-x border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-medium">Peso Casco</span>
            <span className="text-xs font-bold text-slate-200 font-mono">{permutador.pesoToneladas} <span className="text-[9px] text-slate-400">ton</span></span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-medium">Área Troca</span>
            <span className="text-xs font-bold text-slate-200 font-mono">{permutador.areaTrocaM2} <span className="text-[9px] text-slate-400">m²</span></span>
          </div>
        </div>

        {/* Maintenance Stage Pill */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Wrench className="w-3 h-3 text-cyan-400" /> Etapa Atual:
            </span>
            <span className="text-cyan-300 font-bold">{permutador.etapaAtual}</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Avanço Físico</span>
              <span className="font-mono font-bold text-white">{permutador.avancoFisicoPct}% <span className="text-[10px] text-slate-500">(Plan: {permutador.avancoPlanejadoPct}%)</span></span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden p-0.5 border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  permutador.avancoFisicoPct >= 100 
                    ? 'bg-emerald-400' 
                    : permutador.avancoFisicoPct < permutador.avancoPlanejadoPct - 10 
                      ? 'bg-rose-500' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${permutador.avancoFisicoPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Dates & Edit Action Button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>Fim Previsto: <strong className="text-slate-200 font-mono">{permutador.dataFimPrevista}</strong></span>
        </div>

        {canEdit ? (
          <button
            onClick={() => onEdit(permutador)}
            className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
          >
            <Edit3 className="w-3 h-3 text-cyan-400" />
            <span>Editar</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800" title="Somente usuários da Whitelist podem alterar este equipamento">
            <Lock className="w-3 h-3 text-amber-500/80" />
            <span>Bloqueado</span>
          </div>
        )}
      </div>

    </div>
  );
};

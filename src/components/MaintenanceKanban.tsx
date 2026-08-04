import React from 'react';
import { 
  Lock, 
  ChevronRight
} from 'lucide-react';
import type { Permutador, EtapaManutencao } from '../types/permutador';
import { usePermutadores } from '../context/PermutadoresContext';
import { useAuth } from '../context/AuthContext';

interface MaintenanceKanbanProps {
  onEdit: (permutador: Permutador) => void;
}

const ETAPAS: EtapaManutencao[] = [
  'Desmontagem e Extração',
  'Limpeza & Jateamento',
  'Inspeção NDT / END',
  'Retubagem & Caldeiraria',
  'Teste Hidrostático',
  'Fechamento & Torqueamento',
  'Liberação QA/QC',
];

export const MaintenanceKanban: React.FC<MaintenanceKanbanProps> = ({ onEdit }) => {
  const { permutadores, filtros, updatePermutador } = usePermutadores();
  const { canEdit } = useAuth();

  // Filter equipment based on current user filters
  const filteredPermutadores = permutadores.filter(p => {
    if (filtros.categoria !== 'TODAS' && p.categoria !== filtros.categoria) return false;
    if (filtros.subUnidade !== 'TODAS' && p.subUnidade !== filtros.subUnidade) return false;
    if (filtros.status !== 'TODOS' && p.status !== filtros.status) return false;
    if (filtros.buscaTag) {
      const q = filtros.buscaTag.toLowerCase();
      if (!p.tag.toLowerCase().includes(q) && !p.descricao.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleAdvanceStage = (p: Permutador) => {
    if (!canEdit) return;
    const currentIndex = ETAPAS.indexOf(p.etapaAtual);
    if (currentIndex < ETAPAS.length - 1) {
      const nextEtapa = ETAPAS[currentIndex + 1];
      const newAvanco = Math.min(100, Math.round(((currentIndex + 2) / ETAPAS.length) * 100));
      updatePermutador({
        ...p,
        etapaAtual: nextEtapa,
        avancoFisicoPct: newAvanco,
        status: newAvanco >= 100 ? 'CONCLUIDO' : p.status,
      });
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      
      {!canEdit && (
        <div className="bg-amber-950/60 border border-amber-800/60 rounded-xl p-3 mb-4 flex items-center gap-2 text-xs text-amber-300">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Modo Somente Leitura Ativo:</strong> Você pode visualizar o fluxo industrial, mas o avanço de etapas de manutenção está bloqueado para seu perfil.
          </span>
        </div>
      )}

      <div className="flex gap-4 min-w-[1400px]">
        {ETAPAS.map((etapa, idx) => {
          const itemsInStage = filteredPermutadores.filter(p => p.etapaAtual === etapa);

          return (
            <div 
              key={etapa} 
              className="flex-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col min-h-[500px]"
            >
              {/* Kanban Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-tight">
                    {etapa}
                  </h4>
                </div>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {itemsInStage.length}
                </span>
              </div>

              {/* Items List inside Column */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {itemsInStage.length === 0 ? (
                  <div className="text-center py-8 text-[11px] text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
                    Sem permutadores nesta etapa
                  </div>
                ) : (
                  itemsInStage.map(perm => (
                    <div
                      key={perm.id}
                      className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 transition-all shadow-md group relative"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-sm font-black text-white font-mono">{perm.tag}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          perm.status === 'CONCLUIDO' ? 'bg-emerald-950 text-emerald-400' :
                          perm.status === 'ATRASADO' ? 'bg-rose-950 text-rose-400' :
                          perm.status === 'ALERTA' ? 'bg-amber-950 text-amber-400' : 'bg-blue-950 text-blue-400'
                        }`}>
                          {perm.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                        {perm.categoria} • {perm.descricao}
                      </p>

                      {/* Progress bar inside card */}
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden my-2 border border-slate-800">
                        <div 
                          className="bg-cyan-500 h-full rounded-full transition-all"
                          style={{ width: `${perm.avancoFisicoPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span>Avanço: <strong className="text-white">{perm.avancoFisicoPct}%</strong></span>
                        <span className="font-mono text-slate-400">{perm.pressaoTesteKgf} kgf</span>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onEdit(perm)}
                          className="text-[10px] text-cyan-400 hover:underline font-semibold"
                        >
                          Detalhar
                        </button>

                        {canEdit && idx < ETAPAS.length - 1 && (
                          <button
                            onClick={() => handleAdvanceStage(perm)}
                            className="bg-slate-800 hover:bg-cyan-900 text-slate-300 hover:text-cyan-200 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors border border-slate-700"
                            title="Avançar para a próxima etapa da parada"
                          >
                            <span>Avançar</span>
                            <ChevronRight className="w-3 h-3 text-cyan-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Edit3, 
  Lock, 
  Trash2
} from 'lucide-react';
import type { Permutador } from '../types/permutador';
import { usePermutadores } from '../context/PermutadoresContext';
import { useAuth } from '../context/AuthContext';

interface EquipmentTableProps {
  onEdit: (permutador: Permutador) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({ onEdit }) => {
  const { permutadores, filtros, deletePermutador } = usePermutadores();
  const { canEdit } = useAuth();

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

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">TAG Equipamento</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Sub-Unidade UT2</th>
              <th className="px-4 py-3">Etapa Atual</th>
              <th className="px-4 py-3 text-center">Avanço Físico (%)</th>
              <th className="px-4 py-3 text-center">P. Teste (kgf)</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredPermutadores.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-500 font-medium">
                  Nenhum permutador encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredPermutadores.map(p => (
                <tr key={p.id} className="hover:bg-slate-850/60 transition-colors">
                  
                  {/* Tag & Description */}
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-white font-mono text-sm">{p.tag}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[240px]" title={p.descricao}>
                      {p.descricao}
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className="px-4 py-3.5 font-semibold text-slate-300">
                    <span className="bg-slate-900 border border-slate-700/60 px-2 py-0.5 rounded text-[11px]">
                      {p.categoria}
                    </span>
                  </td>

                  {/* Sub-Unidade */}
                  <td className="px-4 py-3.5 text-slate-400">
                    {p.subUnidade}
                  </td>

                  {/* Etapa Atual */}
                  <td className="px-4 py-3.5">
                    <span className="text-cyan-300 font-semibold">{p.etapaAtual}</span>
                    <div className="text-[10px] text-slate-500">Resp: {p.responsavelEng}</div>
                  </td>

                  {/* Avanço Físico % */}
                  <td className="px-4 py-3.5 text-center">
                    <div className="font-mono font-bold text-white text-sm">{p.avancoFisicoPct}%</div>
                    <div className="w-20 bg-slate-900 rounded-full h-1.5 mx-auto mt-1 overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full rounded-full ${p.avancoFisicoPct >= 100 ? 'bg-emerald-400' : 'bg-cyan-500'}`} 
                        style={{ width: `${p.avancoFisicoPct}%` }}
                      />
                    </div>
                  </td>

                  {/* Pressão de Teste */}
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-200">
                    {p.pressaoTesteKgf} kgf/cm²
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      p.status === 'CONCLUIDO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      p.status === 'ATRASADO' ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse' :
                      p.status === 'ALERTA' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    {canEdit ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(p)}
                          className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3 text-cyan-400" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => deletePermutador(p.id)}
                          className="p-1 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-900"
                          title="Excluir equipamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                        <Lock className="w-3 h-3 text-amber-500" /> Bloqueado
                      </span>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

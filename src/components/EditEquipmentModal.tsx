import React, { useState, useEffect } from 'react';
import { X, Save, Lock } from 'lucide-react';
import type { Permutador, EtapaManutencao, StatusEquipamento } from '../types/permutador';
import { usePermutadores } from '../context/PermutadoresContext';
import { useAuth } from '../context/AuthContext';

interface EditEquipmentModalProps {
  permutador: Permutador | null;
  onClose: () => void;
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

export const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ permutador, onClose }) => {
  const { updatePermutador } = usePermutadores();
  const { canEdit } = useAuth();

  const [formData, setFormData] = useState<Permutador | null>(null);

  useEffect(() => {
    if (permutador) {
      setFormData({ ...permutador });
    }
  }, [permutador]);

  if (!permutador || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    // Auto update status based on %
    let newStatus: StatusEquipamento = formData.status;
    if (formData.avancoFisicoPct >= 100) newStatus = 'CONCLUIDO';
    
    updatePermutador({
      ...formData,
      status: newStatus
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
              {formData.categoria}
            </span>
            <h3 className="text-lg font-black text-white font-mono mt-1">
              Editar Equipamento {formData.tag}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!canEdit && (
          <div className="bg-amber-950/80 border-b border-amber-800/80 p-3 px-6 flex items-center gap-2 text-xs text-amber-300">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Permissão de edição negada: Seu usuário está em modo leitura.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição Técnica</label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.descricao}
              onChange={e => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-60"
            />
          </div>

          {/* Grid Stage & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Stage Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Etapa Atual de Manutenção</label>
              <select
                disabled={!canEdit}
                value={formData.etapaAtual}
                onChange={e => setFormData({ ...formData, etapaAtual: e.target.value as EtapaManutencao })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-semibold disabled:opacity-60"
              >
                {ETAPAS.map(st => (
                  <option key={st} value={st} className="bg-slate-900 text-slate-200">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status do Cronograma</label>
              <select
                disabled={!canEdit}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as StatusEquipamento })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold disabled:opacity-60"
              >
                <option value="EM_DIA">Em Dia</option>
                <option value="ALERTA">Em Alerta</option>
                <option value="ATRASADO">Atrasado</option>
                <option value="CONCLUIDO">Concluído</option>
              </select>
            </div>

            {/* Avanço Físico % */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Avanço Físico Real (%): <strong className="text-cyan-400 font-mono">{formData.avancoFisicoPct}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                disabled={!canEdit}
                value={formData.avancoFisicoPct}
                onChange={e => setFormData({ ...formData, avancoFisicoPct: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-950"
              />
            </div>

            {/* Avanço Planejado % */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avanço Planejado (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                disabled={!canEdit}
                value={formData.avancoPlanejadoPct}
                onChange={e => setFormData({ ...formData, avancoPlanejadoPct: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono disabled:opacity-60"
              />
            </div>

            {/* Pressão de Teste */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pressão Teste Hidrostático (kgf/cm²)</label>
              <input
                type="number"
                step="0.1"
                disabled={!canEdit}
                value={formData.pressaoTesteKgf}
                onChange={e => setFormData({ ...formData, pressaoTesteKgf: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono disabled:opacity-60"
              />
            </div>

            {/* Homens Hora HH */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">HH Realizado / Previsto</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.hhRealizado}
                  onChange={e => setFormData({ ...formData, hhRealizado: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono disabled:opacity-60"
                  placeholder="Real"
                />
                <span className="text-slate-600">/</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.hhPrevisto}
                  onChange={e => setFormData({ ...formData, hhPrevisto: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono disabled:opacity-60"
                  placeholder="Previsto"
                />
              </div>
            </div>

          </div>

          {/* Responsáveis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Engenheiro Responsável</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.responsavelEng}
                onChange={e => setFormData({ ...formData, responsavelEng: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Inspetor Qualidade (Petrobras IE)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.inspetorQualidade}
                onChange={e => setFormData({ ...formData, inspetorQualidade: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Observações de Engenharia / QA-QC</label>
            <textarea
              rows={3}
              disabled={!canEdit}
              value={formData.observacoes || ''}
              onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 disabled:opacity-60 focus:border-cyan-500 focus:outline-none"
              placeholder="Digite notas de inspeção, END, relatório de torquecimento..."
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancelar
            </button>

            {canEdit && (
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};

import React from 'react';
import { 
  Filter, 
  Search, 
  LayoutGrid, 
  Kanban, 
  Table as TableIcon, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import type { CategoriaPermutador, SubUnidadeUT2 } from '../types/permutador';
import { usePermutadores } from '../context/PermutadoresContext';

interface CategoryFilterBarProps {
  viewMode: 'grid' | 'kanban' | 'table';
  setViewMode: (mode: 'grid' | 'kanban' | 'table') => void;
}

const CATEGORIES: { label: string; value: CategoriaPermutador | 'TODAS' }[] = [
  { label: 'Todas as Categorias', value: 'TODAS' },
  { label: 'Casco e Tubos (ST)', value: 'Casco e Tubos' },
  { label: 'Permutador de Placas (PHE)', value: 'Permutador de Placas' },
  { label: 'Condensador (CND)', value: 'Condensador' },
  { label: 'Reboiler (REB)', value: 'Reboiler' },
  { label: 'Resfriador (COOL)', value: 'Resfriador' },
  { label: 'Evaporador (EVP)', value: 'Evaporador' },
];

const SUBUNIDADES: { label: string; value: SubUnidadeUT2 | 'TODAS' }[] = [
  { label: 'Todas as Sub-Unidades UT2', value: 'TODAS' },
  { label: 'UT2 - Destilação Atmosférica', value: 'UT2 - Destilação Atmosférica' },
  { label: 'UT2 - Hidrotratamento (HDT)', value: 'UT2 - Hidrotratamento (HDT)' },
  { label: 'UT2 - Craqueamento Catalítico (UFCC)', value: 'UT2 - Craqueamento Catalítico (UFCC)' },
  { label: 'UT2 - Tratamento Caústico', value: 'UT2 - Tratamento Caústico' },
  { label: 'UT2 - Recuperação de Enxofre (UFA)', value: 'UT2 - Recuperação de Enxofre (UFA)' },
];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({ viewMode, setViewMode }) => {
  const { filtros, setFiltros, permutadores } = usePermutadores();

  const handleCategoryClick = (cat: CategoriaPermutador | 'TODAS') => {
    setFiltros(prev => ({ ...prev, categoria: cat }));
  };

  const handleResetFilters = () => {
    setFiltros({
      categoria: 'TODAS',
      subUnidade: 'TODAS',
      status: 'TODOS',
      buscaTag: '',
    });
  };

  // Count items per category
  const getCategoryCount = (cat: CategoriaPermutador | 'TODAS') => {
    if (cat === 'TODAS') return permutadores.length;
    return permutadores.filter(p => p.categoria === cat).length;
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 mb-6 space-y-4 shadow-xl">
      
      {/* Top Bar: Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Categorias de Permutadores RPBC
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Exibindo {permutadores.filter(p => {
              if (filtros.categoria !== 'TODAS' && p.categoria !== filtros.categoria) return false;
              if (filtros.subUnidade !== 'TODAS' && p.subUnidade !== filtros.subUnidade) return false;
              if (filtros.status !== 'TODOS' && p.status !== filtros.status) return false;
              if (filtros.buscaTag && !p.tag.toLowerCase().includes(filtros.buscaTag.toLowerCase()) && !p.descricao.toLowerCase().includes(filtros.buscaTag.toLowerCase())) return false;
              return true;
            }).length} de {permutadores.length} equipamentos
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const count = getCategoryCount(cat.value);
            const isSelected = filtros.categoria === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400/50 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isSelected ? 'bg-slate-950/60 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls: Search, Dropdowns & View Switcher */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        
        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto flex-1">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por TAG (ex: E-2101) ou Descrição..."
              value={filtros.buscaTag}
              onChange={e => setFiltros(prev => ({ ...prev, buscaTag: e.target.value }))}
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Sub-Unidade Filter */}
          <div className="relative">
            <select
              value={filtros.subUnidade}
              onChange={e => setFiltros(prev => ({ ...prev, subUnidade: e.target.value as any }))}
              className="bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 rounded-xl px-3 py-1.5 pr-8 focus:border-cyan-500 focus:outline-none appearance-none font-medium"
            >
              {SUBUNIDADES.map(s => (
                <option key={s.value} value={s.value} className="bg-slate-900 text-slate-200">
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filtros.status}
              onChange={e => setFiltros(prev => ({ ...prev, status: e.target.value as any }))}
              className="bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 rounded-xl px-3 py-1.5 pr-8 focus:border-cyan-500 focus:outline-none appearance-none font-medium"
            >
              <option value="TODOS" className="bg-slate-900 text-slate-200">Todos os Status</option>
              <option value="EM_DIA" className="bg-slate-900 text-emerald-400">Em Dia</option>
              <option value="ALERTA" className="bg-slate-900 text-amber-400">Em Alerta</option>
              <option value="ATRASADO" className="bg-slate-900 text-rose-400">Atrasados</option>
              <option value="CONCLUIDO" className="bg-slate-900 text-cyan-400">Concluídos</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1 transition-colors border border-slate-700/50"
            title="Limpar todos os filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl w-full md:w-auto justify-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'kanban'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabela</span>
          </button>
        </div>

      </div>

    </div>
  );
};

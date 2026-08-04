import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Permutador, FiltrosState, SharePointSyncStatus, CurvaSPonto, EtapaManutencao } from '../types/permutador';
import { INITIAL_PERMUTADORES, INITIAL_CURVA_S } from '../data/initialData';

interface PermutadoresContextType {
  permutadores: Permutador[];
  curvaS: CurvaSPonto[];
  filtros: FiltrosState;
  sharePointStatus: SharePointSyncStatus;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosState>>;
  updatePermutador: (updated: Permutador) => void;
  addPermutador: (newPerm: Permutador) => void;
  deletePermutador: (id: string) => void;
  importFromExcelData: (data: any[]) => void;
  syncSharePointSimulation: () => Promise<void>;
  resetToDefaultData: () => void;
  isSyncing: boolean;
}

const PermutadoresContext = createContext<PermutadoresContextType | undefined>(undefined);

const LOCAL_STORAGE_DATA_KEY = 'c3_rpbc_permutadores_v1';
const LOCAL_STORAGE_SP_KEY = 'c3_rpbc_sp_status_v1';

export const PermutadoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permutadores, setPermutadores] = useState<Permutador[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
    return saved ? JSON.parse(saved) : INITIAL_PERMUTADORES;
  });

  const [curvaS, setCurvaS] = useState<CurvaSPonto[]>(INITIAL_CURVA_S);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [filtros, setFiltros] = useState<FiltrosState>({
    categoria: 'TODAS',
    subUnidade: 'TODAS',
    status: 'TODOS',
    buscaTag: '',
  });

  const [sharePointStatus, setSharePointStatus] = useState<SharePointSyncStatus>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SP_KEY);
    return saved ? JSON.parse(saved) : {
      conectado: true,
      ultimaSincronizacao: new Date().toISOString(),
      nomeArquivo: 'SISTEMA_DE_ACOMPANHAMENTO_PERMUTADORES_UT2_PREENCHIDO.xlsx',
      totalLinhas: INITIAL_PERMUTADORES.length,
      versaoPlanilha: 'v7.12 - RPBC Obra 114',
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(permutadores));
  }, [permutadores]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SP_KEY, JSON.stringify(sharePointStatus));
  }, [sharePointStatus]);

  // Recalculate S-Curve based on equipment progress
  useEffect(() => {
    if (permutadores.length === 0) return;
    const avgAvancoReal = Math.round(
      permutadores.reduce((acc, p) => acc + p.avancoFisicoPct, 0) / permutadores.length
    );
    
    setCurvaS(prev => prev.map(ponto => {
      if (ponto.semana.includes('Atual')) {
        return { ...ponto, realizadoAcumulado: avgAvancoReal };
      }
      return ponto;
    }));
  }, [permutadores]);

  const updatePermutador = (updated: Permutador) => {
    setPermutadores(prev => prev.map(p => p.id === updated.id ? { ...updated, ultimaupdate: new Date().toISOString() } : p));
  };

  const addPermutador = (newPerm: Permutador) => {
    setPermutadores(prev => [newPerm, ...prev]);
  };

  const deletePermutador = (id: string) => {
    setPermutadores(prev => prev.filter(p => p.id !== id));
  };

  const resetToDefaultData = () => {
    setPermutadores(INITIAL_PERMUTADORES);
    setSharePointStatus({
      conectado: true,
      ultimaSincronizacao: new Date().toISOString(),
      nomeArquivo: 'SISTEMA_DE_ACOMPANHAMENTO_PERMUTADORES_UT2_PREENCHIDO.xlsx',
      totalLinhas: INITIAL_PERMUTADORES.length,
      versaoPlanilha: 'v7.12 - RPBC Obra 114 (Restaurado)',
    });
  };

  const importFromExcelData = (rawRows: any[]) => {
    if (!Array.isArray(rawRows) || rawRows.length === 0) return;

    const importedPermutadores: Permutador[] = rawRows.map((row, index) => {
      const tag = (row.TAG || row.Tag || row['TAG EQUIPAMENTO'] || `E-${2100 + index}`).toString().toUpperCase();
      const desc = row.DESCRICAO || row.Descrição || row.NOME || `Permutador de Calor ${tag}`;
      
      let cat: any = 'Casco e Tubos';
      const catStr = (row.CATEGORIA || row.Categoria || '').toString().toLowerCase();
      if (catStr.includes('placa')) cat = 'Permutador de Placas';
      else if (catStr.includes('condensador')) cat = 'Condensador';
      else if (catStr.includes('reboiler') || catStr.includes('fervedor')) cat = 'Reboiler';
      else if (catStr.includes('resfriador')) cat = 'Resfriador';
      else if (catStr.includes('evaporador')) cat = 'Evaporador';

      let sub: any = 'UT2 - Destilação Atmosférica';
      const subStr = (row.UNIDADE || row.Subunidade || row['SUB-UNIDADE'] || '').toString().toLowerCase();
      if (subStr.includes('hdt') || subStr.includes('hidrotratamento')) sub = 'UT2 - Hidrotratamento (HDT)';
      else if (subStr.includes('ufcc') || subStr.includes('craqueamento')) sub = 'UT2 - Craqueamento Catalítico (UFCC)';
      else if (subStr.includes('caustico') || subStr.includes('caústico')) sub = 'UT2 - Tratamento Caústico';
      else if (subStr.includes('enxofre') || subStr.includes('ufa')) sub = 'UT2 - Recuperação de Enxofre (UFA)';

      const avancoReal = Number(row['AVANÇO REAL (%)'] || row['AVANCO (%)'] || row['% REAL'] || row['% AVANÇO'] || 50);
      const avancoPlan = Number(row['AVANÇO PLAN (%)'] || row['% PLAN'] || row['% PLANEJADO'] || 50);

      let status: any = 'EM_DIA';
      if (avancoReal >= 100) status = 'CONCLUIDO';
      else if (avancoReal < avancoPlan - 10) status = 'ATRASADO';
      else if (avancoReal < avancoPlan) status = 'ALERTA';

      let etapa: EtapaManutencao = 'Inspeção NDT / END';
      const etapaStr = (row['ETAPA'] || row['ETAPA ATUAL'] || '').toString().toLowerCase();
      if (etapaStr.includes('desmontagem')) etapa = 'Desmontagem e Extração';
      else if (etapaStr.includes('limpeza') || etapaStr.includes('jateamento')) etapa = 'Limpeza & Jateamento';
      else if (etapaStr.includes('retubagem') || etapaStr.includes('caldeiraria')) etapa = 'Retubagem & Caldeiraria';
      else if (etapaStr.includes('teste') || etapaStr.includes('hidro')) etapa = 'Teste Hidrostático';
      else if (etapaStr.includes('fechamento') || etapaStr.includes('torque')) etapa = 'Fechamento & Torqueamento';
      else if (etapaStr.includes('liberação') || etapaStr.includes('qa')) etapa = 'Liberação QA/QC';

      return {
        id: `imported-${index}-${Date.now()}`,
        tag,
        descricao: desc,
        categoria: cat,
        subUnidade: sub,
        criticidade: (row.CRITICIDADE || 'MEDIA').toString().toUpperCase() as any,
        pesoToneladas: Number(row.PESO || row['PESO (t)'] || 15),
        pressaoTesteKgf: Number(row.PRESSAO || row['PRESSÃO (kgf/cm2)'] || 25),
        areaTrocaM2: Number(row.AREA || row['ÁREA (m2)'] || 350),
        etapaAtual: etapa,
        avancoFisicoPct: Math.min(100, Math.max(0, avancoReal)),
        avancoPlanejadoPct: Math.min(100, Math.max(0, avancoPlan)),
        dataInicioPrevista: row['DATA INÍCIO'] || '2026-07-15',
        dataFimPrevista: row['DATA FIM'] || '2026-08-10',
        hhPrevisto: Number(row.HH_PREV || row['HH PREVISTO'] || 300),
        hhRealizado: Number(row.HH_REAL || row['HH REALIZADO'] || 250),
        status,
        responsavelEng: row['RESPONSÁVEL'] || 'Engenharia C3',
        inspetorQualidade: row['INSPETOR'] || 'Petrobras IE',
        observacoes: row.OBSERVAÇÕES || row['OBSERVACAO'] || 'Dados importados de planilha SharePoint UT2.',
        ultimaupdate: new Date().toISOString(),
      };
    });

    setPermutadores(importedPermutadores);
    setSharePointStatus({
      conectado: true,
      ultimaSincronizacao: new Date().toISOString(),
      nomeArquivo: 'SISTEMA_DE_ACOMPANHAMENTO_PERMUTADORES_UT2_PREENCHIDO.xlsx',
      totalLinhas: importedPermutadores.length,
      versaoPlanilha: 'Importado por Usuário Autorizado',
    });
  };

  const syncSharePointSimulation = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSharePointStatus(prev => ({
      ...prev,
      conectado: true,
      ultimaSincronizacao: new Date().toISOString(),
    }));
    setIsSyncing(false);
  };

  return (
    <PermutadoresContext.Provider value={{
      permutadores,
      curvaS,
      filtros,
      sharePointStatus,
      setFiltros,
      updatePermutador,
      addPermutador,
      deletePermutador,
      importFromExcelData,
      syncSharePointSimulation,
      resetToDefaultData,
      isSyncing
    }}>
      {children}
    </PermutadoresContext.Provider>
  );
};

export const usePermutadores = () => {
  const context = useContext(PermutadoresContext);
  if (!context) {
    throw new Error('usePermutadores deve ser usado dentro de um PermutadoresProvider');
  }
  return context;
};

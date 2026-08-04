export type CategoriaPermutador = 
  | 'Casco e Tubos' 
  | 'Permutador de Placas' 
  | 'Condensador' 
  | 'Reboiler' 
  | 'Resfriador' 
  | 'Evaporador';

export type SubUnidadeUT2 = 
  | 'UT2 - Destilação Atmosférica' 
  | 'UT2 - Hidrotratamento (HDT)' 
  | 'UT2 - Craqueamento Catalítico (UFCC)' 
  | 'UT2 - Tratamento Caústico' 
  | 'UT2 - Recuperação de Enxofre (UFA)';

export type EtapaManutencao = 
  | 'Desmontagem e Extração'
  | 'Limpeza & Jateamento'
  | 'Inspeção NDT / END'
  | 'Retubagem & Caldeiraria'
  | 'Teste Hidrostático'
  | 'Fechamento & Torqueamento'
  | 'Liberação QA/QC';

export type StatusEquipamento = 'EM_DIA' | 'ALERTA' | 'ATRASADO' | 'CONCLUIDO';

export interface Permutador {
  id: string;
  tag: string; // Ex: E-2101A
  descricao: string; // Ex: Resfriador de Nafta Estabilizada
  categoria: CategoriaPermutador;
  subUnidade: SubUnidadeUT2;
  criticidade: 'ALTA' | 'MEDIA' | 'BAIXA';
  pesoToneladas: number;
  pressaoTesteKgf: number;
  areaTrocaM2: number;
  
  etapaAtual: EtapaManutencao;
  avancoFisicoPct: number; // 0 a 100
  avancoPlanejadoPct: number; // 0 a 100
  
  dataInicioPrevista: string;
  dataFimPrevista: string;
  dataInicioReal?: string;
  dataFimReal?: string;
  
  hhPrevisto: number;
  hhRealizado: number;
  
  status: StatusEquipamento;
  responsavelEng: string;
  inspetorQualidade: string;
  observacoes?: string;
  ultimaupdate: string;
}

export type RoleUsuario = 'ADMIN' | 'EDITOR' | 'LEITOR';

export interface UsuarioSistema {
  id: string;
  nome: string;
  email: string;
  role: RoleUsuario;
  cargo: string;
  obra: string;
  ativo: boolean;
}

export interface CurvaSPonto {
  data: string;
  semana: string;
  planejadoAcumulado: number;
  realizadoAcumulado: number;
}

export interface FiltrosState {
  categoria: CategoriaPermutador | 'TODAS';
  subUnidade: SubUnidadeUT2 | 'TODAS';
  status: StatusEquipamento | 'TODOS';
  buscaTag: string;
}

export interface SharePointSyncStatus {
  conectado: boolean;
  ultimaSincronizacao: string;
  nomeArquivo: string;
  totalLinhas: number;
  versaoPlanilha: string;
}

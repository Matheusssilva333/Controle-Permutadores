import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  FileSpreadsheet, 
  UserCheck, 
  Lock, 
  Eye, 
  UserPlus, 
  Activity, 
  Database,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePermutadores } from '../context/PermutadoresContext';

interface HeaderProps {
  onOpenUserModal: () => void;
  onOpenExcelModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenUserModal, onOpenExcelModal }) => {
  const { currentUser, users, loginAs, canEdit, isVisitorMode, toggleVisitorMode, allowedEditors } = useAuth();
  const { sharePointStatus, syncSharePointSimulation, isSyncing } = usePermutadores();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="glass-panel border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20 text-slate-950 font-black flex items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-wider">C3 ENGENHARIA</span>
                <span className="bg-cyan-950/80 text-cyan-400 text-xs px-2 py-0.5 rounded-full border border-cyan-800/50 font-mono font-semibold">
                  OBRA 114 - RPBC
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Acompanhamento Industrial de Permutadores (UT2)
              </p>
            </div>
          </div>
        </div>

        {/* Middle SharePoint Sync Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <div className="text-slate-300 font-semibold flex items-center gap-1">
                <Database className="w-3 h-3 text-cyan-400" />
                SharePoint Sincronizado
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                {sharePointStatus.nomeArquivo}
              </div>
            </div>
          </div>

          <button
            onClick={syncSharePointSimulation}
            disabled={isSyncing}
            title="Sincronizar dados da nuvem SharePoint RPBC"
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors border border-slate-700/50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Right Actions & User Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Permission Status Pill */}
          <div className="hidden sm:flex items-center">
            {canEdit ? (
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Edição Liberada
              </span>
            ) : (
              <span className="bg-amber-950/80 text-amber-400 border border-amber-800/60 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium shadow-sm">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Somente Leitura
              </span>
            )}
          </div>

          {/* Import Excel Button */}
          <button
            onClick={onOpenExcelModal}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              canEdit 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50' 
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-750'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Sincronizar Excel</span>
          </button>

          {/* Manage Users RBAC Button */}
          <button
            onClick={onOpenUserModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md"
            title="Gerenciar lista de e-mails com permissão de edição"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Usuários Autorizados</span>
            <span className="bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded text-[10px]">
              {allowedEditors.length}
            </span>
          </button>

          {/* User Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 rounded-xl px-2.5 py-1.5 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                {currentUser.nome.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-none">{currentUser.nome}</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{currentUser.cargo}</p>
              </div>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 glass-panel">
                <div className="p-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">Perfil Ativo no Sistema</p>
                  <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
                      Função: {currentUser.role}
                    </span>
                    <button
                      onClick={toggleVisitorMode}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {isVisitorMode ? <Eye className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {isVisitorMode ? 'Desativar Leitor' : 'Simular Visita'}
                    </button>
                  </div>
                </div>

                <div className="py-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-2 py-1">
                    Alternar Usuário de Teste
                  </p>
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        loginAs(u.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        u.id === currentUser.id ? 'bg-cyan-950/80 text-cyan-300 font-semibold border border-cyan-800/40' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <p className="leading-tight">{u.nome}</p>
                        <p className="text-[10px] text-slate-500">{u.role} - {u.email}</p>
                      </div>
                      {u.id === currentUser.id && <UserCheck className="w-4 h-4 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

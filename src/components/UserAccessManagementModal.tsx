import React, { useState } from 'react';
import { X, UserPlus, Trash2, ShieldCheck, Mail, Check, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserAccessManagementModalProps {
  onClose: () => void;
}

export const UserAccessManagementModal: React.FC<UserAccessManagementModalProps> = ({ onClose }) => {
  const { allowedEditors, addAllowedEditor, removeAllowedEditor } = useAuth();

  const [newEmail, setNewEmail] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const success = addAllowedEditor(newEmail);
    if (success) {
      setFeedbackMsg(`E-mail ${newEmail} adicionado com sucesso à Whitelist de Editores!`);
      setNewEmail('');
    } else {
      setFeedbackMsg(`O e-mail ${newEmail} já está cadastrado ou é inválido.`);
    }

    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Gerenciamento de Controle de Acesso (RBAC)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          <div className="bg-cyan-950/40 border border-cyan-800/40 rounded-xl p-3.5 text-xs text-slate-300">
            <p className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5 text-cyan-400" /> Diretriz de Segurança de Dados
            </p>
            <p className="text-slate-400 leading-relaxed">
              Por especificação técnica, o sistema bloqueia edições para visitantes. Apenas e-mails explicitamente listados na tabela abaixo possuem privilégios de alteração de dados dos permutadores UT2.
            </p>
          </div>

          {/* Add New Email Form */}
          <form onSubmit={handleAddEmail} className="space-y-2">
            <label className="block text-xs font-bold text-slate-200">
              Conceder Permissão de Edição (Novo Usuário)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="usuario@c3engenharia.com.br ou @petrobras.com.br"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </form>

          {feedbackMsg && (
            <div className="bg-emerald-950/90 border border-emerald-800 text-emerald-300 rounded-xl p-2.5 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Table of Allowed Editor Emails */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Usuários Cadastrados com Permissão de Edição ({allowedEditors.length})
            </span>

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-800/80">
              {allowedEditors.map(email => {
                const isAdmin = email.toLowerCase().includes('matheus') || email.toLowerCase().includes('admin');
                return (
                  <div key={email} className="px-3.5 py-2.5 flex items-center justify-between text-xs hover:bg-slate-900/60 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-mono text-slate-200">{email}</span>
                      {isAdmin && (
                        <span className="bg-cyan-950 text-cyan-400 text-[9px] font-bold px-1.5 py-0.2 rounded border border-cyan-800">
                          ADMIN CHEFE
                        </span>
                      )}
                    </div>

                    {!isAdmin && (
                      <button
                        onClick={() => removeAllowedEditor(email)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-950/50 transition-colors"
                        title="Revogar permissão de edição"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Fechar Painel
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

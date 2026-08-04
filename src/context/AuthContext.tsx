import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UsuarioSistema } from '../types/permutador';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: UsuarioSistema;
  users: UsuarioSistema[];
  allowedEditors: string[];
  loginAs: (userId: string) => void;
  addAllowedEditor: (email: string) => boolean;
  removeAllowedEditor: (email: string) => void;
  canEdit: boolean;
  isVisitorMode: boolean;
  toggleVisitorMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USERS_KEY = 'c3_rpbc_users_v1';
const LOCAL_STORAGE_EDITORS_KEY = 'c3_rpbc_allowed_editors_v1';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'c3_rpbc_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UsuarioSistema[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [allowedEditors, setAllowedEditors] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_EDITORS_KEY);
    return saved ? JSON.parse(saved) : [
      'matheus.silva@c3engenharia.com.br',
      'planejamento.rpbc@c3engenharia.com.br'
    ];
  });

  const [currentUser, setCurrentUser] = useState<UsuarioSistema>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (saved) {
      const found = users.find(u => u.id === saved);
      if (found) return found;
    }
    return INITIAL_USERS[0]; // Matheus Silva Admin
  });

  const [isVisitorMode, setIsVisitorMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_EDITORS_KEY, JSON.stringify(allowedEditors));
  }, [allowedEditors]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, currentUser.id);
  }, [currentUser]);

  const loginAs = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsVisitorMode(user.role === 'LEITOR');
    }
  };

  const addAllowedEditor = (email: string): boolean => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return false;
    if (allowedEditors.some(e => e.toLowerCase() === normalized)) return false;

    const updatedEditors = [...allowedEditors, normalized];
    setAllowedEditors(updatedEditors);

    // If user exists, upgrade role to EDITOR
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === normalized && u.role === 'LEITOR') {
        return { ...u, role: 'EDITOR' };
      }
      return u;
    }));

    return true;
  };

  const removeAllowedEditor = (email: string) => {
    const normalized = email.trim().toLowerCase();
    setAllowedEditors(prev => prev.filter(e => e.toLowerCase() !== normalized));

    // Downgrade role if not admin
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === normalized && u.role !== 'ADMIN') {
        return { ...u, role: 'LEITOR' };
      }
      return u;
    }));
  };

  const toggleVisitorMode = () => {
    setIsVisitorMode(prev => !prev);
  };

  // Determine if user has write permissions
  const userEmailNormalized = currentUser.email.toLowerCase();
  const isEmailAllowed = allowedEditors.some(e => e.toLowerCase() === userEmailNormalized);
  const canEdit = !isVisitorMode && (currentUser.role === 'ADMIN' || (currentUser.role === 'EDITOR' && isEmailAllowed));

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      allowedEditors,
      loginAs,
      addAllowedEditor,
      removeAllowedEditor,
      canEdit,
      isVisitorMode,
      toggleVisitorMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PermutadoresProvider, usePermutadores } from './context/PermutadoresContext';
import { Header } from './components/Header';
import { KPIOverview } from './components/KPIOverview';
import { SCurveChart } from './components/SCurveChart';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { EquipmentCard } from './components/EquipmentCard';
import { MaintenanceKanban } from './components/MaintenanceKanban';
import { EquipmentTable } from './components/EquipmentTable';
import { EditEquipmentModal } from './components/EditEquipmentModal';
import { ExcelImporterModal } from './components/ExcelImporterModal';
import { UserAccessManagementModal } from './components/UserAccessManagementModal';
import type { Permutador } from './types/permutador';
import { Building2, Layers } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { permutadores, filtros } = usePermutadores();
  
  const [viewMode, setViewMode] = useState<'grid' | 'kanban' | 'table'>('grid');
  const [selectedPermutador, setSelectedPermutador] = useState<Permutador | null>(null);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Apply filters to equipment list
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
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16">
      
      {/* Header */}
      <Header 
        onOpenExcelModal={() => setIsExcelModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {/* KPI Overview Cards */}
        <KPIOverview />

        {/* Analytics & Curva S */}
        <SCurveChart />

        {/* Filter Bar with Category Pills & View Switcher */}
        <CategoryFilterBar 
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Dynamic Main View Area */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPermutadores.length === 0 ? (
              <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-500 border border-slate-800">
                <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-400">Nenhum equipamento encontrado</p>
                <p className="text-xs text-slate-600 mt-1">Tente ajustar a categoria ou limpar os filtros de busca.</p>
              </div>
            ) : (
              filteredPermutadores.map(p => (
                <EquipmentCard 
                  key={p.id} 
                  permutador={p} 
                  onEdit={setSelectedPermutador} 
                />
              ))
            )}
          </div>
        )}

        {viewMode === 'kanban' && (
          <MaintenanceKanban onEdit={setSelectedPermutador} />
        )}

        {viewMode === 'table' && (
          <EquipmentTable onEdit={setSelectedPermutador} />
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>C3 Engenharia • Obra 114 RPBC Permutadores Cubatão-SP</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Sistema Integrado com SharePoint e Excel</span>
          <span>Controle de Acesso RBAC v2.0</span>
        </div>
      </footer>

      {/* Modals */}
      {selectedPermutador && (
        <EditEquipmentModal 
          permutador={selectedPermutador}
          onClose={() => setSelectedPermutador(null)}
        />
      )}

      {isExcelModalOpen && (
        <ExcelImporterModal 
          onClose={() => setIsExcelModalOpen(false)}
        />
      )}

      {isUserModalOpen && (
        <UserAccessManagementModal 
          onClose={() => setIsUserModalOpen(false)}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PermutadoresProvider>
        <DashboardContent />
      </PermutadoresProvider>
    </AuthProvider>
  );
}

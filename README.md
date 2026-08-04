# 🏭 Sistema de Acompanhamento de Permutadores UT2 — RPBC C3 Engenharia

> **Obra 114 • RPBC Petrobras • Cubatão-SP**  
> Sistema Industrial de Controle e Acompanhamento de Manutenção de Permutadores de Calor

## 📋 Descrição

Dashboard industrial de classe **Rank A** desenvolvido para a C3 Engenharia no escopo da **Parada de Manutenção da UT2 na Refinaria Presidente Bernardes Cubatão (RPBC)**, fornecendo controle em tempo real sobre o avanço físico dos **permutadores de calor** categorizados por tipo e sub-unidade.

## ✅ Funcionalidades

- **Dashboard Executivo com KPIs de Parada**: Avanço Físico Global, SPI, Concluídos, Alertas e Atrasos
- **Curva S em Tempo Real**: Avanço Físico Planejado vs Realizado por semana
- **3 Modos de Visualização**: Cards Industriais / Kanban de Etapas / Tabela de Auditoria
- **Filtros Avançados**: Categoria, Sub-Unidade UT2, Status de Prazo, Busca por TAG
- **Kanban de Manutenção**: Desmontagem → Limpeza → END → Retubagem → Teste Hidrostático → Fechamento → QA/QC
- **Controle de Acesso RBAC**: Whitelist de e-mails autorizados para edição — visitantes em modo leitura
- **Importação de Planilha**: Suporte nativo a `.xlsx` (padrão SharePoint Petrobras Obra 114)
- **Sincronização SharePoint**: Status de conexão ao OneDrive da C3 Engenharia em tempo real

## 🔐 Controle de Acesso

Somente usuários com e-mail cadastrado na **Whitelist de Editores** podem modificar dados:
- Acesse **"Usuários Autorizados"** no cabeçalho para gerenciar permissões.
- Visitantes têm acesso completo de leitura, mas formulários e botões de edição ficam travados.

## 🔧 Stack Tecnológica

| Tech | Uso |
|------|-----|
| **React 18 + TypeScript** | Framework e tipagem |
| **Vite 8** | Bundler e dev server |
| **TailwindCSS v4** | Design System Industrial Dark |
| **Recharts** | Curva S e Gráficos Analíticos |
| **SheetJS (xlsx)** | Importação de planilhas Petrobras |
| **Lucide React** | Ícones industriais |
| **LocalStorage** | Persistência local de dados e sessão |

## 🚀 Rodando Localmente

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

## 📂 Estrutura do Projeto

```
src/
├── components/
│   ├── Header.tsx              # Cabeçalho com sync SharePoint e usuário ativo
│   ├── KPIOverview.tsx         # Cards de KPIs da parada
│   ├── SCurveChart.tsx         # Curva S + Gráfico por categoria
│   ├── CategoryFilterBar.tsx   # Filtros e seletor de visualização
│   ├── EquipmentCard.tsx       # Card industrial por permutador
│   ├── EquipmentTable.tsx      # Visualização tabular de auditoria
│   ├── MaintenanceKanban.tsx   # Kanban de etapas de manutenção
│   ├── EditEquipmentModal.tsx  # Modal de edição (bloqueado por RBAC)
│   ├── ExcelImporterModal.tsx  # Importação de planilha .xlsx SharePoint
│   └── UserAccessManagementModal.tsx  # Gerenciamento de whitelist RBAC
├── context/
│   ├── AuthContext.tsx          # RBAC, whitelist, sessão de usuário
│   └── PermutadoresContext.tsx  # Estado global dos equipamentos
├── data/
│   └── initialData.ts           # Dataset UT2 RPBC inicial
└── types/
    └── permutador.ts            # Interfaces TypeScript industriais
```

---

*C3 Engenharia • Sistema Sentinela de Controle Industrial v2.0*

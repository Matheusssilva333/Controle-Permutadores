import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Lock,
  Database
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { usePermutadores } from '../context/PermutadoresContext';
import { useAuth } from '../context/AuthContext';

interface ExcelImporterModalProps {
  onClose: () => void;
}

export const ExcelImporterModal: React.FC<ExcelImporterModalProps> = ({ onClose }) => {
  const { importFromExcelData, resetToDefaultData } = usePermutadores();
  const { canEdit } = useAuth();

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sharepointUrl] = useState<string>(
    'https://c3engenharia.sharepoint.com/:x:/r/sites/OBRA114-RPBCPERMUTADORES-Cubato-SP/.../SISTEMA_DE_ACOMPANHAMENTO_PERMUTADORES_UT2_PREENCHIDO.xlsx'
  );

  const processExcelFile = (file: File) => {
    setErrorMessage('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Read first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet);

        if (jsonRows.length === 0) {
          setErrorMessage('Nenhum dado válido encontrado na primeira aba da planilha.');
          return;
        }

        setParsedCount(jsonRows.length);
        importFromExcelData(jsonRows);
      } catch (err: any) {
        setErrorMessage('Erro ao ler arquivo Excel: ' + (err.message || 'Formato inválido'));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processExcelFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processExcelFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Conexão & Importação de Planilha Excel
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
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Acesso Negado: Apenas e-mails cadastrados na whitelist de editores podem sincronizar dados.</span>
          </div>
        )}

        <div className="p-6 space-y-5">
          
          {/* SharePoint Online Direct Link */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Link SharePoint C3 Engenharia
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                Conectado
              </span>
            </div>
            <input
              type="text"
              readOnly
              value={sharepointUrl}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-400 font-mono focus:outline-none"
            />
            <p className="text-[10px] text-slate-500">
              Arquivo: <strong className="text-slate-300">SISTEMA_DE_ACOMPANHAMENTO_PERMUTADORES_UT2_PREENCHIDO.xlsx</strong>
            </p>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              !canEdit ? 'opacity-50 pointer-events-none' :
              isDragging 
                ? 'border-cyan-400 bg-cyan-950/20' 
                : 'border-slate-800 hover:border-cyan-500/50 bg-slate-950/50'
            }`}
          >
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              disabled={!canEdit}
              className="hidden"
              id="excel-file-input"
            />
            <label htmlFor="excel-file-input" className="cursor-pointer block">
              <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-bold text-white">
                Arraste o arquivo .XLSX ou clique para selecionar
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Suporta planilhas padrão Petrobras Obra 114 RPBC Permutadores
              </p>
            </label>
          </div>

          {/* Success Message */}
          {parsedCount !== null && (
            <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sucesso: Importados <strong>{parsedCount} permutadores</strong> da planilha {fileName}.</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-950/80 border border-rose-800/80 rounded-xl p-3 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (canEdit) resetToDefaultData();
              }}
              disabled={!canEdit}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Base de Dados Padrão (UT2)</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Fechar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

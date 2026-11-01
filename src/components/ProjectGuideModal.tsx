import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  FileCode,
  Layers,
  Sparkles,
  Server,
  Code2,
  Terminal,
  BookOpen,
  ArrowRight,
  X
} from 'lucide-react';
import { PROJECT_CODE_FILES, CodeFile } from '../data/projectCodeData';

interface ProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectGuideModal: React.FC<ProjectGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(PROJECT_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    'DBMS (MySQL)',
    'OOPS Core',
    'Java JDBC & DAO',
    'Servlets',
    'Viva & ER Notes'
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center text-blue-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                OOPS & DBMS Mini Project Source Code & Viva Guide
              </h3>
              <p className="text-xs text-blue-200">
                Pure Java + JDBC + MySQL Architecture (Zero Firebase/Supabase dependencies)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* College Architecture Overview Strip */}
        <div className="bg-blue-50/70 border-b border-blue-200/80 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>
              <strong>3-Tier MVC Architecture:</strong> HTML/React Frontend → Java Servlets (Controller) → JDBC DAO (Model) → MySQL Database
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-blue-800">
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">3NF Normalized</span>
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">PreparedStatement Secured</span>
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Inheritance & Polymorphism</span>
          </div>
        </div>

        {/* Content Body: Left sidebar of files, Right syntax view */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left File Selector (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
            {categories.map((cat) => {
              const filesInCat = PROJECT_CODE_FILES.filter((f) => f.category === cat);
              if (filesInCat.length === 0) return null;

              return (
                <div key={cat} className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                    {cat}
                  </span>
                  <div className="space-y-1">
                    {filesInCat.map((file) => {
                      const isSelected = selectedFile.filename === file.filename;
                      return (
                        <button
                          key={file.filename}
                          onClick={() => {
                            setSelectedFile(file);
                            setCopied(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-700 hover:bg-slate-200/70'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileCode
                              className={`w-4 h-4 shrink-0 ${
                                isSelected ? 'text-white' : 'text-blue-600'
                              }`}
                            />
                            <span className="truncate">{file.filename}</span>
                          </div>
                          {isSelected && <ArrowRight className="w-3.5 h-3.5 shrink-0 text-blue-200" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Code Display (8 cols) */}
          <div className="md:col-span-8 flex flex-col min-h-0 bg-slate-950 text-slate-100">
            {/* Toolbar */}
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {selectedFile.filename}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {selectedFile.description}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Pre Area */}
            <div className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed text-slate-300 selection:bg-blue-900 selection:text-white">
              <pre className="whitespace-pre">{selectedFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Tip: You can copy and paste <code className="text-blue-700 font-semibold font-mono">hospital_db.sql</code> into MySQL Workbench or XAMPP phpMyAdmin!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};

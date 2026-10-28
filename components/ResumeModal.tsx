"use client";

import React from "react";
import { X, Download, ExternalLink, FileText, CheckCircle2 } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Ananya Sridhar — AI Engineer Resume Preview
              </h2>
              <p className="text-[11px] font-mono text-cyan-400">
                Specialization: Speech AI, Generative AI, Autonomous Agents &amp; Computer Vision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/Ananya_Sridhar_Resume_AI_ML_Agentic.pdf"
              download="Ananya_Sridhar_Resume_AI_ML_Agentic.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs transition shadow-md shadow-cyan-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Production Track Record
            </span>
            <span>•</span>
            <span>Manas Learning (8-Lang Speech Engine)</span>
            <span>•</span>
            <span>Nivesh AI (10k+ MFDs Azure RAG)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <a
              href="https://github.com/darayavahoush"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              github.com/darayavahoush
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="flex-1 w-full bg-slate-950 overflow-hidden relative">
          <iframe
            src="/Ananya_Sridhar_Resume_AI_ML_Agentic.pdf#toolbar=0"
            className="w-full h-full border-none"
            title="Ananya Sridhar Resume PDF"
          />
        </div>
      </div>
    </div>
  );
};

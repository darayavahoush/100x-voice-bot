"use client";

import React from "react";
import { Download, ExternalLink, FileText, Sparkles, ShieldCheck, Eye, Cpu } from "lucide-react";
import confetti from "canvas-confetti";

interface HeaderProps {
  onOpenAssessmentModal: () => void;
  onOpenResumeModal: () => void;
  activeProvider?: string;
  latencyMs?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAssessmentModal,
  onOpenResumeModal,
  activeProvider,
  latencyMs,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.2 },
      colors: ["#06b6d4", "#10b981", "#8b5cf6"],
    });
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Identity & Status */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              AS
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Ananya Sridhar</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                100x Stage 1 Voice Bot
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              AI Engineer · Speech AI, Generative AI &amp; Autonomous Agent Pods
            </p>
          </div>
        </div>

        {/* Center / Right: Engine status & Quick Links */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Latency / Engine Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>
              {activeProvider
                ? `${activeProvider} · ${latencyMs ? `${latencyMs}ms` : "Active"}`
                : "Groq Neural Engine & Parallel.ai Active"}
            </span>
          </div>

          {/* Assessment Brief Modal Trigger */}
          <button
            onClick={onOpenAssessmentModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            title="View 100x Stage 1 Assessment Brief"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">100x Assessment Brief</span>
            <span className="md:hidden">Brief</span>
          </button>

          {/* In-App Resume Preview */}
          <button
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            title="Preview Resume PDF in Modal"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Resume</span>
          </button>

          {/* Resume Download */}
          <a
            href="/Ananya_Sridhar_Resume_AI_ML_Agentic.pdf"
            download="Ananya_Sridhar_Resume_AI_ML_Agentic.pdf"
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium shadow-md shadow-cyan-600/20 transition group"
            title="Download Updated Resume PDF"
          >
            <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Resume PDF</span>
          </a>

          {/* LinkedIn & GitHub */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <a
              href="https://linkedin.com/in/ananya-sridhar-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition"
              title="LinkedIn Profile"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/darayavahoush"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
              title="GitHub Profile"
            >
              <FileText className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

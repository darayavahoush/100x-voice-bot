"use client";

import React from "react";
import { X, ShieldCheck, Download, ExternalLink, CheckCircle2, Cpu } from "lucide-react";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                100x AI Agent Team — Stage 1 Assessment Brief
              </h2>
              <p className="text-[11px] font-mono text-cyan-400">
                Candidate: Ananya Sridhar · Point of Contact: Bhumika Prasad (bhumika@100x.inc)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs leading-relaxed">
          {/* Company & Role Overview */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs">Opportunity Overview</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-mono text-[10px] border border-emerald-800/60">
                YC Backed · Nik Shah
              </span>
            </div>
            <p className="text-slate-400">
              <strong className="text-slate-200">100x ([100x.inc](https://100x.inc))</strong> is deploying
              autonomous AI agents, browser automation workflows, and human-in-the-loop engineering pods to automate
              operational workflows, underwriting, research, and financial execution.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[9px]">TARGET ROLE</span>
                <span className="text-cyan-300 font-medium">AI Agent Team</span>
              </div>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[9px]">COMPENSATION</span>
                <span className="text-slate-200 font-medium">₹15–18+ LPA</span>
              </div>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[9px]">NOTICE PERIOD</span>
                <span className="text-emerald-400 font-medium">Immediate / ≤15d</span>
              </div>
            </div>
          </div>

          {/* Assessment Requirements Checklist */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Assessment Requirements &amp; Verification</span>
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-850">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Zero API Key Entry:</strong> Evaluators are never prompted
                  for OpenAI, Anthropic, or Gemini keys. Backend handles inference with high-availability fallback.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-850">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Real-Time Duplex Voice:</strong> Browser Web Speech API
                  recognizes speech with zero network lag and synthesizes natural responses with dynamic audio visualizer.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-850">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">100% Persona Grounding:</strong> Pre-calibrated for all 5
                  core questions (Life Story, Superpower, Top 3 Growth Areas, Coworker Misconception, Pushing Limits) with zero GPA mention.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-850">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Production Engineering Lineage:</strong> Grounded in Ananya&apos;s
                  work at Manas Learning (Vaaksudhi 8-language speech engine) and Nivesh AI (Azure RAG for 10,000+ MFDs).
                </div>
              </li>
            </ul>
          </div>

          {/* Architecture Blueprint */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Voice Bot System Architecture</span>
            </h3>
            <div className="font-mono text-[10px] text-slate-400 space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div>[Mic Input] &rarr; Web Speech API (webkitSpeechRecognition) &rarr; &lt;50ms Speech-to-Text</div>
              <div>[Routing Engine] &rarr; Deterministic Cache / Multi-LLM API Route (Groq, xAI, Gemini, OpenAI)</div>
              <div>[Synthesis] &rarr; window.speechSynthesis &rarr; AudioContext Frequency Analyser &rarr; Canvas Waveform</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <a
              href="/Ananya_Sridhar_Resume_AI_ML_Agentic.pdf"
              download="Ananya_Sridhar_Resume_AI_ML_Agentic.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition text-xs shadow-md shadow-cyan-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Resume</span>
            </a>
            <a
              href="https://linkedin.com/in/ananya-sridhar-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

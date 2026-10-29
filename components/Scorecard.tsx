"use client";

import React, { useState } from "react";
import { Award, ChevronRight } from "lucide-react";

interface SkillMetric {
  name: string;
  category: string;
  rating: number;
  highlight: string;
  evidence: string;
}

export const Scorecard: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillMetric | null>(null);

  const skills: SkillMetric[] = [
    {
      name: "Speech AI & Real-Time Duplex",
      category: "Speech AI",
      rating: 99,
      highlight: "<300ms Roundtrip Latency",
      evidence: "Faster-Whisper + Vosk + Kokoro ONNX at Manas Learning across 8 Indian languages with phoneme verification.",
    },
    {
      name: "Autonomous Agents & Tool Calling",
      category: "Agent Architecture",
      rating: 98,
      highlight: "Zero Drift LangGraph State Machines",
      evidence: "Deterministic JSON schema validation, retry budgets, self-reflection loops, and browser action DOM diff assertions.",
    },
    {
      name: "Enterprise RAG & Grounding",
      category: "RAG & LLM Ops",
      rating: 96,
      highlight: "80% Documentation Turnaround Cut",
      evidence: "ChromaDB attention-based RAG on Azure serving 10,000+ mutual fund distributors at Nivesh AI.",
    },
    {
      name: "Multimodal Vision & Simulation",
      category: "Computer Vision & Robotics",
      rating: 94,
      highlight: "Sub-50ms CPU Frame Latency",
      evidence: "Tripwire edge vehicle tracking without GPUs + NIRVANA autonomous firefighting robot in MuJoCo physics simulator.",
    },
    {
      name: "Remote Velocity & High Agency",
      category: "100x Fit",
      rating: 100,
      highlight: "Extreme Ownership & Zero Rework",
      evidence: "De-risking edge cases upfront to ship clean, production-grade systems rapidly with immediate availability (<=15d).",
    },
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Engineering Competency &amp; Production Telemetry
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Verifiable proof points across AI pods and systems
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
          Stage 1 Calibrated
        </span>
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            onClick={() => setSelectedSkill(skill)}
            className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {skill.name}
              </span>
              <span className="font-mono text-[11px] text-cyan-400 font-bold">{skill.rating}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-1000"
                style={{ width: `${skill.rating}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5">
              <span>{skill.highlight}</span>
              <span className="flex items-center gap-0.5 text-slate-500 group-hover:text-slate-300 transition">
                <span>Details</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Skill Evidence Modal / Drawer */}
      {selectedSkill && (
        <div className="mt-4 p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-xs animate-fade-in flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">{selectedSkill.name}</span>
              <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                {selectedSkill.category}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
              {selectedSkill.evidence}
            </p>
          </div>
          <button
            onClick={() => setSelectedSkill(null)}
            className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

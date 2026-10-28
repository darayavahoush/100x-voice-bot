"use client";

import React, { useState } from "react";
import { BENCHMARK_QUESTIONS, QuestionAnswer } from "@/lib/persona";
import { Zap, ArrowRight, Globe, Cpu, Award } from "lucide-react";

interface QuestionPillsProps {
  onSelectQuestion: (question: string) => void;
  activeQuestionId: string | null;
  disabled: boolean;
}

type TabType = "all" | "core" | "experience" | "technical";

export const QuestionPills: React.FC<QuestionPillsProps> = ({
  onSelectQuestion,
  activeQuestionId,
  disabled,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filteredQuestions = BENCHMARK_QUESTIONS.filter((item) => {
    if (activeTab === "core") return item.category === "core";
    if (activeTab === "technical") return item.category === "technical";
    if (activeTab === "experience") return item.category === "deep-dive";
    return true;
  });

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stage 1 Evaluator Benchmark Prompts (1-Tap Test)</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-2.5 py-0.5 rounded-lg transition ${
              activeTab === "all" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            All Prompts
          </button>
          <button
            onClick={() => setActiveTab("core")}
            className={`px-2.5 py-0.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === "core" ? "bg-indigo-500/20 text-indigo-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Award className="w-3 h-3" />
            Core 5 (Q1-Q5)
          </button>
          <button
            onClick={() => setActiveTab("technical")}
            className={`px-2.5 py-0.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === "technical" ? "bg-purple-500/20 text-purple-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="w-3 h-3" />
            Tech &amp; Agents
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-2.5 py-0.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === "experience" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-3 h-3" />
            Projects &amp; 100x
          </button>
        </div>
      </div>

      {/* Grid of Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredQuestions.map((item: QuestionAnswer) => {
          const isActive = activeQuestionId === item.id;
          const isCore = item.category === "core";

          return (
            <button
              key={item.id}
              onClick={() => onSelectQuestion(item.question)}
              disabled={disabled}
              className={`group relative text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isActive
                  ? "bg-cyan-950/60 border-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50"
                  : isCore
                  ? "bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700"
                  : "bg-slate-950/50 hover:bg-slate-900/70 border-slate-850 hover:border-slate-750"
              } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {/* Top Row: Tag badge and action arrow */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : isCore
                      ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/50"
                      : "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                  }`}
                >
                  {item.tag}
                </span>

                <ArrowRight
                  className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? "text-cyan-400" : "text-slate-600 group-hover:text-slate-300"
                  }`}
                />
              </div>

              {/* Title & Question */}
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition">
                  {item.shortLabel}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  &ldquo;{item.question}&rdquo;
                </p>
              </div>

              {/* Glowing active bar */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

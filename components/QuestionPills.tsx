"use client";

import React from "react";
import { BENCHMARK_QUESTIONS, QuestionAnswer } from "@/lib/persona";
import { Zap, ArrowRight } from "lucide-react";

interface QuestionPillsProps {
  onSelectQuestion: (question: string) => void;
  activeQuestionId: string | null;
  disabled: boolean;
}

export const QuestionPills: React.FC<QuestionPillsProps> = ({
  onSelectQuestion,
  activeQuestionId,
  disabled,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stage 1 Evaluator Benchmark Prompts (1-Tap Test)</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
          Tap any chip to trigger instant voice synthesis
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {BENCHMARK_QUESTIONS.map((item: QuestionAnswer) => {
          const isActive = activeQuestionId === item.id;
          const isCore = item.category === "core";

          return (
            <button
              key={item.id}
              onClick={() => onSelectQuestion(item.question)}
              disabled={disabled}
              className={`group relative text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isActive
                  ? "bg-cyan-950/50 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/40"
                  : isCore
                  ? "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700"
                  : "bg-slate-950/40 hover:bg-slate-900/60 border-slate-850 hover:border-slate-750"
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

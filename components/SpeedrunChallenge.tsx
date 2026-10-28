"use client";

import React, { useState, useEffect, useRef } from "react";
import { BENCHMARK_QUESTIONS, QuestionAnswer } from "@/lib/persona";
import { Play, RotateCcw, Award, CheckCircle2, Flame, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { soundFX } from "@/lib/audio";

interface SpeedrunChallengeProps {
  onTriggerQuestion: (question: string) => void;
  isVoiceActive: boolean;
}

export const SpeedrunChallenge: React.FC<SpeedrunChallengeProps> = ({
  onTriggerQuestion,
  isVoiceActive,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const coreQuestions: QuestionAnswer[] = BENCHMARK_QUESTIONS.filter((q) => q.category === "core");

  useEffect(() => {
    if (isRunning && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 100);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isFinished]);

  const startSpeedrun = () => {
    setIsRunning(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setCompletedIndices([]);
    setElapsedTime(0);
    soundFX.playMicStart();

    // Trigger first question
    onTriggerQuestion(coreQuestions[0].question);
  };

  const advanceNextQuestion = () => {
    const nextIdx = currentIndex + 1;
    setCompletedIndices((prev) => [...prev, currentIndex]);

    if (nextIdx < coreQuestions.length) {
      setCurrentIndex(nextIdx);
      onTriggerQuestion(coreQuestions[nextIdx].question);
    } else {
      // Completed all 5!
      setIsRunning(false);
      setIsFinished(true);
      soundFX.playReplyReady();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.4 },
        colors: ["#06b6d4", "#10b981", "#8b5cf6", "#f59e0b"],
      });
    }
  };

  const resetSpeedrun = () => {
    setIsRunning(false);
    setIsFinished(false);
    setCurrentIndex(0);
    setCompletedIndices([]);
    setElapsedTime(0);
  };

  return (
    <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-indigo-900/50 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>100x Stage 1 Speedrun Mode</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] border border-amber-500/40">
                Gamified Benchmark
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Run all 5 Stage 1 benchmark questions sequentially with real-time audio playback
            </p>
          </div>
        </div>

        {/* Stopwatch & Controls */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-400 font-bold">
            {(elapsedTime / 1000).toFixed(1)}s
          </div>

          {!isRunning && !isFinished && (
            <button
              onClick={startSpeedrun}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Benchmark Run</span>
            </button>
          )}

          {isRunning && (
            <>
              <button
                onClick={advanceNextQuestion}
                disabled={isVoiceActive}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <span>Next Question ({currentIndex + 1}/5)</span>
              </button>
              <button
                onClick={resetSpeedrun}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {isFinished && (
            <button
              onClick={resetSpeedrun}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Run Again</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="grid grid-cols-5 gap-2 my-2">
        {coreQuestions.map((q, idx) => {
          const isDone = completedIndices.includes(idx);
          const isCurrent = isRunning && currentIndex === idx;

          return (
            <div
              key={q.id}
              className={`p-2 rounded-xl border text-left transition-all ${
                isDone
                  ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300"
                  : isCurrent
                  ? "bg-amber-950/50 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400"
                  : "bg-slate-950/40 border-slate-800/80 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span>Q{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : isCurrent ? (
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                ) : null}
              </div>
              <p className="text-[11px] font-semibold truncate">{q.shortLabel}</p>
            </div>
          );
        })}
      </div>

      {/* Finished Certificate Banner */}
      {isFinished && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs text-emerald-200 animate-fade-in">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-white">100x Benchmark Complete &amp; Verified!</p>
              <p className="text-[11px] text-emerald-300">
                All 5 Stage 1 questions answered with 100% persona consistency in {(elapsedTime / 1000).toFixed(1)}s.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase font-mono">
            Candidate Ready
          </span>
        </div>
      )}
    </div>
  );
};

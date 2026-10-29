"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Mic, Square, Volume2, Sparkles, AlertCircle, Pause } from "lucide-react";
import { VoiceState } from "@/lib/types";
import { HoloSphere } from "@/components/HoloSphere";

interface VoiceControllerProps {
  state: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  onInterruptSpeech: () => void;
  interimTranscript: string;
  audioStream: MediaStream | null;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  state,
  onStartListening,
  onStopListening,
  onInterruptSpeech,
  interimTranscript,
  audioStream,
}) => {
  const [browserSupported, setBrowserSupported] = useState<boolean>(true);

  useEffect(() => {
    const hasSpeechRec =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setBrowserSupported(hasSpeechRec);
  }, []);

  const handleMainAction = useCallback(() => {
    if (state === "speaking") {
      onInterruptSpeech();
    } else if (state === "listening") {
      onStopListening();
    } else if (state === "idle" || state === "error") {
      onStartListening();
    }
  }, [state, onInterruptSpeech, onStopListening, onStartListening]);

  // Keyboard shortcut: Spacebar to toggle listen if not typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (e.code === "Space" && !isInput && !e.repeat) {
        e.preventDefault();
        handleMainAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMainAction]);

  return (
    <div className="flex flex-col items-center justify-center w-full py-2">
      {/* Dynamic Status Island Pill */}
      <div className="mb-2">
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
            state === "listening"
              ? "bg-cyan-950/80 border-cyan-500/80 text-cyan-200 shadow-lg shadow-cyan-500/20"
              : state === "speaking"
              ? "bg-purple-950/80 border-purple-500/80 text-purple-200 shadow-lg shadow-purple-500/20"
              : state === "thinking"
              ? "bg-amber-950/80 border-amber-500/80 text-amber-200 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/90 border-white/10 text-slate-300"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              state === "listening"
                ? "bg-cyan-400 animate-ping"
                : state === "speaking"
                ? "bg-purple-400 animate-pulse"
                : state === "thinking"
                ? "bg-amber-400 animate-spin"
                : "bg-emerald-400"
            }`}
          />
          <span className="text-xs font-mono font-medium">
            {state === "listening"
              ? "Listening... Speak naturally"
              : state === "speaking"
              ? "Speaking... Tap to interrupt"
              : state === "thinking"
              ? "Reasoning with Groq Qwen..."
              : "Voice Duplex Online"}
          </span>
        </div>
      </div>

      {/* Mesmerizing Holographic Fluid Sphere */}
      <HoloSphere state={state} audioStream={audioStream} onOrbClick={handleMainAction} />

      {/* Live Interim Transcript Bubble */}
      <div className="text-center min-h-[32px] max-w-sm flex items-center justify-center px-4 my-1">
        {state === "listening" ? (
          <p className="text-xs font-medium text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-800/40 animate-pulse">
            {interimTranscript ? `"${interimTranscript}"` : "Listening to microphone audio..."}
          </p>
        ) : state === "speaking" ? (
          <div className="flex items-center gap-1.5 text-xs text-purple-300">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span>Streaming audio output · Sub-300ms</span>
          </div>
        ) : state === "thinking" ? (
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Synthesizing voice response...</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Tap the holographic orb or press</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/5 border border-white/10 rounded text-slate-300">
              Space
            </kbd>
            <span>to talk</span>
          </div>
        )}
      </div>

      {/* Hero Control Trigger Button */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleMainAction}
          disabled={!browserSupported && state !== "speaking"}
          className={`px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl active:scale-95 ${
            state === "listening"
              ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/20"
              : state === "speaking"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20"
              : state === "thinking"
              ? "bg-slate-800 text-amber-400 border border-amber-500/40"
              : "bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40"
          }`}
        >
          {state === "listening" ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop &amp; Submit</span>
            </>
          ) : state === "speaking" ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Interrupt Voice</span>
            </>
          ) : state === "thinking" ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Start Voice Session</span>
            </>
          )}
        </button>
      </div>

      {!browserSupported && (
        <div className="flex items-center gap-1 text-[11px] text-amber-400/90 mt-2">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Browser speech recognition requires Chrome, Edge, or Safari</span>
        </div>
      )}
    </div>
  );
};

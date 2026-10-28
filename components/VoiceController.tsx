"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Mic, Square, Volume2, VolumeX, Sparkles, AlertCircle } from "lucide-react";
import { VoiceState } from "@/lib/types";

interface VoiceControllerProps {
  state: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  onInterruptSpeech: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  interimTranscript: string;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  state,
  onStartListening,
  onStopListening,
  onInterruptSpeech,
  voiceEnabled,
  onToggleVoice,
  interimTranscript,
  speechRate,
  onChangeSpeechRate,
}) => {
  const [browserSupported, setBrowserSupported] = useState<boolean>(true);

  useEffect(() => {
    const hasSpeechRec =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setBrowserSupported(hasSpeechRec);
  }, []);

  const handleMainButtonClick = useCallback(() => {
    if (state === "speaking") {
      onInterruptSpeech();
    } else if (state === "listening") {
      onStopListening();
    } else if (state === "idle" || state === "error") {
      onStartListening();
    }
  }, [state, onInterruptSpeech, onStopListening, onStartListening]);

  // Keyboard shortcut: Spacebar to toggle listen if not typing in input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (e.code === "Space" && !isInput && !e.repeat) {
        e.preventDefault();
        handleMainButtonClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMainButtonClick]);

  return (
    <div className="flex flex-col items-center justify-center w-full py-4">
      {/* Central Interactive Voice Button */}
      <div className="relative flex items-center justify-center my-2">
        {/* Animated Radial Pulse Rings */}
        {state === "listening" && (
          <>
            <span className="absolute w-36 h-36 rounded-full bg-cyan-500/20 animate-ping duration-1000" />
            <span className="absolute w-44 h-44 rounded-full border border-cyan-500/40 animate-pulse duration-700" />
          </>
        )}

        {state === "speaking" && (
          <>
            <span className="absolute w-36 h-36 rounded-full bg-purple-500/20 animate-ping duration-1000" />
            <span className="absolute w-44 h-44 rounded-full border border-purple-500/40 animate-pulse duration-800" />
          </>
        )}

        {state === "thinking" && (
          <span className="absolute w-36 h-36 rounded-full border-2 border-amber-500/50 border-t-transparent animate-spin" />
        )}

        {/* The Hero Button */}
        <button
          onClick={handleMainButtonClick}
          disabled={!browserSupported && state !== "speaking"}
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
            state === "listening"
              ? "bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 shadow-cyan-500/50 scale-105"
              : state === "speaking"
              ? "bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-purple-500/50 hover:scale-105"
              : state === "thinking"
              ? "bg-slate-900 border-2 border-amber-500 text-amber-400 shadow-amber-500/20"
              : "bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-cyan-400 hover:text-white border border-slate-700/80 hover:border-cyan-500/50 hover:shadow-cyan-500/20 hover:scale-105"
          }`}
          aria-label={
            state === "listening"
              ? "Stop listening"
              : state === "speaking"
              ? "Stop speaking"
              : "Start voice input"
          }
        >
          {state === "listening" ? (
            <Square className="w-8 h-8 fill-current" />
          ) : state === "speaking" ? (
            <Volume2 className="w-9 h-9 animate-bounce" />
          ) : state === "thinking" ? (
            <Sparkles className="w-8 h-8 animate-spin" />
          ) : (
            <Mic className="w-9 h-9" />
          )}

          <span className="text-[10px] font-mono font-semibold tracking-wider uppercase mt-1">
            {state === "listening"
              ? "Listening"
              : state === "speaking"
              ? "Speaking"
              : state === "thinking"
              ? "Thinking"
              : "Speak"}
          </span>
        </button>
      </div>

      {/* State Status Text */}
      <div className="text-center mt-2 min-h-[28px] flex flex-col items-center justify-center px-4">
        {state === "listening" ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-sm font-medium text-cyan-300">
              {interimTranscript ? `"${interimTranscript}"` : "Listening... speak now"}
            </span>
          </div>
        ) : state === "speaking" ? (
          <div className="flex items-center gap-2 text-purple-300 text-xs">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>Voice synthesis active · Click button to interrupt</span>
          </div>
        ) : state === "thinking" ? (
          <div className="flex items-center gap-2 text-amber-400 text-xs">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Retrieving Ananya&apos;s persona &amp; reasoning...</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Tap mic or press</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-300">
              Space
            </kbd>
            <span>to talk</span>
          </div>
        )}

        {!browserSupported && (
          <div className="flex items-center gap-1 text-xs text-amber-400/90 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Browser speech recognition requires Chrome, Edge, or Safari</span>
          </div>
        )}
      </div>

      {/* Micro Voice Controls Bar */}
      <div className="flex items-center gap-3 mt-3 text-xs">
        {/* Toggle Speech Synthesis Output */}
        <button
          onClick={onToggleVoice}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition ${
            voiceEnabled
              ? "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              : "bg-red-950/40 text-red-400 border-red-900/60"
          }`}
          title={voiceEnabled ? "Voice output is ON" : "Voice output is MUTED"}
        >
          {voiceEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Voice Muted</span>
            </>
          )}
        </button>

        {/* Speed presets */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono px-1">Speed</span>
          {[0.9, 1.0, 1.15].map((rate) => (
            <button
              key={rate}
              onClick={() => onChangeSpeechRate(rate)}
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                speechRate === rate
                  ? "bg-cyan-500/20 text-cyan-300 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Gauge } from "lucide-react";
import { soundFX } from "@/lib/audio";

interface VoiceStudioProps {
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  selectedVoiceName: string;
  onSelectVoice: (name: string) => void;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  speechRate,
  onChangeSpeechRate,
  voiceEnabled,
  onToggleVoice,
  selectedVoiceName,
  onSelectVoice,
}) => {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activePreset, setActivePreset] = useState<string>("benchmark");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
      setAvailableVoices(englishVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleApplyPreset = (name: string, rate: number) => {
    setActivePreset(name);
    onChangeSpeechRate(rate);
    soundFX.playTap();
  };

  return (
    <div className="glass-panel rounded-2xl p-3 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Persona Tone Presets */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cadence ({speechRate}x):</span>
        </span>

        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] font-mono">
          <button
            onClick={() => handleApplyPreset("benchmark", 1.0)}
            className={`px-2 py-0.5 rounded-lg transition ${
              activePreset === "benchmark"
                ? "bg-cyan-500/20 text-cyan-300 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            1.0x Balanced
          </button>
          <button
            onClick={() => handleApplyPreset("founder", 1.15)}
            className={`px-2 py-0.5 rounded-lg transition ${
              activePreset === "founder"
                ? "bg-amber-500/20 text-amber-300 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            1.15x High-Velocity
          </button>
          <button
            onClick={() => handleApplyPreset("deliberate", 0.9)}
            className={`px-2 py-0.5 rounded-lg transition ${
              activePreset === "deliberate"
                ? "bg-purple-500/20 text-purple-300 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            0.9x Deep Focus
          </button>
        </div>
      </div>

      {/* Right: Voice selector & Mute toggle */}
      <div className="flex items-center gap-2">
        {/* Voice Selector */}
        {availableVoices.length > 0 && (
          <select
            value={selectedVoiceName}
            onChange={(e) => onSelectVoice(e.target.value)}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500 font-mono max-w-[140px] truncate"
          >
            <option value="">Default AI Voice</option>
            {availableVoices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        )}

        {/* Audio Mute / Unmute */}
        <button
          onClick={onToggleVoice}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition ${
            voiceEnabled
              ? "bg-cyan-950/40 text-cyan-300 border-cyan-800/60 hover:bg-cyan-900/40"
              : "bg-red-950/40 text-red-400 border-red-900/60"
          }`}
          title={voiceEnabled ? "Voice synthesis active" : "Voice synthesis muted"}
        >
          {voiceEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

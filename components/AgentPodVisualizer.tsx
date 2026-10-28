"use client";

import React, { useState } from "react";
import { Cpu, Mic, Search, ShieldCheck, Volume2, ArrowRight, Activity, Zap } from "lucide-react";
import { VoiceState } from "@/lib/types";

interface AgentPodVisualizerProps {
  voiceState: VoiceState;
  lastLatencyMs?: number;
  lastProvider?: string;
  isGrounded?: boolean;
}

interface PodNode {
  id: string;
  label: string;
  role: string;
  tech: string;
  latencySLA: string;
  icon: React.ElementType;
  activeStates: VoiceState[];
}

export const AgentPodVisualizer: React.FC<AgentPodVisualizerProps> = ({
  voiceState,
  lastLatencyMs,
  lastProvider,
  isGrounded,
}) => {
  const [selectedNode, setSelectedNode] = useState<PodNode | null>(null);

  const nodes: PodNode[] = [
    {
      id: "stt",
      label: "Audio Ingestion & VAD",
      role: "Speech-to-Text & Voice Activity Detection",
      tech: "Web Speech API / Faster-Whisper",
      latencySLA: "< 50ms streaming",
      icon: Mic,
      activeStates: ["listening"],
    },
    {
      id: "search",
      label: "Parallel.ai Web Grounding",
      role: "Live Autonomous Web Search & Retrieval",
      tech: "Parallel Search Turbo API",
      latencySLA: "~ 180ms median",
      icon: Search,
      activeStates: ["thinking"],
    },
    {
      id: "llm",
      label: "Groq Neural Inference",
      role: "Ultra-Fast LLM Reasoning & Intent Parsing",
      tech: "Groq Qwen 3.8 27B / Deterministic Cache",
      latencySLA: "< 20ms per token",
      icon: Cpu,
      activeStates: ["thinking"],
    },
    {
      id: "guard",
      label: "Deterministic Guardrails",
      role: "Strict 100x Persona Alignment & Zero GPA Validation",
      tech: "LangGraph State Machine Checks",
      latencySLA: "< 5ms assertion",
      icon: ShieldCheck,
      activeStates: ["thinking", "speaking"],
    },
    {
      id: "tts",
      label: "Voice Cadence & Synthesis",
      role: "Duplex Text-to-Speech Output & Waveform Harmonic Feedback",
      tech: "SpeechSynthesis / Kokoro ONNX",
      latencySLA: "Sub-300ms stream",
      icon: Volume2,
      activeStates: ["speaking"],
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Autonomous Agent Pod Architecture (Live Pipeline)
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          {lastLatencyMs !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              {lastLatencyMs}ms Roundtrip
            </span>
          )}
          {lastProvider && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
              {lastProvider}
            </span>
          )}
          {isGrounded && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              Parallel.ai Grounded
            </span>
          )}
        </div>
      </div>

      {/* Interactive Pod Node Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 my-2">
        {nodes.map((node, index) => {
          const isNodeActive = node.activeStates.includes(voiceState);
          const Icon = node.icon;

          return (
            <div key={node.id} className="relative flex flex-col items-center">
              <button
                onClick={() => setSelectedNode(node)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isNodeActive
                    ? "bg-gradient-to-b from-cyan-950/90 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400"
                    : "bg-slate-950/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                      isNodeActive
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">#{index + 1}</span>
                </div>

                <p className="text-[11px] font-semibold text-slate-200 line-clamp-1">{node.label}</p>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">{node.latencySLA}</p>
              </button>

              {/* Connecting arrow for desktop */}
              {index < nodes.length - 1 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600 pointer-events-none">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Node Details Inspection Drawer */}
      {selectedNode && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs flex items-start justify-between gap-3 animate-fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">{selectedNode.label}</span>
              <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                {selectedNode.tech}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-1">{selectedNode.role}</p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">
              Target Latency SLA: <strong className="text-emerald-400">{selectedNode.latencySLA}</strong>
            </p>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

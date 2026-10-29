"use client";

import React from "react";
import { Mic, ExternalLink, ArrowUpRight } from "lucide-react";
import { soundFX } from "@/lib/audio";

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  description: string;
  stats: string;
  prompt: string;
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectShowcaseProps {
  onAskQuestion: (prompt: string) => void;
  disabled: boolean;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onAskQuestion, disabled }) => {
  const projects: ProjectItem[] = [
    {
      id: "vaaksudhi",
      title: "Vaaksudhi & Vaakify",
      subtitle: "Pediatric Speech Diagnostics across 8 Indian Languages",
      badge: "Clinical Speech AI",
      badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-800/60",
      description:
        "Engineered real-time pronunciation scoring combining Faster-Whisper, Vosk, and Kokoro ONNX with sub-300ms phoneme-level verification, LangGraph multi-agent diagnostic workflows, and Q-learning.",
      stats: "<300ms Latency · 8 Languages",
      prompt: "Tell me about your clinical speech engine at Manas Learning and Vaaksudhi.",
      liveUrl: "https://vaaksudhi.manaslearning.com",
      githubUrl: "https://github.com/darayavahoush/agenti_ai",
    },
    {
      id: "nivesh",
      title: "Nivesh AI Wealth Intelligence",
      subtitle: "Enterprise Multilingual Speech & Attention RAG",
      badge: "Enterprise RAG on Azure",
      badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-800/60",
      description:
        "Architected scalable audio ingestion microservices supporting 10,000+ mutual fund distributors. Deployed domain-adapted Whisper + Sarvam STT and zero-hallucination ChromaDB RAG.",
      stats: "10,000+ MFDs · 80% Time Saved",
      prompt: "Tell me about your experience and impact at Nivesh AI.",
    },
    {
      id: "firebot",
      title: "NIRVANA (Firebot)",
      subtitle: "Autonomous Firefighting Robot & MuJoCo 3D Physics",
      badge: "Robotics & PPO RL",
      badgeColor: "bg-amber-950/80 text-amber-300 border-amber-800/60",
      description:
        "Built autonomous robotics simulator with multimodal sensor fusion (Lidar, IMU, thermal) navigating multi-room environments to localize fire sources, streaming live telemetry to a Three.js web console.",
      stats: "<45s Fire Localization · MuJoCo",
      prompt: "Tell me about your NIRVANA Firebot robotics project.",
      liveUrl: "https://firebot-api.onrender.com",
      githubUrl: "https://github.com/darayavahoush/firebot",
    },
    {
      id: "tripwire",
      title: "Tripwire Edge Computer Vision",
      subtitle: "Sub-50ms CPU-Only Vehicle Tracking Pipeline",
      badge: "Edge AI & Vision",
      badgeColor: "bg-purple-950/80 text-purple-300 border-purple-800/60",
      description:
        "Engineered edge vehicle counter from live CCTV feeds running entirely on commodity CPUs without GPUs. Implemented background subtraction, centroid tracking, and WebSocket telemetry.",
      stats: "<50ms Frame Latency · Zero GPU",
      prompt: "Tell me about Tripwire Edge Computer Vision.",
      liveUrl: "https://tripwire-inky.vercel.app",
      githubUrl: "https://github.com/darayavahoush/vehicle-counter",
    },
  ];

  const handleAsk = (prompt: string) => {
    soundFX.playTap();
    onAskQuestion(prompt);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Verified Production Systems (Interactive Bento Grid)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
          Tap &ldquo;Ask Ananya&rdquo; on any system to trigger spoken briefing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="glass-card rounded-2xl p-4 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top row */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${proj.badgeColor}`}>
                  {proj.badge}
                </span>

                <div className="flex items-center gap-1.5 text-slate-400">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:text-white transition"
                      title="Open Live Deployment"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {proj.title}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{proj.subtitle}</p>

              <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-3">
                {proj.description}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                {proj.stats}
              </span>

              <button
                onClick={() => handleAsk(proj.prompt)}
                disabled={disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 hover:text-white border border-cyan-500/40 font-medium text-xs transition active:scale-95 disabled:opacity-50"
              >
                <Mic className="w-3 h-3 text-cyan-400" />
                <span>Ask Ananya</span>
                <ArrowUpRight className="w-3 h-3 opacity-70" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

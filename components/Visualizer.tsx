"use client";

import React, { useEffect, useRef } from "react";
import { VoiceState } from "@/lib/types";

interface VisualizerProps {
  state: VoiceState;
  audioStream: MediaStream | null;
}

export const Visualizer: React.FC<VisualizerProps> = ({ state, audioStream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (audioStream && state === "listening") {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        const source = ctx.createMediaStreamSource(audioStream);
        source.connect(analyser);

        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current = source;
      } catch (e) {
        console.warn("Could not initialize mic audio analyser:", e);
      }
    } else {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    }

    return () => {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [audioStream, state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const barCount = 32;
      const barWidth = 4;
      const spacing = 4;
      const totalWidth = barCount * (barWidth + spacing);
      const startX = (width - totalWidth) / 2;

      let freqData: Uint8Array | null = null;
      if (analyserRef.current && state === "listening") {
        const binCount = analyserRef.current.frequencyBinCount;
        freqData = new Uint8Array(new ArrayBuffer(binCount));
        (analyserRef.current as AnalyserNode).getByteFrequencyData(freqData as unknown as Uint8Array<ArrayBuffer>);
      }

      phase += 0.08;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 6;

        if (state === "listening") {
          if (freqData) {
            const raw = freqData[i % freqData.length] || 0;
            barHeight = Math.max(6, (raw / 255) * (height * 0.75));
          } else {
            barHeight = 10 + Math.sin(phase + i * 0.3) * 15;
          }
        } else if (state === "speaking") {
          // Dynamic simulated voice cadence
          const wave1 = Math.sin(phase * 1.5 + i * 0.4);
          const wave2 = Math.cos(phase * 0.9 - i * 0.2);
          barHeight = 12 + Math.abs(wave1 * wave2) * (height * 0.65);
        } else if (state === "thinking") {
          // Subtle traveling pulse
          const pulse = Math.sin(phase * 2 - i * 0.35);
          barHeight = 8 + Math.max(0, pulse) * (height * 0.4);
        } else {
          // Idle breathing sine wave
          barHeight = 6 + Math.sin(phase * 0.6 + i * 0.2) * 5;
        }

        const x = startX + i * (barWidth + spacing);
        const y = centerY - barHeight / 2;

        // Gradient based on state
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (state === "listening") {
          gradient.addColorStop(0, "#06b6d4"); // cyan
          gradient.addColorStop(1, "#10b981"); // emerald
        } else if (state === "speaking") {
          gradient.addColorStop(0, "#8b5cf6"); // purple
          gradient.addColorStop(0.5, "#ec4899"); // pink
          gradient.addColorStop(1, "#3b82f6"); // blue
        } else if (state === "thinking") {
          gradient.addColorStop(0, "#f59e0b"); // amber
          gradient.addColorStop(1, "#ef4444"); // red
        } else {
          gradient.addColorStop(0, "rgba(100, 116, 139, 0.6)");
          gradient.addColorStop(1, "rgba(51, 65, 85, 0.4)");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, Math.max(4, barHeight), 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state]);

  return (
    <div className="relative flex items-center justify-center w-full max-w-sm h-24 my-2">
      {/* Background glow orb */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none opacity-40 ${
          state === "listening"
            ? "bg-cyan-500/30 scale-110"
            : state === "speaking"
            ? "bg-purple-500/35 scale-125"
            : state === "thinking"
            ? "bg-amber-500/30 scale-105"
            : "bg-slate-700/10 scale-90"
        }`}
      />
      <canvas
        ref={canvasRef}
        width={320}
        height={90}
        className="relative z-10 w-full h-full"
      />
    </div>
  );
};

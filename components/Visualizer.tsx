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
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      const barCount = 36;
      const barWidth = 4;
      const spacing = 4;
      const totalWidth = barCount * (barWidth + spacing);
      const startX = (width - totalWidth) / 2;

      let freqData: Uint8Array | null = null;
      if (analyserRef.current && state === "listening") {
        const binCount = analyserRef.current.frequencyBinCount;
        freqData = new Uint8Array(new ArrayBuffer(binCount));
        analyserRef.current.getByteFrequencyData(freqData as unknown as Uint8Array<ArrayBuffer>);
      }

      phase += 0.08;

      // Draw subtle orbital particle nodes in background
      for (let p = 0; p < 8; p++) {
        const angle = phase * 0.7 + (p * Math.PI) / 4;
        const radiusX = width * 0.42;
        const radiusY = height * 0.35;
        const px = width / 2 + Math.cos(angle) * radiusX;
        const py = height / 2 + Math.sin(angle) * radiusY;

        ctx.beginPath();
        ctx.arc(px, py, state === "speaking" ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle =
          state === "speaking"
            ? "rgba(168, 85, 247, 0.4)"
            : state === "listening"
            ? "rgba(6, 182, 212, 0.4)"
            : "rgba(100, 116, 139, 0.2)";
        ctx.fill();
      }

      // Draw dynamic audio frequency bars
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
          const wave1 = Math.sin(phase * 1.5 + i * 0.4);
          const wave2 = Math.cos(phase * 0.9 - i * 0.2);
          barHeight = 12 + Math.abs(wave1 * wave2) * (height * 0.7);
        } else if (state === "thinking") {
          const pulse = Math.sin(phase * 2 - i * 0.35);
          barHeight = 8 + Math.max(0, pulse) * (height * 0.45);
        } else {
          barHeight = 6 + Math.sin(phase * 0.6 + i * 0.2) * 5;
        }

        const x = startX + i * (barWidth + spacing);
        const y = centerY - barHeight / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (state === "listening") {
          gradient.addColorStop(0, "#06b6d4"); // cyan
          gradient.addColorStop(1, "#10b981"); // emerald
        } else if (state === "speaking") {
          gradient.addColorStop(0, "#c084fc"); // purple-400
          gradient.addColorStop(0.5, "#ec4899"); // pink-500
          gradient.addColorStop(1, "#3b82f6"); // blue-500
        } else if (state === "thinking") {
          gradient.addColorStop(0, "#fbbf24"); // amber-400
          gradient.addColorStop(1, "#f97316"); // orange-500
        } else {
          gradient.addColorStop(0, "rgba(148, 163, 184, 0.5)");
          gradient.addColorStop(1, "rgba(51, 65, 85, 0.3)");
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
    <div className="relative flex items-center justify-center w-full max-w-sm h-28 my-1">
      {/* Background glow orb */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 pointer-events-none opacity-40 ${
          state === "listening"
            ? "bg-cyan-500/35 scale-110"
            : state === "speaking"
            ? "bg-purple-600/40 scale-125"
            : state === "thinking"
            ? "bg-amber-500/35 scale-105"
            : "bg-slate-700/10 scale-90"
        }`}
      />
      <canvas ref={canvasRef} width={340} height={100} className="relative z-10 w-full h-full" />
    </div>
  );
};

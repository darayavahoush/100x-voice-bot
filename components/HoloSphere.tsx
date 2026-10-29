"use client";

import React, { useEffect, useRef } from "react";
import { VoiceState } from "@/lib/types";

interface HoloSphereProps {
  state: VoiceState;
  audioStream: MediaStream | null;
  onOrbClick?: () => void;
}

export const HoloSphere: React.FC<HoloSphereProps> = ({ state, audioStream, onOrbClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Audio Analyser Setup for live Mic
  useEffect(() => {
    if (audioStream && state === "listening") {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        const source = ctx.createMediaStreamSource(audioStream);
        source.connect(analyser);

        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current = source;
      } catch (e) {
        console.warn("Audio analyser initialization error:", e);
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
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [audioStream, state]);

  // Canvas fluid harmonic rendering loop
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

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = 54;

      let micEnergy = 0;
      if (analyserRef.current && state === "listening") {
        const binCount = analyserRef.current.frequencyBinCount;
        const freqData = new Uint8Array(new ArrayBuffer(binCount));
        analyserRef.current.getByteFrequencyData(freqData as unknown as Uint8Array<ArrayBuffer>);
        let sum = 0;
        for (let i = 0; i < freqData.length; i++) sum += freqData[i];
        micEnergy = sum / (freqData.length * 255);
      }

      phase += state === "speaking" ? 0.05 : state === "thinking" ? 0.08 : state === "listening" ? 0.04 : 0.02;

      // 1. Draw outer ambient particle halo
      const particleCount = 24;
      for (let i = 0; i < particleCount; i++) {
        const pAngle = (i / particleCount) * Math.PI * 2 + phase * 0.4;
        const pDist =
          baseRadius + 28 + Math.sin(phase * 2 + i * 1.5) * (state === "speaking" ? 18 : 8);
        const px = centerX + Math.cos(pAngle) * pDist;
        const py = centerY + Math.sin(pAngle) * pDist;

        ctx.beginPath();
        ctx.arc(px, py, state === "speaking" ? 2 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle =
          state === "speaking"
            ? "rgba(192, 132, 252, 0.45)"
            : state === "listening"
            ? "rgba(6, 182, 212, 0.45)"
            : state === "thinking"
            ? "rgba(251, 191, 36, 0.4)"
            : "rgba(148, 163, 184, 0.2)";
        ctx.fill();
      }

      // 2. Draw multiple undulating harmonic rings (Perlin-style liquid ribbons)
      const ringLayers = [
        { scale: 1.18, alpha: 0.18, freq: 4, speed: 1.2 },
        { scale: 1.08, alpha: 0.28, freq: 5, speed: -1.0 },
        { scale: 0.98, alpha: 0.45, freq: 6, speed: 1.5 },
        { scale: 0.88, alpha: 0.65, freq: 7, speed: -1.3 },
      ];

      for (const layer of ringLayers) {
        ctx.beginPath();
        const points = 72;
        for (let p = 0; p <= points; p++) {
          const theta = (p / points) * Math.PI * 2;
          let deformation = 0;

          if (state === "listening") {
            deformation = Math.sin(theta * layer.freq + phase * layer.speed) * (6 + micEnergy * 28);
          } else if (state === "speaking") {
            const harmonic =
              Math.sin(theta * 3 + phase * 2) * Math.cos(theta * 2 - phase * 1.5);
            deformation = harmonic * 16;
          } else if (state === "thinking") {
            deformation = Math.sin(theta * 8 + phase * 4) * 7;
          } else {
            deformation = Math.sin(theta * 3 + phase * 0.8) * 3;
          }

          const r = baseRadius * layer.scale + deformation;
          const x = centerX + Math.cos(theta) * r;
          const y = centerY + Math.sin(theta) * r;

          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // Layer gradient
        const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, baseRadius * 1.4);
        if (state === "listening") {
          grad.addColorStop(0, `rgba(6, 182, 212, ${layer.alpha * 0.8})`);
          grad.addColorStop(0.7, `rgba(16, 185, 129, ${layer.alpha})`);
          grad.addColorStop(1, "rgba(6, 182, 212, 0)");
        } else if (state === "speaking") {
          grad.addColorStop(0, `rgba(192, 132, 252, ${layer.alpha})`);
          grad.addColorStop(0.5, `rgba(236, 72, 153, ${layer.alpha * 0.9})`);
          grad.addColorStop(1, `rgba(59, 130, 246, 0)`);
        } else if (state === "thinking") {
          grad.addColorStop(0, `rgba(251, 191, 36, ${layer.alpha})`);
          grad.addColorStop(0.7, `rgba(249, 115, 22, ${layer.alpha * 0.8})`);
          grad.addColorStop(1, "rgba(239, 68, 68, 0)");
        } else {
          grad.addColorStop(0, `rgba(99, 102, 241, ${layer.alpha * 0.5})`);
          grad.addColorStop(0.6, `rgba(148, 163, 184, ${layer.alpha * 0.4})`);
          grad.addColorStop(1, "rgba(15, 23, 42, 0)");
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // 3. Central iridescent glowing sphere core
      const coreRadius =
        baseRadius * 0.75 + (state === "listening" ? micEnergy * 15 : Math.sin(phase) * 3);
      const coreGrad = ctx.createRadialGradient(
        centerX - coreRadius * 0.3,
        centerY - coreRadius * 0.3,
        coreRadius * 0.1,
        centerX,
        centerY,
        coreRadius
      );

      if (state === "listening") {
        coreGrad.addColorStop(0, "#a5f3fc");
        coreGrad.addColorStop(0.4, "#06b6d4");
        coreGrad.addColorStop(0.8, "#047857");
        coreGrad.addColorStop(1, "rgba(6, 182, 212, 0.2)");
      } else if (state === "speaking") {
        coreGrad.addColorStop(0, "#f5d0fe");
        coreGrad.addColorStop(0.3, "#c084fc");
        coreGrad.addColorStop(0.7, "#7c3aed");
        coreGrad.addColorStop(1, "rgba(124, 58, 237, 0.2)");
      } else if (state === "thinking") {
        coreGrad.addColorStop(0, "#fef08a");
        coreGrad.addColorStop(0.4, "#f59e0b");
        coreGrad.addColorStop(0.8, "#b45309");
        coreGrad.addColorStop(1, "rgba(245, 158, 11, 0.2)");
      } else {
        coreGrad.addColorStop(0, "#c7d2fe");
        coreGrad.addColorStop(0.3, "#6366f1");
        coreGrad.addColorStop(0.8, "#1e1b4b");
        coreGrad.addColorStop(1, "rgba(99, 102, 241, 0.15)");
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Specular highlight gleam
      ctx.beginPath();
      ctx.ellipse(
        centerX - coreRadius * 0.35,
        centerY - coreRadius * 0.35,
        coreRadius * 0.25,
        coreRadius * 0.12,
        Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fill();

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
    <div
      onClick={onOrbClick}
      className="relative flex items-center justify-center w-64 h-64 my-2 cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label="Interactive Holographic Voice Core"
    >
      {/* Background Volumetric Glow Halo */}
      <div
        className={`absolute inset-4 rounded-full blur-3xl transition-all duration-700 pointer-events-none opacity-50 ${
          state === "listening"
            ? "bg-cyan-500/40 scale-125"
            : state === "speaking"
            ? "bg-purple-600/45 scale-135"
            : state === "thinking"
            ? "bg-amber-500/40 scale-115"
            : "bg-indigo-600/20 scale-100 group-hover:scale-110"
        }`}
      />

      <canvas
        ref={canvasRef}
        width={260}
        height={260}
        className="relative z-10 w-full h-full transition-transform duration-300 group-hover:scale-105 active:scale-95"
      />
    </div>
  );
};

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Message, VoiceState } from "@/lib/types";
import { Header } from "@/components/Header";
import { Visualizer } from "@/components/Visualizer";
import { VoiceController } from "@/components/VoiceController";
import { QuestionPills } from "@/components/QuestionPills";
import { ChatTranscript } from "@/components/ChatTranscript";
import { AssessmentModal } from "@/components/AssessmentModal";
import { soundFX } from "@/lib/audio";
import { Key, Settings2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

// SpeechRecognition type polyfill
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
    isFinal: boolean;
  };
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): BrowserSpeechRecognition };
    webkitSpeechRecognition?: { new (): BrowserSpeechRecognition };
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Advanced settings for optional keys
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>("");

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const handleSendMessageRef = useRef<(text: string) => Promise<void>>(async () => {});
  const stopAudioStreamRef = useRef<() => void>(() => {});

  const stopAudioStream = useCallback(() => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
  }, [audioStream]);

  stopAudioStreamRef.current = stopAudioStream;
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setVoiceState("listening");
        setInterimTranscript("");
        soundFX.playMicStart();
      };

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (interim) setInterimTranscript(interim);
        if (final) {
          setInterimTranscript(final);
          handleSendMessageRef.current(final);
        }
      };

      rec.onerror = (e: SpeechRecognitionErrorEvent) => {
        console.warn("Speech recognition error:", e.error);
        setVoiceState("idle");
        stopAudioStreamRef.current();
      };

      rec.onend = () => {
        setVoiceState((prev) => (prev === "listening" ? "idle" : prev));
        stopAudioStreamRef.current();
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopAudioStreamRef.current();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = async () => {
    // Interrupt any ongoing speech
    interruptSpeech();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
      }
    } catch (err) {
      console.warn("Microphone access prompt error:", err);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition already started or error:", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Could not stop recognition:", e);
      }
    }
    stopAudioStream();
    setVoiceState("idle");
  };

  const interruptSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    currentUtteranceRef.current = null;
    if (voiceState === "speaking") {
      setVoiceState("idle");
    }
  }, [voiceState]);

  const speakText = useCallback(
    (text: string) => {
      if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
        setVoiceState("idle");
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = 1.05; // slightly higher, bright & articulate

      // Pick best natural voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          (v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Victoria") ||
            v.name.includes("Google US English") ||
            v.name.includes("Natural") ||
            v.name.includes("English United States")) &&
          v.lang.startsWith("en")
      );

      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => {
        setVoiceState("speaking");
        soundFX.playReplyReady();
      };

      utterance.onend = () => {
        setVoiceState("idle");
      };

      utterance.onerror = () => {
        setVoiceState("idle");
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled, speechRate]
  );

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    interruptSpeech();
    stopListening();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setVoiceState("thinking");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userApiKey: customApiKey || undefined,
        }),
      });

      const data = await response.json();
      const botReply = data.content || "I didn't catch that. Could you rephrase?";

      const assistantMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: botReply,
        timestamp: Date.now(),
        matchedId: data.matchedId,
        provider: data.provider,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);

      if (data.matchedId) {
        setActiveQuestionId(data.matchedId);
      }

      // Speak response out loud
      speakText(botReply);
    } catch (err) {
      console.error("Chat error:", err);
      setIsLoading(false);
      setVoiceState("idle");

      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "I encountered a momentary connection issue. Please feel free to test another question or speak again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  handleSendMessageRef.current = handleSendMessage;

  const handleSelectQuestion = (q: string) => {
    soundFX.playTap();
    handleSendMessage(q);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header onOpenAssessmentModal={() => setIsAssessmentModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Stage 1 Benchmark Pills (Evaluator Quick Testing) */}
        <section aria-label="Assessment Questions">
          <QuestionPills
            onSelectQuestion={handleSelectQuestion}
            activeQuestionId={activeQuestionId}
            disabled={isLoading || voiceState === "listening"}
          />
        </section>

        {/* Central Voice Engine & Dialogue Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Glowing Voice Engine & Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900/50 border border-slate-800/90 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Ambient Background Aura */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-1">
              <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-semibold">
                Interactive Voice Engine
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5">
                Real-Time Voice &amp; Persona Interface
              </h2>
            </div>

            {/* Dynamic Waveform Visualizer */}
            <Visualizer state={voiceState} audioStream={audioStream} />

            {/* Central Voice Controller */}
            <VoiceController
              state={voiceState}
              onStartListening={startListening}
              onStopListening={stopListening}
              onInterruptSpeech={interruptSpeech}
              voiceEnabled={voiceEnabled}
              onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
              interimTranscript={interimTranscript}
              speechRate={speechRate}
              onChangeSpeechRate={setSpeechRate}
            />

            {/* Quick Context Card */}
            <div className="w-full mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Candidate Calibration
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">100% Zero-GPA Constraint</span>
              </div>
              <p className="leading-snug text-slate-400">
                Grounded in Ananya&apos;s real-world engineering at <strong className="text-slate-200">Manas Learning</strong> (clinical speech AI across 8 Indian languages) and <strong className="text-slate-200">Nivesh AI</strong> (Azure RAG for 10,000+ MFDs).
              </p>
            </div>

            {/* Advanced Settings Drawer (Optional Keys) */}
            <div className="w-full mt-3 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 hover:text-slate-200 transition py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Settings2 className="w-3 h-3" />
                  <span>Advanced Settings / Custom Key</span>
                </span>
                {isAdvancedOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {isAdvancedOpen && (
                <div className="mt-2 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] space-y-2">
                  <p className="text-slate-400 text-[10px] leading-tight">
                    *Zero key is required for evaluators by default (handled automatically). You can optionally provide your own Groq / Grok / OpenAI key below to benchmark arbitrary models.
                  </p>
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <input
                      type="password"
                      placeholder="Optional: gsk_... / xai-... / sk-..."
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat Transcript & Fallback Input */}
          <div className="lg:col-span-7">
            <ChatTranscript
              messages={messages}
              onSendMessage={handleSendMessage}
              onReplayVoice={speakText}
              onClearMessages={() => setMessages([])}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Assessment Modal Brief */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-mono">
        <p>
          100x AI Agent Team Stage 1 Assessment · Built by Ananya Sridhar ·{" "}
          <a
            href="mailto:ananyasridhar108@gmail.com"
            className="text-slate-400 hover:text-cyan-400 underline underline-offset-2 transition"
          >
            ananyasridhar108@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}

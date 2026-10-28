"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import {
  Volume2,
  Copy,
  Check,
  Send,
  Trash2,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
} from "lucide-react";

interface ChatTranscriptProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onReplayVoice: (text: string) => void;
  onClearMessages: () => void;
  isLoading: boolean;
}

export const ChatTranscript: React.FC<ChatTranscriptProps> = ({
  messages,
  onSendMessage,
  onReplayVoice,
  onClearMessages,
  isLoading,
}) => {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full flex flex-col h-[520px] rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Transcript Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Live Transcript &amp; Dialogue</span>
          <span className="text-[10px] font-mono text-slate-500">
            ({messages.filter((m) => m.role !== "system").length} turns)
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearMessages}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition"
            title="Clear dialogue history"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">
              Welcome to Ananya&apos;s AI Voice Bot
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              Built for the <strong className="text-cyan-300">100x AI Agent Team</strong> Stage 1
              Assessment. Tap the big microphone to speak, or pick any of the benchmark question pills above.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800/80">⚡ Real-time STT/TTS</span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80">🔒 Zero API Key Required</span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80">🎙️ Sub-300ms Speech</span>
            </div>
          </div>
        ) : (
          messages
            .filter((m) => m.role !== "system")
            .map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-600/20">
                      AS
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs shadow-md shadow-cyan-600/10"
                        : "bg-slate-800/90 text-slate-100 border border-slate-750 rounded-tl-xs shadow-md"
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
                      <span className={`font-semibold ${isUser ? "text-cyan-100" : "text-cyan-400"}`}>
                        {isUser ? "Evaluator" : "Ananya Sridhar"}
                      </span>

                      {!isUser && (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                          {msg.matchedId && (
                            <span className="inline-flex items-center gap-0.5 text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/50">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              100x Benchmark Verified
                            </span>
                          )}
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Actions for Assistant Message */}
                    {!isUser && (
                      <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-slate-700/50 text-slate-400">
                        <button
                          onClick={() => onReplayVoice(msg.content)}
                          className="p-1 hover:text-cyan-300 rounded hover:bg-slate-700/50 transition"
                          title="Replay Voice"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1 hover:text-white rounded hover:bg-slate-700/50 transition"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-300 text-xs shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold animate-pulse">
              AS
            </div>
            <div className="bg-slate-800/90 text-slate-300 border border-slate-750 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Ananya is synthesizing voice response...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Text Fallback Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type any custom question or follow-up for Ananya..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-cyan-600/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

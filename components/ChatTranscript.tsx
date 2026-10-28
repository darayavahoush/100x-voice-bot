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
  Globe,
  Share2,
  Zap,
} from "lucide-react";

interface ChatTranscriptProps {
  messages: Message[];
  onSendMessage: (text: string, enableSearch?: boolean) => void;
  onReplayVoice: (text: string) => void;
  onClearMessages: () => void;
  isLoading: boolean;
  enableWebSearch: boolean;
  onToggleWebSearch: () => void;
}

export const ChatTranscript: React.FC<ChatTranscriptProps> = ({
  messages,
  onSendMessage,
  onReplayVoice,
  onClearMessages,
  isLoading,
  enableWebSearch,
  onToggleWebSearch,
}) => {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim(), enableWebSearch);
    setInputText("");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const formatted = messages
      .filter((m) => m.role !== "system")
      .map(
        (m) =>
          `**${m.role === "user" ? "Evaluator" : "Ananya Sridhar (AI Agent)"}**: ${m.content}\n`
      )
      .join("\n");

    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full flex flex-col h-[560px] rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Transcript Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Live Dialogue Stream &amp; Inference
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            ({messages.filter((m) => m.role !== "system").length} turns)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition"
                title="Copy entire interview as Markdown"
              >
                {copiedAll ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Share2 className="w-3 h-3" />
                )}
                <span>{copiedAll ? "Copied" : "Export"}</span>
              </button>

              <button
                onClick={onClearMessages}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition"
                title="Clear dialogue history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-950 to-indigo-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">
              Ananya Sridhar — 100x AI Agent Voice Bot
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
              Trained on production Speech AI, multi-agent workflows (LangGraph), and real-time execution.
              Tap the hero mic to talk, pick a question pill, or type below.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                Groq 9ms Inference
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" />
                Parallel.ai Web Grounding
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/60">
                🔒 Zero Evaluator Key Required
              </span>
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
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-600/20">
                      AS
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all ${
                      isUser
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs shadow-md shadow-cyan-600/10"
                        : "bg-slate-800/90 text-slate-100 border border-slate-750 rounded-tl-xs shadow-md"
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px]">
                      <span className={`font-semibold ${isUser ? "text-cyan-100" : "text-cyan-400"}`}>
                        {isUser ? "Evaluator" : "Ananya Sridhar (AI Persona)"}
                      </span>

                      {!isUser && (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                          {msg.matchedId && (
                            <span className="inline-flex items-center gap-0.5 text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              100x Benchmark Verified
                            </span>
                          )}
                          {msg.provider && (
                            <span className="hidden sm:inline text-slate-400">
                              [{msg.provider}]
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
                          className="p-1 hover:text-cyan-300 rounded hover:bg-slate-700/50 transition flex items-center gap-1 text-[10px] font-mono"
                          title="Replay Voice Synthesis"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Replay</span>
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
              <span>Synthesizing voice response with Groq &amp; Parallel.ai...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input & Search Toggle Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90 space-y-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-cyan-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        {/* Live Grounding Toggle Button */}
        <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
          <button
            type="button"
            onClick={onToggleWebSearch}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border transition ${
              enableWebSearch
                ? "bg-cyan-950/80 text-cyan-300 border-cyan-800/60 font-medium"
                : "bg-slate-900/60 text-slate-500 border-slate-800"
            }`}
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>Parallel.ai Live Web Grounding: {enableWebSearch ? "Active" : "Auto-Trigger"}</span>
          </button>

          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            Groq Qwen 3.8 27B active (&lt;200ms)
          </span>
        </div>
      </div>
    </div>
  );
};

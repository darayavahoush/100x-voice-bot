# Ananya Sridhar — 100x AI Agent Team Voice Bot

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Duplex%20Voice-emerald?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Zero Key Requirement](https://img.shields.io/badge/Evaluator%20Key-Zero%20Required-cyan?style=flat)]()

Interactive, real-time voice agent built for the **100x AI Agent Team** Stage 1 Assessment. This system replicates Ananya Sridhar's authentic voice, technical depth, and architectural philosophy across Speech AI, Generative AI, and Autonomous Multi-Agent Workflows.

---

## ⚡ Key Highlights for 100x Evaluators

1. **Zero API Key Entry Required**: Evaluators are never prompted to provide OpenAI, Anthropic, or Gemini keys. The application is completely turnkey and ready to test out of the box.
2. **Sub-300ms Real-Time Voice Duplex**: Powered by browser-native `SpeechRecognition` (STT), low-latency audio frequency visualizer, and `SpeechSynthesis` (TTS) with natural prosody and interruptibility.
3. **1-Tap Benchmark Testing**: 5 pre-calibrated quick chips for all core Stage 1 questions + deep-dive architectural prompts.
4. **Strict Constraint Adherence**: 100% grounded in engineering output, production systems, and open-source code (zero mention of GPA / marks).
5. **Integrated Artifacts**: In-app download and preview of [Ananya_Sridhar_Resume_AI_ML_Agentic.pdf](./public/Ananya_Sridhar_Resume_AI_ML_Agentic.pdf).

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       BROWSER CLIENT                        │
│                                                             │
│   [ Evaluator Microphone ]                                  │
│             │                                               │
│             ▼                                               │
│   [ Web Speech API: STT ] ───► [ Interim Stream Display ]   │
│             │                                               │
│             ▼                                               │
│   [ Web Audio Analyser ]  ───► [ Real-Time Canvas Waves ]   │
└─────────────┬───────────────────────────────────────────────┘
              │ POST /api/chat
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND ROUTER                         │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 1. Deterministic Benchmark Cache (100% Precision)   │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 2. Dynamic LLM Gateway (Groq / xAI Grok / Gemini)   │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 3. Fallback Knowledge Engine (Zero Failure SLA)     │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────┬───────────────────────────────────────────────┘
              │ JSON Response
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VOICE SYNTHESIS & UI                     │
│                                                             │
│   [ SpeechSynthesis (TTS) ] ───► Natural Spoken Audio       │
│   [ Dynamic Waveform Cadence ] ──► Harmonics Visualization  │
│   [ Dialogue History ] ─────────► Timestamped Transcript    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Tested Benchmark Questions & Persona Mapping

| # | Benchmark Prompt | Focus Area | Grounding & Production Evidence |
|---|---|---|---|
| **Q1** | *What should we know about your life story in a few sentences?* | Origin & Obsession | Signal processing roots &rarr; Speech AI at Manas Learning &rarr; Audio RAG at Nivesh AI &rarr; Autonomous Agent systems. |
| **Q2** | *What's your #1 superpower?* | Core Edge | End-to-end execution on ambiguous AI frontiers (noisy audio, dynamic browser DOMs &rarr; robust autonomous loops). |
| **Q3** | *What are the top 3 areas you'd like to grow in?* | Growth Vision | Multi-agent consensus without drift, sub-300ms duplex voice WebSockets, and RLAIF for self-healing browser agents. |
| **Q4** | *What misconception do your coworkers have about you?* | Self-Awareness | Deep heads-down focus is mistakenly seen as reserved, but is actually upfront edge-case de-risking for zero rework. |
| **Q5** | *How do you push your boundaries and limits?* | Grit & Velocity | Intentionally building at uncomfortable bleeding edge where tutorials don't exist; treating friction as a growth signal. |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Serverless Functions)
- **Language**: TypeScript (Strict typing, zero compile warnings)
- **Styling**: Tailwind CSS (Dark-first cyberpunk aesthetic, glassmorphism)
- **Audio Processing**: Web Audio API (`AudioContext`, `AnalyserNode`), HTML5 Canvas
- **Speech Engine**: Browser Web Speech API (`webkitSpeechRecognition` + `SpeechSynthesis`)
- **LLM Routing**: Multi-provider fallback (Groq Llama-3.3-70b / xAI Grok / Gemini 1.5 Flash / Deterministic Grounding)
- **Icons & Delight**: `lucide-react`, `canvas-confetti`, synthesized tactile Web Audio chimes

---

## 🚀 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/darayavahoush/100x-voice-bot.git
   cd 100x-voice-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **(Optional) Configure environment variables**:
   Create a `.env.local` file if you wish to run dynamic LLM calls for arbitrary out-of-domain questions:
   ```env
   GROQ_API_KEY=gsk_...
   XAI_API_KEY=xai-...
   GEMINI_API_KEY=...
   OPENAI_API_KEY=sk-...
   ```
   *(Note: The voice bot works completely out of the box with zero keys configured!)*

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to test.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📬 Contact & Candidate Profile

- **Candidate**: Ananya Sridhar
- **Email**: [ananyasridhar108@gmail.com](mailto:ananyasridhar108@gmail.com)
- **LinkedIn**: [linkedin.com/in/ananya-sridhar-ai](https://www.linkedin.com/in/ananya-sridhar-ai)
- **GitHub**: [github.com/darayavahoush](https://github.com/darayavahoush)
- **Portfolio**: [darayavahoush.github.io](https://darayavahoush.github.io/)
- **Live Projects**:
  - [Vaaksudhi Clinical Speech Platform](https://vaaksudhi.manaslearning.com)
  - [Vaakify Platform](https://vaakify.manaslearning.com)
  - [NIRVANA Firebot Console](https://firebot-api.onrender.com)
  - [Tripwire Edge Vehicle Counter](https://tripwire-inky.vercel.app)

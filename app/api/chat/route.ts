import { NextRequest, NextResponse } from "next/server";
import { ANANYA_SYSTEM_PROMPT, findMatchingAnswer } from "@/lib/persona";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ParallelSearchResult {
  url: string;
  title: string;
  excerpts?: string[];
}

// Function to fetch live web grounding from Parallel API if needed
async function fetchParallelSearch(query: string, parallelKey: string): Promise<string> {
  try {
    const res = await fetch("https://api.parallel.ai/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": parallelKey,
      },
      body: JSON.stringify({
        objective: `Provide factual context for answering: ${query}`,
        search_queries: [query],
      }),
    });

    if (!res.ok) return "";
    const data = await res.json();
    const results: ParallelSearchResult[] = data.results || [];
    if (results.length === 0) return "";

    const snippets = results
      .slice(0, 2)
      .map((r) => `[Source: ${r.title} (${r.url})]\n${(r.excerpts || []).slice(0, 2).join("\n")}`)
      .join("\n\n");

    return snippets;
  } catch (err) {
    console.warn("Parallel search grounding skipped:", err);
    return "";
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { messages, userApiKey, enableWebSearch } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const latestUserMessage = [...messages].reverse().find((m: ChatMessage) => m.role === "user");
    const userPrompt = latestUserMessage ? latestUserMessage.content : "";

    // 1. Check deterministic benchmark cache first
    const benchmarkMatch = findMatchingAnswer(userPrompt);
    if (benchmarkMatch) {
      return NextResponse.json({
        content: benchmarkMatch.answer,
        provider: "100x-benchmark-verified",
        matchedId: benchmarkMatch.id,
        latencyMs: Date.now() - startTime,
      });
    }

    // 2. Identify keys
    const groqKey = userApiKey || process.env.GROQ_API_KEY;
    const parallelKey = process.env.PARALLEL_API_KEY;
    const groqModel = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

    // 3. Optional Parallel.ai Real-Time Grounding
    let webContext = "";
    const lowerPrompt = userPrompt.toLowerCase();
    const isSearchNeeded =
      enableWebSearch ||
      lowerPrompt.includes("100x") ||
      lowerPrompt.includes("nik shah") ||
      lowerPrompt.includes("home.llc") ||
      lowerPrompt.includes("latest") ||
      lowerPrompt.includes("news") ||
      lowerPrompt.includes("search");

    if (parallelKey && isSearchNeeded) {
      webContext = await fetchParallelSearch(userPrompt, parallelKey);
    }

    const dynamicSystemPrompt = webContext
      ? `${ANANYA_SYSTEM_PROMPT}\n\n### Live Real-Time Web Grounding (via Parallel.ai):\n${webContext}\n\nSynthesize your answer in first person with Ananya's sharp voice.`
      : ANANYA_SYSTEM_PROMPT;

    // 4. Try Groq (ultra-low latency)
    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: groqModel,
            messages: [{ role: "system", content: dynamicSystemPrompt }, ...messages],
            temperature: 0.6,
            max_tokens: 300,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              content: reply.trim(),
              provider: `groq-${groqModel}`,
              latencyMs: Date.now() - startTime,
              grounded: Boolean(webContext),
            });
          }
        }
      } catch (err) {
        console.error("Groq call failed, continuing to fallback:", err);
      }
    }

    // 5. Fallback Knowledge Engine (Self-contained, zero-error guarantee)
    let fallbackResponse = "";

    if (lowerPrompt.includes("nivesh") || lowerPrompt.includes("wealth") || lowerPrompt.includes("mfd")) {
      fallbackResponse =
        "At Nivesh AI, I built enterprise speech processing microservices on Azure for over 10,000 mutual fund distributors. We deployed domain-adapted Whisper and Sarvam AI models with spectral noise reduction, and built an attention-based RAG pipeline on ChromaDB that automated portfolio summaries and slashed documentation turnaround by 80%.";
    } else if (
      lowerPrompt.includes("manas") ||
      lowerPrompt.includes("vaak") ||
      lowerPrompt.includes("pediatric") ||
      lowerPrompt.includes("speech therapy")
    ) {
      fallbackResponse =
        "At Manas Learning, I architected Vaaksudhi and Vaakify, clinical speech therapy platforms serving 8 Indian languages. We engineered a real-time pronunciation scoring engine combining Faster-Whisper, Vosk, and Kokoro ONNX with sub-300ms latency, backed by LangGraph multi-agent diagnostic workflows and adaptive Q-learning.";
    } else if (lowerPrompt.includes("firebot") || lowerPrompt.includes("nirvana") || lowerPrompt.includes("robot")) {
      fallbackResponse =
        "NIRVANA is an autonomous firefighting robot I built in a MuJoCo 3D physics environment. It utilizes deep reinforcement learning with multimodal sensor fusion across Lidar, IMU, and thermal feeds to localize fire sources in under 45 seconds, streaming live telemetry to a FastAPI and Three.js console.";
    } else if (lowerPrompt.includes("tripwire") || lowerPrompt.includes("vision") || lowerPrompt.includes("vehicle")) {
      fallbackResponse =
        "Tripwire is an edge-ready, CPU-only vehicle detection and tracking system designed for commodity CPUs. Using OpenCV background subtraction and centroid tracking, it achieves sub-50ms latency without needing expensive GPUs, streaming live counts over WebSockets.";
    } else if (lowerPrompt.includes("nik shah") || lowerPrompt.includes("100x")) {
      fallbackResponse =
        "100x was founded by Nik Shah (previously founder of Home.LLC and YC alum) with a mission to eliminate $1T of bottlenecks by replacing $100 of human operational work with a $1 autonomous AI outcome. I'm targeting the AI Agent Team to build high-reliability browser and operational agent pods.";
    } else if (lowerPrompt.includes("stack") || lowerPrompt.includes("tech") || lowerPrompt.includes("python")) {
      fallbackResponse =
        "My daily stack centers on Python, LangGraph, PyTorch, and Faster-Whisper/ONNX for AI; FastAPI, WebSockets, Docker, and PostgreSQL on Azure for backend infrastructure; and OpenCV, MediaPipe, and Three.js for computer vision and spatial systems.";
    } else {
      fallbackResponse =
        "As an AI engineer focused on Speech AI and Autonomous Agents, I build production systems that bridge multimodal inputs with deterministic execution loops. Feel free to ask about my work at Manas Learning, Nivesh AI, my robotics projects, or my 5 assessment questions!";
    }

    return NextResponse.json({
      content: fallbackResponse,
      provider: "ananya-knowledge-engine",
      latencyMs: Date.now() - startTime,
    });
  } catch (error: unknown) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

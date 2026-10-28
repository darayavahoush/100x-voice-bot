import { NextRequest, NextResponse } from "next/server";
import { ANANYA_SYSTEM_PROMPT, findMatchingAnswer } from "@/lib/persona";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userApiKey } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const latestUserMessage = [...messages].reverse().find((m: ChatMessage) => m.role === "user");
    const userPrompt = latestUserMessage ? latestUserMessage.content : "";

    // 1. Check deterministic benchmark cache for exact/near questions
    const benchmarkMatch = findMatchingAnswer(userPrompt);
    if (benchmarkMatch) {
      return NextResponse.json({
        content: benchmarkMatch.answer,
        provider: "benchmark-cache",
        matchedId: benchmarkMatch.id,
      });
    }

    // 2. Identify available API keys
    const groqKey = userApiKey || process.env.GROQ_API_KEY;
    const grokKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 3. Try Groq (ultra-low latency, <300ms)
    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: ANANYA_SYSTEM_PROMPT }, ...messages],
            temperature: 0.6,
            max_tokens: 350,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              content: reply.trim(),
              provider: "groq-llama-3.3-70b",
            });
          }
        }
      } catch (err) {
        console.error("Groq call failed, continuing to fallback:", err);
      }
    }

    // 4. Try xAI Grok
    if (grokKey) {
      try {
        const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${grokKey}`,
          },
          body: JSON.stringify({
            model: "grok-beta",
            messages: [{ role: "system", content: ANANYA_SYSTEM_PROMPT }, ...messages],
            temperature: 0.6,
            max_tokens: 350,
          }),
        });

        if (grokRes.ok) {
          const data = await grokRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              content: reply.trim(),
              provider: "xai-grok",
            });
          }
        }
      } catch (err) {
        console.error("xAI Grok call failed, continuing to fallback:", err);
      }
    }

    // 5. Try Google Gemini
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${ANANYA_SYSTEM_PROMPT}\n\nUser Question:\n${userPrompt}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 350,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              content: reply.trim(),
              provider: "gemini-1.5-flash",
            });
          }
        }
      } catch (err) {
        console.error("Gemini call failed, continuing to fallback:", err);
      }
    }

    // 6. Try OpenAI
    if (openaiKey) {
      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: ANANYA_SYSTEM_PROMPT }, ...messages],
            temperature: 0.6,
            max_tokens: 350,
          }),
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              content: reply.trim(),
              provider: "openai-gpt-4o-mini",
            });
          }
        }
      } catch (err) {
        console.error("OpenAI call failed, continuing to fallback:", err);
      }
    }

    // 7. Fallback Knowledge Engine (Self-contained, zero-error guarantee)
    const normalizedPrompt = userPrompt.toLowerCase();
    let fallbackResponse = "";

    if (normalizedPrompt.includes("nivesh") || normalizedPrompt.includes("wealth") || normalizedPrompt.includes("mfd")) {
      fallbackResponse =
        "At Nivesh AI, I built enterprise speech processing microservices on Azure for over 10,000 mutual fund distributors. We deployed domain-adapted Whisper and Sarvam AI models with spectral noise reduction, and built an attention-based RAG pipeline on ChromaDB that automated portfolio summaries and slashed documentation turnaround by 80%.";
    } else if (
      normalizedPrompt.includes("manas") ||
      normalizedPrompt.includes("vaak") ||
      normalizedPrompt.includes("pediatric") ||
      normalizedPrompt.includes("speech therapy")
    ) {
      fallbackResponse =
        "At Manas Learning, I architected Vaaksudhi and Vaakify, clinical speech therapy platforms serving 8 Indian languages. We engineered a real-time pronunciation scoring engine combining Faster-Whisper, Vosk, and Kokoro ONNX with sub-300ms latency, backed by LangGraph multi-agent diagnostic workflows and adaptive Q-learning.";
    } else if (normalizedPrompt.includes("firebot") || normalizedPrompt.includes("nirvana") || normalizedPrompt.includes("robot")) {
      fallbackResponse =
        "NIRVANA is an autonomous firefighting robot I built in a MuJoCo 3D physics environment. It utilizes deep reinforcement learning with multimodal sensor fusion across Lidar, IMU, and thermal feeds to localize fire sources in under 45 seconds, streaming live telemetry to a FastAPI and Three.js console.";
    } else if (normalizedPrompt.includes("tripwire") || normalizedPrompt.includes("vision") || normalizedPrompt.includes("vehicle")) {
      fallbackResponse =
        "Tripwire is an edge-optimized vehicle detection and tracking system designed for commodity CPUs. Using OpenCV background subtraction and centroid tracking, it achieves sub-50ms latency without needing expensive GPUs, streaming live counts over WebSockets.";
    } else if (normalizedPrompt.includes("experience") || normalizedPrompt.includes("work") || normalizedPrompt.includes("resume")) {
      fallbackResponse =
        "I'm an AI engineer with hands-on production experience across Speech AI, Generative AI, and Autonomous Agents. I've deployed clinical speech engines at Manas Learning, enterprise RAG microservices at Nivesh AI for 10,000+ advisors, and built autonomous robotic simulators with reinforcement learning.";
    } else if (normalizedPrompt.includes("stack") || normalizedPrompt.includes("tech") || normalizedPrompt.includes("python")) {
      fallbackResponse =
        "My daily stack centers on Python, LangGraph, PyTorch, and Faster-Whisper/ONNX for AI; FastAPI, WebSockets, Docker, and PostgreSQL on Azure for backend infrastructure; and OpenCV, MediaPipe, and Three.js for computer vision and spatial systems.";
    } else if (normalizedPrompt.includes("contact") || normalizedPrompt.includes("reach") || normalizedPrompt.includes("email")) {
      fallbackResponse =
        "You can reach me directly at ananyasridhar108@gmail.com or via LinkedIn at linkedin.com/in/ananya-sridhar-ai. My portfolio and GitHub are both active at github.com/darayavahoush.";
    } else {
      fallbackResponse =
        "As an AI engineer focused on Speech AI and Autonomous Agents, I build production systems that bridge multimodal inputs with deterministic execution loops. Feel free to ask about my work at Manas Learning, Nivesh AI, my robotics projects, or my 5 assessment questions!";
    }

    return NextResponse.json({
      content: fallbackResponse,
      provider: "ananya-knowledge-engine",
    });
  } catch (error: unknown) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

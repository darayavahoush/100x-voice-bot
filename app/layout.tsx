import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ananya Sridhar — 100x AI Agent Team Voice Bot",
  description:
    "Interactive Voice Bot created for 100x AI Agent Team Stage 1 Assessment. Real-time Speech-to-Text, Voice Synthesis, and Persona Grounding.",
  openGraph: {
    title: "Ananya Sridhar — 100x AI Agent Team Voice Bot",
    description:
      "Interactive voice agent responding to 100x assessment questions. Grounded in Speech AI, LangGraph multi-agent workflows, and production systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}

export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  audioDuration?: number;
  matchedId?: string;
  provider?: string;
}

export type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "error";

export interface VoiceBotSettings {
  voiceEnabled: boolean;
  speechRate: number;
  selectedVoiceName: string;
  autoSendVoice: boolean;
  hapticFeedback: boolean;
}

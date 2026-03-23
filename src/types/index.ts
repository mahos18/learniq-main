import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id:           string;
      name:         string;
      email:        string;
      image?:       string;
      role:         "student" | "instructor";
      rewardPoints: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

// ─── API response types ───────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?:   T;
  error?:  string;
}

// ─── Radar chart data ─────────────────────────────────────
export interface RadarPoint {
  topic:  string;
  score:  number;
  total:  number;
}

// ─── Study plan ───────────────────────────────────────────
export interface StudyDay {
  day:        number;
  topic:      string;
  activities: string[];
  goal:       string;
}

// ─── Content block (client-safe — no correctIndex) ────────
export interface ContentBlockClient {
  _id:       string;
  type:      string;
  order:     number;
  title?:    string;
  url?:      string;
  content?:  string;
  questions: {
    _id:        string;
    question:   string;
    options:    string[];
    topic:      string;
    bonusPoints:number;
    // correctIndex intentionally omitted
  }[];
}

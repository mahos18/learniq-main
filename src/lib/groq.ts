import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface RadarDataPoint {
  topic: string;
  score: number; // 0–100
}

export interface StudyPlanDay {
  day: number;
  topic: string;
  activities: string[];
  goal: string;
}

export async function generateStudyPlan(
  radarData: RadarDataPoint[],
  studentName: string
): Promise<StudyPlanDay[]> {
  const sorted = [...radarData].sort((a, b) => a.score - b.score);
  const weakTopics = sorted.slice(0, 3).map((d) => `${d.topic} (${d.score}%)`).join(", ");
  const allScores = radarData.map((d) => `${d.topic}: ${d.score}%`).join(", ");

  const prompt = `You are an expert learning coach. Student name: ${studentName}.
Their topic performance scores: ${allScores}.
Their weakest topics are: ${weakTopics}.

Create a focused 7-day personalized study plan that addresses their weak areas.
For each day specify: the topic to focus on, 2-3 specific learning activities, and a mini-goal.
Keep it encouraging and actionable.

Respond ONLY with a valid JSON array — no markdown, no explanation, just the array:
[{ "day": 1, "topic": "string", "activities": ["string", "string"], "goal": "string" }]`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.7,
  });

  const raw = response.choices[0]?.message?.content || "[]";
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as StudyPlanDay[];
}

export default groq;

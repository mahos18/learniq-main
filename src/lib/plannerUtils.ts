export const POPULAR_TOPICS = [
  "React from scratch",
  "Python for beginners",
  "JavaScript fundamentals",
  "DSA for interviews",
  "Machine Learning basics",
  "Node.js backend",
  "Docker & Kubernetes",
  "SQL & databases",
  "TypeScript",
  "Git & GitHub",
];

export const DURATIONS = [
  { id: "7d", label: "7 Days", weeks: 1, icon: "⚡" },
  { id: "1m", label: "1 Month", weeks: 4, icon: "🗓" },
  { id: "3m", label: "3 Months", weeks: 12, icon: "🚀" },
  { id: "6m", label: "6 Months", weeks: 26, icon: "🌱" },
];

export const LEVELS = [
  { id: "beginner", icon: "🌱", label: "Beginner", sub: "Zero knowledge" },
  { id: "intermediate", icon: "⚡", label: "Intermediate", sub: "Know the basics" },
  { id: "advanced", icon: "🔥", label: "Advanced", sub: "Fill gaps & deepen" },
];

export const PACES = [
  { id: "slow", icon: "🐢", label: "Casual", hours: 0.5, sub: "30m/day" },
  { id: "regular", icon: "🚶", label: "Regular", hours: 1, sub: "1hr/day" },
  { id: "fast", icon: "🏃", label: "Fast", hours: 2, sub: "2hr/day" },
];

export const RESOURCE_LINKS: Record<string, { label: string; url: string }[]> = {
  // ... copy from your App.jsx
};

export function getLinks(topic: string) {
  const tl = topic.toLowerCase();
  for (const [key, links] of Object.entries(RESOURCE_LINKS)) {
    if (tl.includes(key)) return links;
  }
  const encoded = encodeURIComponent(topic);
  return [
    { label: `YouTube: ${topic}`, url: `https://www.youtube.com/results?search_query=${encoded}+tutorial` },
    { label: `freeCodeCamp: ${topic}`, url: `https://www.freecodecamp.org/news/search/?query=${encoded}` },
    { label: `MDN: ${topic}`, url: `https://developer.mozilla.org/en-US/search?q=${encoded}` },
  ];
}
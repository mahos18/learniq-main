import { RESOURCE_LINKS, CURRICULA, DURATIONS, PACES, LEVELS, PHASE_COLORS } from "../constants";

export function getLinks(topic: string): { label: string; url: string }[] {
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

export function detectCurriculum(topic: string): string | null {
  const t = topic.toLowerCase();
  if (t.includes("javascript") || t.includes("js ") || t === "js") return "javascript";
  if (t.includes("react")) return "react";
  if (t.includes("python") && !t.includes("data") && !t.includes("ml") && !t.includes("machine")) return "python";
  if (t.includes("dsa") || t.includes("data structure") || t.includes("algorithm") || t.includes("leetcode")) return "dsa";
  if (t.includes("machine learning") || t.includes(" ml ") || t.includes("deep learning") || t.includes("neural")) return "machine learning";
  if (t.includes("node") || t.includes("express") || t.includes("backend")) return "node.js";
  if (t.includes("docker") || t.includes("container") || t.includes("kubernetes") || t.includes("k8s")) return "docker";
  return null;
}

export async function askGroq(prompt: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey || apiKey === "gsk_your_key_here") return null;
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 4500,
        temperature: 0.55,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export function makePrompt({ topic, level, duration, pace }: any): string {
  const dur = DURATIONS.find(d => d.id === duration);
  const pc = PACES.find(p => p.id === pace);
  const lv = LEVELS.find(l => l.id === level);
  const isDaily = duration === "7d";
  const count = isDaily ? 7 : dur?.w || 4;
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const slotLabels = Array.from({ length: count }, (_, i) =>
    isDaily ? `Day ${i + 1} — ${dayNames[i % 7]}` : `Week ${i + 1}`
  );

  return `You are an expert curriculum designer with deep knowledge of learning resources. Build a COMPLETE study roadmap with REAL resources.

Topic: "${topic}"
Level: ${lv?.l} — ${lv?.sub}
Total slots: ${count} ${isDaily ? "days" : "weeks"}
Daily study time: ${pc?.h}h/day

IMPORTANT: For EACH topic, you MUST include:
1. A GeeksforGeeks article link (real URL from geeksforgeeks.org)
2. A YouTube video tutorial link (real URL from youtube.com)
3. Official documentation or tutorial link where applicable

SLOT ASSIGNMENTS (each slot must have UNIQUE content):
${slotLabels.map((label, i) => `${label}: ${i + 1}/${count}`).join("\n")}

RULES:
1. Generate EXACTLY ${count} items total
2. EVERY item must have a DIFFERENT topic
3. Activities must be CONCRETE and specific
4. Resources MUST be REAL working URLs:
   - GeeksforGeeks: https://www.geeksforgeeks.org/{topic-name}/
   - YouTube: https://www.youtube.com/results?search_query={topic}+tutorial OR direct video link
5. Group items into 3-5 logical phases
6. Return ONLY valid JSON

Return this exact JSON structure:
{
  "title": "Specific roadmap title",
  "overview": "2 sentences describing what will be built and achieved",
  "level": "${level}",
  "totalItems": ${count},
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "items": [
        {
          "n": 1,
          "dayOrWeek": "${slotLabels[0]}",
          "topic": "Unique topic",
          "emoji": "📦",
          "activities": ["Concrete activity 1", "Concrete activity 2", "Concrete activity 3"],
          "goal": "Measurable skill outcome",
          "resources": [
            {"label": "GeeksforGeeks: Topic Name", "url": "https://www.geeksforgeeks.org/actual-topic-url/", "type": "article"},
            {"label": "YouTube Tutorial", "url": "https://www.youtube.com/watch?v=actual-video-id", "type": "video"},
            {"label": "Official Documentation", "url": "https://official-docs-url.com", "type": "article"}
          ],
          "hours": ${isDaily ? pc?.h : Math.round((pc?.h || 1) * 5)},
          "intensity": "moderate"
        }
      ]
    }
  ]
}`;
}

export function makeFallback({ topic, level, duration, pace }: any): any {
  const dur = DURATIONS.find(d => d.id === duration);
  const pc = PACES.find(p => p.id === pace);
  const lv = LEVELS.find(l => l.id === level);
  const isDaily = duration === "7d";
  const count = isDaily ? 7 : dur?.w || 4;
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const currKey = detectCurriculum(topic);
  const curric = currKey ? CURRICULA[currKey] : null;

  function buildItem(n: number, totalSlots: number, flatTopics: any[], phaseIntensity: string) {
    const dayOrWeek = isDaily
      ? `Day ${n} — ${dayNames[(n - 1) % 7]}`
      : `Week ${n}`;

    if (flatTopics.length === 0) {
      return {
        n,
        dayOrWeek,
        topic: topic,
        emoji: "📖",
        activities: [`Study ${topic} concepts`, `Practice exercises`, `Build a project`],
        goal: `Make progress in ${topic}`,
        resources: getLinks(topic),
        hours: isDaily ? pc?.h : Math.round((pc?.h || 1) * 5),
        intensity: phaseIntensity,
      };
    }

    const slotsPerTopic = totalSlots / flatTopics.length;

    if (slotsPerTopic <= 1) {
      const idx = Math.min(n - 1, flatTopics.length - 1);
      const ct = flatTopics[idx];
      return {
        n,
        dayOrWeek,
        topic: ct.t,
        emoji: ct.e,
        activities: ct.a,
        goal: ct.g,
        resources: ct.r,
        hours: isDaily ? pc?.h : Math.round((pc?.h || 1) * 5),
        intensity: phaseIntensity,
      };
    }

    const topicIdx = Math.min(Math.floor((n - 1) / slotsPerTopic), flatTopics.length - 1);
    const ct = flatTopics[topicIdx];
    const layerInTopic = (n - 1) - Math.round(topicIdx * slotsPerTopic);
    const layers = [
      {
        suffix: "— Introduction",
        actFn: (t: string) => [
          `Read the official docs / best tutorial for ${t} — take notes on key concepts`,
          `Watch a beginner-friendly video walkthrough of ${t} (aim for <1 hr)`,
          `Set up a sandbox and run the first 3 code examples from the tutorial`,
        ],
        goalFn: (t: string) => `You understand what ${t} is, why it exists, and can run basic examples`,
      },
      {
        suffix: "— Core Practice",
        actFn: (t: string) => [
          `Complete the exercises in the official tutorial for ${t}`,
          `Build a minimal working example from scratch without looking at notes`,
          `Find and fix at least 2 bugs in your implementation`,
        ],
        goalFn: (t: string) => `You can implement ${t} from scratch with minimal reference`,
      },
      {
        suffix: "— Deep Dive",
        actFn: (t: string) => [
          `Study edge cases, common mistakes, and best practices for ${t}`,
          `Build a slightly more complex project that combines ${t} with previously learned concepts`,
          `Read one expert article or watch one advanced talk on ${t}`,
        ],
        goalFn: (t: string) => `You understand ${t} deeply and can use it in real projects confidently`,
      },
      {
        suffix: "— Applied Project",
        actFn: (t: string) => [
          `Plan a mini-project that requires ${t} as a core part of the solution`,
          `Build and complete the project, writing clean and commented code`,
          `Review your solution against best practices — refactor at least one part`,
        ],
        goalFn: (t: string) => `You have a working project in your portfolio that demonstrates ${t}`,
      },
      {
        suffix: "— Review & Reinforce",
        actFn: (t: string) => [
          `Explain ${t} in your own words (rubber-duck debug / write a summary)`,
          `Solve 3 practice problems or exercises that involve ${t}`,
          `Help someone else or write a short blog post / notes on ${t}`,
        ],
        goalFn: (t: string) => `You can confidently teach ${t} to someone else — indicating true mastery`,
      },
    ];

    const layer = layers[layerInTopic % layers.length];

    return {
      n,
      dayOrWeek,
      topic: `${ct.t} ${layer.suffix}`,
      emoji: ct.e,
      activities: layer.actFn(ct.t),
      goal: layer.goalFn(ct.t),
      resources: ct.r,
      hours: isDaily ? pc?.h : Math.round((pc?.h || 1) * 5),
      intensity: phaseIntensity,
    };
  }

  if (curric) {
    const allTopics = curric.phases.flatMap((ph: any) => ph.topics.map((t: any) => ({ ...t })));
    const phases: any[] = [];
    let itemCursor = 1;

    curric.phases.forEach((ph: any, pi: number) => {
      const intensity = pi === 0 ? "gentle" : pi === curric.phases.length - 1 ? "intense" : "moderate";
      const phTopicCount = ph.topics.length;
      const totalTopics = allTopics.length;
      const rawSlots = (phTopicCount / totalTopics) * count;
      const phSlots = pi === curric.phases.length - 1 ? count - itemCursor + 1 : Math.max(1, Math.round(rawSlots));

      const phItems = [];
      const phAllTopics = ph.topics.map((t: any) => ({ ...t }));

      for (let s = 0; s < phSlots; s++) {
        if (itemCursor > count) break;
        phItems.push(buildItem(itemCursor, phSlots, phAllTopics, intensity));
        itemCursor++;
      }

      if (phItems.length > 0) {
        phases.push({ phase: pi + 1, title: ph.title, items: phItems });
      }
    });

    return {
      title: `${dur?.l} ${topic.charAt(0).toUpperCase() + topic.slice(1)} Roadmap`,
      overview: `A structured ${dur?.l} ${lv?.l.toLowerCase()} roadmap covering every ${topic} concept from foundations to advanced. Each session builds on the last with hands-on projects.`,
      level,
      totalItems: count,
      phases,
    };
  }

  // Generic fallback
  const genericPhases = [
    {
      title: `${topic} Foundations`,
      topics: [
        {
          t: `Introduction & Setup`,
          e: "📖",
          a: [`Research and read the best beginner guide for ${topic}`, `Install tools, configure your environment, run a "Hello World"`, `Watch an overview video to understand the big picture`],
          g: `You understand the purpose of ${topic} and have a working environment`,
          r: getLinks(topic),
        },
        {
          t: `Core Concepts Part 1`,
          e: "🧩",
          a: [`Study the first 3 fundamental concepts in ${topic} with written notes`, `Code along with the official tutorial or top-rated course`, `Quiz yourself on the concepts without looking at notes`],
          g: `You can explain the first core concepts of ${topic} from memory`,
          r: getLinks(topic),
        },
        {
          t: `First Hands-On Project`,
          e: "⌨️",
          a: [`Plan a small project using everything learned so far`, `Build it from scratch without tutorials — look up only when stuck`, `Share or document the project with a README`],
          g: `You have a working foundation-level ${topic} project in your portfolio`,
          r: getLinks(topic),
        },
      ],
    },
    {
      title: `Intermediate ${topic}`,
      topics: [
        {
          t: `Intermediate Concepts`,
          e: "🔧",
          a: [`Study the most important intermediate concepts in ${topic}`, `Find a real project or codebase that uses these patterns — read the code`, `Re-implement one pattern from scratch`],
          g: `You understand intermediate ${topic} patterns and can apply them`,
          r: getLinks(topic),
        },
        {
          t: `Best Practices & Patterns`,
          e: "✨",
          a: [`Read the style guide or best-practices documentation for ${topic}`, `Refactor your previous project to follow best practices`, `Identify and document 5 common mistakes beginners make in ${topic}`],
          g: `You write clean, idiomatic ${topic} code following community standards`,
          r: getLinks(topic),
        },
      ],
    },
    {
      title: `Advanced ${topic}`,
      topics: [
        {
          t: `Capstone Project`,
          e: "🏆",
          a: [`Plan a portfolio-ready capstone project showcasing all ${topic} skills`, `Build, test, and deploy the complete project`, `Write a detailed README and share it publicly`],
          g: `You have a production-quality capstone project demonstrating mastery of ${topic}`,
          r: getLinks(topic),
        },
      ],
    },
  ];

  const allGenericTopics = genericPhases.flatMap(ph => ph.topics.map(t => ({ ...t })));
  const phases: any[] = [];
  let itemCursor = 1;

  genericPhases.forEach((ph, pi) => {
    const intensity = pi === 0 ? "gentle" : pi === genericPhases.length - 1 ? "intense" : "moderate";
    const phTopics = ph.topics;
    const rawSlots = (phTopics.length / allGenericTopics.length) * count;
    const phSlots = pi === genericPhases.length - 1 ? count - itemCursor + 1 : Math.max(1, Math.round(rawSlots));

    const phItems = [];
    for (let s = 0; s < phSlots; s++) {
      if (itemCursor > count) break;
      phItems.push(buildItem(itemCursor, phSlots, phTopics, intensity));
      itemCursor++;
    }
    if (phItems.length > 0) {
      phases.push({ phase: pi + 1, title: ph.title, items: phItems });
    }
  });

  return {
    title: `${dur?.l} ${topic} Roadmap`,
    overview: `A complete ${dur?.l} ${lv?.l.toLowerCase()} roadmap for ${topic}. Covers foundations through advanced with unique content every single week — no repetition.`,
    level,
    totalItems: count,
    phases,
  };
}

export const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";

export async function getYouTubeVideoUrl(query: string): Promise<string | null> {
  try {
    // For demo purposes, return a direct YouTube search URL
    // In production, use YouTube API to get the best video
    const searchQuery = encodeURIComponent(`${query} tutorial 2024`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return null;
  }
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getGeeksForGeeksLink(topic: string): string {
  const formattedTopic = topic.toLowerCase().replace(/\s+/g, "-");
  return `https://www.geeksforgeeks.org/${formattedTopic}/`;
}

export function getTutorialsPointLink(topic: string): string {
  const formattedTopic = topic.toLowerCase().replace(/\s+/g, "_");
  return `https://www.tutorialspoint.com/${formattedTopic}/index.htm`;
}

export function getW3SchoolsLink(topic: string): string {
  const formattedTopic = topic.toLowerCase().replace(/\s+/g, "");
  return `https://www.w3schools.com/${formattedTopic}/`;
}

// Enhanced resource links with more categories
export const ENHANCED_RESOURCE_LINKS: Record<string, { label: string; url: string; type: "article" | "video" | "course" }[]> = {
  // Web Development
  javascript: [
    { label: "JavaScript Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/javascript/", type: "article" },
    { label: "JavaScript Full Course (12 hours) - YouTube", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", type: "video" },
    { label: "JavaScript.info - Comprehensive Guide", url: "https://javascript.info", type: "article" },
  ],
  react: [
    { label: "React Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/react-tutorial/", type: "article" },
    { label: "React Complete Course (15 hours) - YouTube", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", type: "video" },
    { label: "W3Schools React", url: "https://www.w3schools.com/react/", type: "article" },
  ],
  python: [
    { label: "Python Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/python-programming-language-tutorial/", type: "article" },
    { label: "Python Full Course (12 hours) - YouTube", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", type: "video" },
    { label: "W3Schools Python", url: "https://www.w3schools.com/python/", type: "article" },
  ],
  "machine learning": [
    { label: "Machine Learning - GeeksforGeeks", url: "https://www.geeksforgeeks.org/machine-learning/", type: "article" },
    { label: "ML Crash Course (10 hours) - YouTube", url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", type: "video" },
    { label: "TutorialsPoint ML", url: "https://www.tutorialspoint.com/machine_learning/index.htm", type: "article" },
  ],
  docker: [
    { label: "Docker Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/docker-tutorial/", type: "article" },
    { label: "Docker Full Course (6 hours) - YouTube", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", type: "video" },
    { label: "Docker Documentation", url: "https://docs.docker.com/get-started/", type: "article" },
  ],
  sql: [
    { label: "SQL Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/sql-tutorial/", type: "article" },
    { label: "SQL Full Course (4 hours) - YouTube", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", type: "video" },
    { label: "W3Schools SQL", url: "https://www.w3schools.com/sql/", type: "article" },
  ],
  // Add more topics as needed
};

export function getEnhancedLinks(topic: string): { label: string; url: string; type: string }[] {
  const tl = topic.toLowerCase();
  for (const [key, links] of Object.entries(ENHANCED_RESOURCE_LINKS)) {
    if (tl.includes(key)) return links;
  }
  
  // Generic fallback with GeeksforGeeks and YouTube
  const formattedTopic = tl.replace(/\s+/g, "-");
  return [
    { label: `${topic} - GeeksforGeeks`, url: `https://www.geeksforgeeks.org/${formattedTopic}/`, type: "article" },
    { label: `${topic} Tutorial - YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " tutorial")}`, type: "video" },
    { label: `${topic} - TutorialsPoint`, url: `https://www.tutorialspoint.com/${formattedTopic.replace(/-/g, "_")}/index.htm`, type: "article" },
  ];
}
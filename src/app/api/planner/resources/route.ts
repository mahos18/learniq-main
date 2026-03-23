import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Parse the request body properly
    const body = await req.json();
    const { topic, existingResources } = body;
    
    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }
    
    const prompt = `You are a resource curator. Find the BEST learning resources for "${topic}".

Return ONLY valid JSON with EXACTLY this structure:
{
  "resources": [
    {
      "label": "Descriptive title",
      "url": "https://actual-working-url.com",
      "type": "article|video|documentation",
      "description": "Brief description of what this resource covers"
    }
  ]
}

Requirements:
1. Include at least ONE GeeksforGeeks article (URL must be from geeksforgeeks.org)
2. Include at least ONE YouTube video (URL must be from youtube.com)
3. Include official documentation if available
4. All URLs MUST be real and accessible
5. Total 3-5 resources

Topic: ${topic}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    let resources = [];
    
    if (content) {
      try {
        const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
        resources = parsed.resources;
      } catch {
        console.error("Failed to parse Groq response:", content);
        resources = generateFallbackResources(topic);
      }
    } else {
      resources = generateFallbackResources(topic);
    }

    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    
    // Try to get topic from the request body if it exists
    let topic = "programming";
    try {
      const body = await req.json();
      topic = body.topic || "programming";
    } catch {
      // If we can't parse the body, use default
      topic = "programming";
    }
    
    const fallbackResources = generateFallbackResources(topic);
    return NextResponse.json({ resources: fallbackResources });
  }
}

function generateFallbackResources(topic: string) {
  const formattedTopic = topic.toLowerCase().replace(/\s+/g, "-");
  const searchQuery = encodeURIComponent(topic);
  
  return [
    {
      label: `GeeksforGeeks: ${topic} Tutorial`,
      url: `https://www.geeksforgeeks.org/${formattedTopic}/`,
      type: "article",
      description: `Comprehensive tutorial covering ${topic} with examples`
    },
    {
      label: `YouTube: ${topic} Full Course`,
      url: `https://www.youtube.com/results?search_query=${searchQuery}+tutorial+2024`,
      type: "video",
      description: `Video tutorials for ${topic}`
    },
    {
      label: `${topic} Official Documentation`,
      url: `https://www.google.com/search?q=${searchQuery}+official+documentation`,
      type: "documentation",
      description: `Official documentation and guides for ${topic}`
    }
  ];
}
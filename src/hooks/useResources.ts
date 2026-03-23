import { useState, useEffect } from "react";

interface Resource {
  label: string;
  url: string;
  type: "article" | "video" | "documentation";
  description?: string;
}

export function useResources(topic: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topic) return;
    
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/api/planner/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        });
        
        if (!response.ok) throw new Error("Failed to fetch resources");
        
        const data = await response.json();
        setResources(data.resources);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch resources");
        // Set fallback resources
        setResources(generateFallbackResources(topic));
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [topic]);
  
  return { resources, loading, error };
}

function generateFallbackResources(topic: string): Resource[] {
  const formattedTopic = topic.toLowerCase().replace(/\s+/g, "-");
  const searchQuery = encodeURIComponent(topic);
  
  return [
    {
      label: `GeeksforGeeks: ${topic}`,
      url: `https://www.geeksforgeeks.org/${formattedTopic}/`,
      type: "article",
      description: `Comprehensive ${topic} tutorial with examples`
    },
    {
      label: `${topic} Tutorial - YouTube`,
      url: `https://www.youtube.com/results?search_query=${searchQuery}+tutorial`,
      type: "video",
      description: `Video tutorials for ${topic}`
    },
    {
      label: `${topic} - W3Schools`,
      url: `https://www.w3schools.com/${formattedTopic}/`,
      type: "article",
      description: `Beginner-friendly ${topic} tutorials`
    }
  ];
}
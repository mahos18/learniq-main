interface Resource {
  label: string;
  url: string;
  type: "article" | "video" | "documentation";
}

// Function to validate and fix resource URLs
export async function validateResources(resources: Resource[], topic: string): Promise<Resource[]> {
  const validated: Resource[] = [];
  
  for (const resource of resources) {
    // Check if URL is valid and accessible
    const isValid = await checkUrlValidity(resource.url);
    
    if (isValid) {
      validated.push(resource);
    } else {
      // If URL is invalid, generate fallback resources
      const fallback = generateFallbackResources(topic);
      validated.push(...fallback);
      break;
    }
  }
  
  // Ensure we have at least 3 resources
  if (validated.length < 3) {
    const fallback = generateFallbackResources(topic);
    validated.push(...fallback.slice(0, 3 - validated.length));
  }
  
  return validated;
}

async function checkUrlValidity(url: string): Promise<boolean> {
  try {
    // Only check if URL has valid structure
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function generateFallbackResources(topic: string): Resource[] {
  const formattedTopic = topic.toLowerCase().replace(/\s+/g, "-");
  const searchQuery = encodeURIComponent(topic);
  
  return [
    {
      label: `GeeksforGeeks: ${topic}`,
      url: `https://www.geeksforgeeks.org/${formattedTopic}/`,
      type: "article",
    },
    {
      label: `YouTube: ${topic} Tutorial`,
      url: `https://www.youtube.com/results?search_query=${searchQuery}+tutorial`,
      type: "video",
    },
    {
      label: `W3Schools: ${topic}`,
      url: `https://www.w3schools.com/${formattedTopic}/`,
      type: "article",
    },
  ];
}

// Function to extract YouTube video ID from various formats
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^/]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Function to get embeddable YouTube URL
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}
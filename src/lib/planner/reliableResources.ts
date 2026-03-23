// Curated list of reliable resources by topic
export const CURATED_RESOURCES: Record<string, {
  articles: { label: string; url: string }[];
  videos: { label: string; url: string }[];
  docs: { label: string; url: string }[];
}> = {
  // Web Development
  javascript: {
    articles: [
      { label: "JavaScript - GeeksforGeeks", url: "https://www.geeksforgeeks.org/javascript/" },
      { label: "JavaScript.info - Modern JavaScript Tutorial", url: "https://javascript.info/" },
      { label: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    ],
    videos: [
      { label: "JavaScript Tutorial for Beginners", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
      { label: "JavaScript Full Course (12 hours)", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
    ],
    docs: [
      { label: "MDN Web Docs - JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { label: "ECMAScript Specification", url: "https://tc39.es/ecma262/" },
    ],
  },
  react: {
    articles: [
      { label: "React Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/react-tutorial/" },
      { label: "React Official Docs", url: "https://react.dev/learn" },
      { label: "W3Schools React", url: "https://www.w3schools.com/react/" },
    ],
    videos: [
      { label: "React Complete Course (15 hours)", url: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
      { label: "React Hooks Tutorial", url: "https://www.youtube.com/watch?v=TNhaISOUy6Q" },
    ],
    docs: [
      { label: "React Documentation", url: "https://react.dev/" },
      { label: "React API Reference", url: "https://react.dev/reference/react" },
    ],
  },
  python: {
    articles: [
      { label: "Python Programming Language - GeeksforGeeks", url: "https://www.geeksforgeeks.org/python-programming-language-tutorial/" },
      { label: "Python.org Official Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "Real Python Tutorials", url: "https://realpython.com/" },
    ],
    videos: [
      { label: "Python Full Course (12 hours)", url: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
      { label: "Python for Beginners", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc" },
    ],
    docs: [
      { label: "Python Documentation", url: "https://docs.python.org/3/" },
      { label: "Python Package Index (PyPI)", url: "https://pypi.org/" },
    ],
  },
  "machine learning": {
    articles: [
      { label: "Machine Learning - GeeksforGeeks", url: "https://www.geeksforgeeks.org/machine-learning/" },
      { label: "Scikit-learn Documentation", url: "https://scikit-learn.org/stable/tutorial/index.html" },
      { label: "Kaggle Learn - ML", url: "https://www.kaggle.com/learn/machine-learning" },
    ],
    videos: [
      { label: "Machine Learning Crash Course", url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ" },
      { label: "Andrew Ng ML Course", url: "https://www.youtube.com/watch?v=PPLop4L2eGk" },
    ],
    docs: [
      { label: "Scikit-learn Docs", url: "https://scikit-learn.org/stable/" },
      { label: "TensorFlow Documentation", url: "https://www.tensorflow.org/tutorials" },
    ],
  },
  docker: {
    articles: [
      { label: "Docker Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/docker-tutorial/" },
      { label: "Docker Official Get Started", url: "https://docs.docker.com/get-started/" },
      { label: "Docker Curriculum", url: "https://docker-curriculum.com/" },
    ],
    videos: [
      { label: "Docker Full Course (6 hours)", url: "https://www.youtube.com/watch?v=3c-iBn73dDE" },
      { label: "Docker Tutorial for Beginners", url: "https://www.youtube.com/watch?v=fqKT9m8gqBY" },
    ],
    docs: [
      { label: "Docker Documentation", url: "https://docs.docker.com/" },
      { label: "Docker Hub", url: "https://hub.docker.com/" },
    ],
  },
  sql: {
    articles: [
      { label: "SQL Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/sql-tutorial/" },
      { label: "SQLZoo Interactive Tutorial", url: "https://sqlzoo.net/" },
      { label: "W3Schools SQL", url: "https://www.w3schools.com/sql/" },
    ],
    videos: [
      { label: "SQL Full Course (4 hours)", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
      { label: "SQL Tutorial for Beginners", url: "https://www.youtube.com/watch?v=7S_tz1z_5bA" },
    ],
    docs: [
      { label: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/" },
      { label: "MySQL Documentation", url: "https://dev.mysql.com/doc/" },
    ],
  },
  typescript: {
    articles: [
      { label: "TypeScript Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/typescript/" },
      { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/" },
      { label: "Total TypeScript", url: "https://www.totaltypescript.com/" },
    ],
    videos: [
      { label: "TypeScript Course (8 hours)", url: "https://www.youtube.com/watch?v=30LWjhZzg50" },
      { label: "TypeScript for Beginners", url: "https://www.youtube.com/watch?v=d56mG7DezGs" },
    ],
    docs: [
      { label: "TypeScript Documentation", url: "https://www.typescriptlang.org/docs/" },
      { label: "TypeScript Playground", url: "https://www.typescriptlang.org/play/" },
    ],
  },
  "node.js": {
    articles: [
      { label: "Node.js Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/node-js/" },
      { label: "Node.js Official Docs", url: "https://nodejs.org/en/docs/" },
      { label: "Express.js Guide", url: "https://expressjs.com/en/guide/routing.html" },
    ],
    videos: [
      { label: "Node.js Full Course (10 hours)", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
      { label: "Node.js Crash Course", url: "https://www.youtube.com/watch?v=f2EqECiTBL8" },
    ],
    docs: [
      { label: "Node.js Documentation", url: "https://nodejs.org/en/docs/" },
      { label: "npm Documentation", url: "https://docs.npmjs.com/" },
    ],
  },
  "data structures": {
    articles: [
      { label: "Data Structures - GeeksforGeeks", url: "https://www.geeksforgeeks.org/data-structures/" },
      { label: "Visualgo - Algorithm Visualization", url: "https://visualgo.net/en" },
      { label: "LeetCode Explore", url: "https://leetcode.com/explore/" },
    ],
    videos: [
      { label: "Data Structures Full Course", url: "https://www.youtube.com/watch?v=RBSGKlAvoiM" },
      { label: "Algorithms Course", url: "https://www.youtube.com/watch?v=0IAPZzGSbME" },
    ],
    docs: [
      { label: "MIT OpenCourseWare - Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" },
      { label: "Coursera DSA", url: "https://www.coursera.org/specializations/data-structures-algorithms" },
    ],
  },
};

// Generate reliable resources for any topic
export function getReliableResources(topic: string): {
  label: string;
  url: string;
  type: "article" | "video" | "documentation";
}[] {
  const tl = topic.toLowerCase();
  const resources: { label: string; url: string; type: "article" | "video" | "documentation" }[] = [];
  
  // Check if we have curated resources for this topic
  for (const [key, curated] of Object.entries(CURATED_RESOURCES)) {
    if (tl.includes(key) || key.includes(tl)) {
      // Add articles
      curated.articles.slice(0, 2).forEach(a => {
        resources.push({ ...a, type: "article" });
      });
      // Add videos
      curated.videos.slice(0, 1).forEach(v => {
        resources.push({ ...v, type: "video" });
      });
      // Add docs
      curated.docs.slice(0, 1).forEach(d => {
        resources.push({ ...d, type: "documentation" });
      });
      break;
    }
  }
  
  // Always add GeeksforGeeks search as fallback
  const searchQuery = encodeURIComponent(topic);
  resources.push({
    label: `GeeksforGeeks: ${topic}`,
    url: `https://www.geeksforgeeks.org/search/?q=${searchQuery}`,
    type: "article",
  });
  
  // Always add YouTube search as fallback
  resources.push({
    label: `YouTube: ${topic} Tutorials`,
    url: `https://www.youtube.com/results?search_query=${searchQuery}+tutorial`,
    type: "video",
  });
  
  // Add general learning platforms
  resources.push({
    label: `freeCodeCamp: ${topic}`,
    url: `https://www.freecodecamp.org/news/search/?query=${searchQuery}`,
    type: "article",
  });
  
  // Remove duplicates based on URL
  const uniqueResources = resources.filter((r, i, self) => 
    i === self.findIndex((t) => t.url === r.url)
  );
  
  return uniqueResources.slice(0, 5); // Return top 5 resources
}

// Get YouTube search URL (always works)
export function getYouTubeSearchUrl(topic: string): string {
  const searchQuery = encodeURIComponent(`${topic} tutorial 2024`);
  return `https://www.youtube.com/results?search_query=${searchQuery}`;
}

// Get GeeksforGeeks search URL (always works)
export function getGeeksForGeeksSearchUrl(topic: string): string {
  const searchQuery = encodeURIComponent(topic);
  return `https://www.geeksforgeeks.org/search/?q=${searchQuery}`;
}

// Get MDN search URL
export function getMDNSearchUrl(topic: string): string {
  const searchQuery = encodeURIComponent(topic);
  return `https://developer.mozilla.org/en-US/search?q=${searchQuery}`;
}
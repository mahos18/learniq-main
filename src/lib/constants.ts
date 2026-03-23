// lib/planner/constants.ts


export const GROQ_KEY = process.env.GROQ_API_KEY || "";

export const RESOURCE_LINKS: Record<string, { label: string; url: string }[]> = {
  // Web Dev
  html: [
    { label: "MDN HTML Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
    { label: "freeCodeCamp HTML", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
    { label: "W3Schools HTML", url: "https://www.w3schools.com/html/" },
  ],
  css: [
    { label: "MDN CSS Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS" },
    { label: "CSS Tricks", url: "https://css-tricks.com" },
    { label: "freeCodeCamp CSS", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
  ],
  javascript: [
    { label: "javascript.info", url: "https://javascript.info" },
    { label: "MDN JavaScript", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript" },
    { label: "freeCodeCamp JS", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  ],
  react: [
    { label: "React Official Docs", url: "https://react.dev" },
    { label: "Full Stack Open", url: "https://fullstackopen.com/en/" },
    { label: "Scrimba React", url: "https://scrimba.com/learn/learnreact" },
  ],
  node: [
    { label: "Node.js Docs", url: "https://nodejs.org/en/docs" },
    { label: "The Odin Project Node", url: "https://www.theodinproject.com/paths/full-stack-javascript" },
    { label: "NodeJS Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
  ],
  // DSA
  arrays: [
    { label: "NeetCode Arrays", url: "https://neetcode.io/roadmap" },
    { label: "LeetCode Array Problems", url: "https://leetcode.com/tag/array/" },
    { label: "Visualgo Arrays", url: "https://visualgo.net/en/array" },
  ],
  "linked list": [
    { label: "NeetCode Linked Lists", url: "https://neetcode.io/roadmap" },
    { label: "Visualgo Linked List", url: "https://visualgo.net/en/list" },
    { label: "CS50 Linked Lists", url: "https://cs50.harvard.edu/x/" },
  ],
  "dynamic programming": [
    { label: "NeetCode DP", url: "https://neetcode.io/roadmap" },
    { label: "DP on LeetCode", url: "https://leetcode.com/tag/dynamic-programming/" },
    { label: "MIT OCW DP", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" },
  ],
  graphs: [
    { label: "Visualgo Graphs", url: "https://visualgo.net/en/graphds" },
    { label: "NeetCode Graphs", url: "https://neetcode.io/roadmap" },
    { label: "Graph Theory YT", url: "https://www.youtube.com/watch?v=DgXR2OWQnLc" },
  ],
  // Data Science
  python: [
    { label: "Python.org Tutorial", url: "https://docs.python.org/3/tutorial/" },
    { label: "Kaggle Python", url: "https://www.kaggle.com/learn/python" },
    { label: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
  ],
  pandas: [
    { label: "Pandas Docs", url: "https://pandas.pydata.org/docs/user_guide/" },
    { label: "Kaggle Pandas", url: "https://www.kaggle.com/learn/pandas" },
    { label: "Pandas Tutorial YT", url: "https://www.youtube.com/watch?v=vmEHCJofslg" },
  ],
  "machine learning": [
    { label: "fast.ai", url: "https://www.fast.ai" },
    { label: "Andrew Ng ML Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
    { label: "Scikit-learn Docs", url: "https://scikit-learn.org/stable/tutorial/index.html" },
  ],
  // General
  git: [
    { label: "Git Official Book", url: "https://git-scm.com/book/en/v2" },
    { label: "GitHub Skills", url: "https://skills.github.com" },
    { label: "Atlassian Git Tutorial", url: "https://www.atlassian.com/git/tutorials" },
  ],
  docker: [
    { label: "Docker Official Docs", url: "https://docs.docker.com/get-started/" },
    { label: "Docker Tutorial YT", url: "https://www.youtube.com/watch?v=pg19Z8LL06w" },
    { label: "KodeKloud Docker", url: "https://kodekloud.com/courses/docker-for-the-absolute-beginner/" },
  ],
  sql: [
    { label: "SQLZoo", url: "https://sqlzoo.net" },
    { label: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
    { label: "Khan Academy SQL", url: "https://www.khanacademy.org/computing/computer-programming/sql" },
  ],
  typescript: [
    { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/" },
    { label: "Total TypeScript", url: "https://www.totaltypescript.com" },
    { label: "freeCodeCamp TS", url: "https://www.freecodecamp.org/news/learn-typescript-beginners-guide/" },
  ],
};

export const POPULAR = [
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
  "CSS & Flexbox",
  "Next.js fullstack",
  "Data Science with Python",
  "Flutter mobile",
];

export  const DURATIONS = [
  { id: "7d", l: "7 Days", w: 1, icon: "⚡" },
  { id: "1m", l: "1 Month", w: 4, icon: "🗓" },
  { id: "3m", l: "3 Months", w: 12, icon: "🚀" },
  { id: "6m", l: "6 Months", w: 26, icon: "🌱" },
  { id: "9m", l: "9 Months", w: 39, icon: "🏆" },
  { id: "12m", l: "1 Year", w: 52, icon: "👑" },
];

export const LEVELS = [
  { id: "beginner", icon: "🌱", l: "Beginner", sub: "Zero knowledge" },
  { id: "intermediate", icon: "⚡", l: "Intermediate", sub: "Know the basics" },
  { id: "advanced", icon: "🔥", l: "Advanced", sub: "Fill gaps & deepen" },
];

export const PACES = [
  { id: "slow", icon: "🐢", l: "Casual", h: 0.5, sub: "30m/day" },
  { id: "regular", icon: "🚶", l: "Regular", h: 1, sub: "1hr/day" },
  { id: "fast", icon: "🏃", l: "Fast", h: 2, sub: "2hr/day" },
  { id: "intense", icon: "🔥", l: "Intense", h: 4, sub: "4hr/day" },
];

export const PHASE_COLORS = [
  { c: "#6366f1", l: "#a5b4fc", bg: "rgba(99,102,241,.1)", bd: "rgba(99,102,241,.25)" },
  { c: "#7c3aed", l: "#c4b5fd", bg: "rgba(124,58,237,.1)", bd: "rgba(124,58,237,.25)" },
  { c: "#0f766e", l: "#2dd4bf", bg: "rgba(15,118,110,.1)", bd: "rgba(15,118,110,.25)" },
  { c: "#d97706", l: "#fbbf24", bg: "rgba(217,119,6,.1)", bd: "rgba(217,119,6,.25)" },
  { c: "#e11d48", l: "#fb7185", bg: "rgba(225,29,72,.1)", bd: "rgba(225,29,72,.25)" },
  { c: "#0284c7", l: "#7dd3fc", bg: "rgba(2,132,199,.1)", bd: "rgba(2,132,199,.25)" },
];

export const CURRICULA: Record<string, any> = {
  javascript: {
    phases: [
      {
        title: "Foundations",
        topics: [
          {
            t: "Variables, Data Types & Operators",
            e: "📦",
            a: [
              "Declare variables using let/const, understand var vs let vs const",
              "Write expressions using arithmetic, comparison, and logical operators",
              "Build a simple calculator that takes two inputs and shows result",
            ],
            g: "You can declare variables and write basic expressions",
            r: [
              { l: "javascript.info Variables", u: "https://javascript.info/variables" },
              { l: "MDN JS Basics", u: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics" },
            ],
          },
          {
            t: "Control Flow: if/else, loops",
            e: "🔀",
            a: [
              "Write if/else chains to handle multiple conditions",
              "Use for, while, and forEach loops to iterate over data",
              "Build a FizzBuzz program and a number-guessing game",
            ],
            g: "You can control program flow with conditions and loops",
            r: [
              { l: "javascript.info Conditionals", u: "https://javascript.info/ifelse" },
              { l: "freeCodeCamp JS", u: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
            ],
          },
          {
            t: "Functions & Scope",
            e: "🧩",
            a: [
              "Write named functions, arrow functions, and understand parameters vs arguments",
              "Explain the difference between global, function, and block scope",
              "Build a temperature converter and a tip calculator using functions",
            ],
            g: "You can write reusable functions and understand scope",
            r: [
              { l: "javascript.info Functions", u: "https://javascript.info/function-basics" },
              { l: "MDN Functions Guide", u: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" },
            ],
          },
        ],
      },
      {
        title: "Intermediate JavaScript",
        topics: [
          {
            t: "Events & Event Listeners",
            e: "🎯",
            a: [
              "Attach click, input, keydown, submit event listeners",
              "Understand event bubbling and event delegation",
              "Build a live search filter and a drag-and-drop list",
            ],
            g: "You can handle all common user interaction events",
            r: [
              { l: "javascript.info Events", u: "https://javascript.info/events" },
              { l: "MDN Event Reference", u: "https://developer.mozilla.org/en-US/docs/Web/Events" },
            ],
          },
          {
            t: "ES6+: Promises & Async/Await",
            e: "⏳",
            a: [
              "Create and chain Promises, handle resolve and reject",
              "Rewrite Promise chains using async/await syntax",
              "Fetch weather data from a public API and display it on a page",
            ],
            g: "You can write asynchronous code and consume APIs",
            r: [
              { l: "javascript.info Promises", u: "https://javascript.info/promise-basics" },
              { l: "MDN Async/Await", u: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises" },
            ],
          },
        ],
      },
      {
        title: "Projects & Advanced",
        topics: [
          {
            t: "Local Storage & State",
            e: "💾",
            a: [
              "Read, write, and delete from localStorage",
              "Build a persistent to-do app that survives page refresh",
              "Implement undo/redo functionality using state history array",
            ],
            g: "You can persist app data between sessions",
            r: [
              { l: "MDN localStorage", u: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" },
              { l: "javascript.info Storage", u: "https://javascript.info/localstorage" },
            ],
          },
          {
            t: "Capstone Project",
            e: "🚀",
            a: [
              "Plan a full JavaScript app: choose a public API and define features",
              "Build the complete app with DOM manipulation, fetch, and localStorage",
              "Deploy to GitHub Pages and share the live URL",
            ],
            g: "You have a complete portfolio project built with vanilla JS",
            r: [
              { l: "GitHub Pages Deploy", u: "https://pages.github.com" },
              { l: "Public APIs for Projects", u: "https://github.com/public-apis/public-apis" },
            ],
          },
        ],
      },
    ],
  },
  react: {
    phases: [
      {
        title: "React Foundations",
        topics: [
          {
            t: "JSX & Component Basics",
            e: "⚛️",
            a: [
              "Create functional components and render JSX to the DOM",
              "Understand the difference between HTML and JSX",
              "Build a personal portfolio page using only static React components",
            ],
            g: "You can create and render React components with JSX",
            r: [
              { l: "React Official Docs", u: "https://react.dev/learn" },
              { l: "React.dev Tutorial", u: "https://react.dev/learn/tutorial-tic-tac-toe" },
            ],
          },
          {
            t: "Props & Component Communication",
            e: "📨",
            a: [
              "Pass data between components using props",
              "Build reusable Card, Button, Badge components with props",
              "Create a product listing page with a ProductCard component",
            ],
            g: "You can pass data through component trees using props",
            r: [
              { l: "React Props Docs", u: "https://react.dev/learn/passing-props-to-a-component" },
              { l: "Full Stack Open Ch1", u: "https://fullstackopen.com/en/part1" },
            ],
          },
          {
            t: "useState & Event Handling",
            e: "🔄",
            a: [
              "Use useState to manage counter, toggle, and form state",
              "Attach onClick, onChange, onSubmit handlers to elements",
              "Build an interactive color picker and a controlled form",
            ],
            g: "You can manage component state and handle user events",
            r: [
              { l: "React useState Docs", u: "https://react.dev/reference/react/useState" },
              { l: "Full Stack Open Part1b", u: "https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps" },
            ],
          },
        ],
      },
      {
        title: "Intermediate React",
        topics: [
          {
            t: "useEffect & Data Fetching",
            e: "🌐",
            a: [
              "Use useEffect to fetch data on component mount",
              "Handle loading and error states with useState",
              "Build a weather app that fetches real data from OpenWeatherMap API",
            ],
            g: "You can fetch and display external data in React components",
            r: [
              { l: "React useEffect Docs", u: "https://react.dev/reference/react/useEffect" },
              { l: "Full Stack Open Part2", u: "https://fullstackopen.com/en/part2" },
            ],
          },
          {
            t: "React Router v6",
            e: "🗺️",
            a: [
              "Set up React Router and create multiple routes",
              "Use Link, NavLink, useNavigate, and useParams",
              "Add routing to your app: Home, About, Detail pages with URL params",
            ],
            g: "You can build multi-page React apps with client-side routing",
            r: [
              { l: "React Router Docs", u: "https://reactrouter.com/en/main/start/tutorial" },
              { l: "React Router Tutorial", u: "https://reactrouter.com/en/main/start/overview" },
            ],
          },
          {
            t: "useContext & Global State",
            e: "🌍",
            a: [
              "Create a Context and Provider for theme or auth state",
              "Consume context in deeply nested components without prop drilling",
              "Implement a dark/light mode toggle using Context across your app",
            ],
            g: "You can manage global state with Context API",
            r: [
              { l: "React Context Docs", u: "https://react.dev/reference/react/useContext" },
              { l: "Kent C. Dodds Context", u: "https://kentcdodds.com/blog/how-to-use-react-context-effectively" },
            ],
          },
        ],
      },
      {
        title: "Advanced & Production",
        topics: [
          {
            t: "Performance: memo, useCallback, useMemo",
            e: "⚡",
            a: [
              "Use React.memo to prevent unnecessary re-renders",
              "Apply useCallback and useMemo to expensive computations",
              "Profile a component tree in React DevTools and fix performance issues",
            ],
            g: "You can identify and fix React performance bottlenecks",
            r: [
              { l: "React Performance Docs", u: "https://react.dev/reference/react/memo" },
              { l: "React DevTools", u: "https://react.dev/learn/react-developer-tools" },
            ],
          },
          {
            t: "Capstone: Full React App",
            e: "🏆",
            a: [
              "Design a CRUD app (notes, recipes, contacts) with all React concepts",
              "Implement routing, context, custom hooks, data fetching, and forms",
              "Deploy to Vercel and write a README with setup instructions",
            ],
            g: "You have a complete production-ready React app in your portfolio",
            r: [
              { l: "Vercel Deploy Guide", u: "https://vercel.com/docs/frameworks/create-react-app" },
              { l: "React Patterns", u: "https://reactpatterns.com" },
            ],
          },
        ],
      },
    ],
  },
  // Add more curricula for python, dsa, machine learning, node.js, docker as needed
};

// lib/planner/utils.ts


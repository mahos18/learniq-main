/**
 * LearnIQ — Complete Seed File
 * 5 Courses, full modules, content blocks, quizzes, 2 users
 * Run: npx ts-node -r tsconfig-paths/register src/lib/seed.ts
 */

import mongoose from "mongoose";
import { Course, Module } from "../models/Course";
import User from "../models/User";
import { Enrollment, QuizResult, RewardTransaction } from "../models/Enrollment";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sohamlohote:soham_maongodb1@cluster101.hpwvsti.mongodb.net/learniq?retryWrites=true&w=majority";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await User.deleteMany({ email: { $in: ["instructor@learniq.dev", "student@learniq.dev"] } });
  await Course.deleteMany({});
  await Module.deleteMany({});
  await Enrollment.deleteMany({});
  await QuizResult.deleteMany({});
  await RewardTransaction.deleteMany({});
  console.log("Cleared old data");

  const instructor = await User.create({
    name: "Dr. Arjun Mehta",
    email: "instructor@learniq.dev",
    role: "instructor",
    rewardPoints: 0,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
  });

  const student = await User.create({
    name: "Priya Sharma",
    email: "student@learniq.dev",
    role: "student",
    rewardPoints: 840,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
  });

  // ── COURSE 1: DSA ──────────────────────────────────────────────────────
  const dsa = await Course.create({
    title: "Data Structures & Algorithms",
    description: "Master core DSA concepts required to crack FAANG interviews. Arrays to dynamic programming — structured, progressive, and interview-focused.",
    instructor: instructor._id,
    difficulty: "intermediate",
    tags: ["DSA", "Arrays", "Trees", "Graphs", "Dynamic Programming", "Recursion"],
    pointCost: 500,
    isPublished: true,
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
  });

  const dsa_m1 = await Module.create({
    course: dsa._id, title: "Arrays & The Sliding Window", order: 1, rewardOnComplete: 25,
    contentBlocks: [
      { type: "text", order: 1, title: "What is an Array?",
        content: "## Arrays\n\nAn **array** is a contiguous block of memory storing elements of the same type.\n\n### Key Properties\n- **Access**: O(1) by index\n- **Search**: O(n) linear, O(log n) binary on sorted\n- **Insert/Delete**: O(n) due to shifting\n\n### Memory Layout\nElements are stored at consecutive addresses. If base = 1000 and int = 4 bytes:\n- arr[0] → 1000\n- arr[1] → 1004\n- arr[2] → 1008" },
      { type: "youtube", order: 2, title: "Arrays Crash Course", url: "https://www.youtube.com/watch?v=QFrJQq6Iox8" },
      { type: "quiz_popup", order: 3, title: "Quick Check", questions: [
        { question: "Time complexity of accessing an array element by index?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 2, topic: "Arrays", bonusPoints: 15 }
      ]},
      { type: "text", order: 4, title: "Sliding Window Technique",
        content: "## Sliding Window\n\nMaintains a subset of data and slides it across input to avoid recomputing.\n\n### Template\n```python\nleft = 0\nfor right in range(len(arr)):\n    while window_invalid:\n        left += 1\n    # update answer\n```\n\n### Complexity: O(n) — each element enters and leaves the window once." },
      { type: "quiz_end", order: 5, title: "Module 1 Assessment", questions: [
        { question: "Best solved with sliding window?", options: ["Is a number prime", "Maximum sum subarray of size k", "Finding median", "Reversing array"], correctIndex: 1, topic: "Arrays", bonusPoints: 25 },
        { question: "Space complexity of sliding window?", options: ["O(n)", "O(k)", "O(1)", "O(log n)"], correctIndex: 2, topic: "Arrays", bonusPoints: 25 },
        { question: "Binary search time complexity?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], correctIndex: 2, topic: "Arrays", bonusPoints: 25 },
      ]},
    ],
  });

  const dsa_m2 = await Module.create({
    course: dsa._id, title: "Recursion & Backtracking", order: 2, rewardOnComplete: 30,
    contentBlocks: [
      { type: "text", order: 1, title: "Understanding Recursion",
        content: "## Recursion\n\nA function that calls itself to solve a smaller version of the same problem.\n\n### Two essential parts\n1. **Base case** — condition to stop\n2. **Recursive case** — call with smaller input\n\n```python\ndef factorial(n):\n    if n == 0: return 1\n    return n * factorial(n - 1)\n```" },
      { type: "youtube", order: 2, title: "Recursion Masterclass", url: "https://www.youtube.com/watch?v=IJDJ0kBx2LM" },
      { type: "quiz_popup", order: 3, title: "Quick Check", questions: [
        { question: "What happens without a base case in recursion?", options: ["Returns null", "Does nothing", "Stack overflow", "Runs once"], correctIndex: 2, topic: "Recursion", bonusPoints: 15 }
      ]},
      { type: "text", order: 4, title: "Backtracking Pattern",
        content: "## Backtracking\n\nBuilds solutions incrementally and abandons paths that cannot lead to a valid solution.\n\n```python\ndef backtrack(state):\n    if is_solution(state):\n        results.append(state.copy())\n        return\n    for choice in get_choices(state):\n        make_choice(state, choice)\n        backtrack(state)\n        undo_choice(state, choice)  # ← backtrack\n```" },
      { type: "quiz_end", order: 5, title: "Module 2 Assessment", questions: [
        { question: "Backtracking improves over brute force by:", options: ["Using DP", "Pruning invalid branches early", "Using iteration", "Sorting first"], correctIndex: 1, topic: "Recursion", bonusPoints: 25 },
        { question: "Time complexity of generating all permutations of n elements?", options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(n!)"], correctIndex: 3, topic: "Recursion", bonusPoints: 25 },
      ]},
    ],
  });

  const dsa_m3 = await Module.create({
    course: dsa._id, title: "Binary Trees & BST", order: 3, rewardOnComplete: 35,
    contentBlocks: [
      { type: "text", order: 1, title: "Tree Fundamentals",
        content: "## Binary Trees\n\nEvery node has at most **two children**: left and right.\n\n### BST Property\n- Left subtree → **smaller** values\n- Right subtree → **larger** values\n\n### Traversals\n- **Inorder** (L, Root, R) → sorted output for BST\n- **Preorder** (Root, L, R) → serialize tree\n- **Postorder** (L, R, Root) → delete tree" },
      { type: "youtube", order: 2, title: "Binary Trees Full Course", url: "https://www.youtube.com/watch?v=fAAZixBzIAI" },
      { type: "quiz_popup", order: 3, title: "Quick Check", questions: [
        { question: "In a BST, where are smaller values stored?", options: ["Right subtree", "Left subtree", "Parent node", "Depends"], correctIndex: 1, topic: "Trees", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 4, title: "Module 3 Assessment", questions: [
        { question: "Which traversal visits BST nodes in sorted order?", options: ["Preorder", "Postorder", "Inorder", "Level-order"], correctIndex: 2, topic: "Trees", bonusPoints: 25 },
        { question: "Height of a balanced binary tree with n nodes?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctIndex: 2, topic: "Trees", bonusPoints: 25 },
        { question: "Which algorithm uses a queue for level-by-level traversal?", options: ["DFS", "BFS", "Inorder", "Postorder"], correctIndex: 1, topic: "Trees", bonusPoints: 25 },
      ]},
    ],
  });

  dsa.modules = [dsa_m1._id, dsa_m2._id, dsa_m3._id] as any;
  await dsa.save();
  console.log("Course 1: DSA created");

  // ── COURSE 2: Full Stack Web Dev ───────────────────────────────────────
  const webdev = await Course.create({
    title: "Full Stack Web Development with Next.js",
    description: "Build production-ready web apps using Next.js 14, MongoDB, and Tailwind CSS. From zero to full-stack in 8 modules.",
    instructor: instructor._id,
    difficulty: "beginner",
    tags: ["Next.js", "React", "MongoDB", "Tailwind", "JavaScript"],
    pointCost: 300,
    isPublished: true,
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
  });

  const web_m1 = await Module.create({
    course: webdev._id, title: "React & JSX Fundamentals", order: 1, rewardOnComplete: 25,
    contentBlocks: [
      { type: "text", order: 1, title: "What is React?",
        content: "## React\n\nA JavaScript library for building UI using reusable components.\n\n### Core Concepts\n- **Components** — functions that return JSX\n- **Props** — data from parent to child\n- **State** — data that changes over time\n- **Hooks** — use React features in function components" },
      { type: "youtube", order: 2, title: "React Crash Course 2024", url: "https://www.youtube.com/watch?v=LDB4uaJ87e0" },
      { type: "quiz_popup", order: 3, title: "Quick Check", questions: [
        { question: "JSX stands for?", options: ["JavaScript Extra", "JavaScript XML", "Java Syntax Extension", "JavaScript Extension"], correctIndex: 1, topic: "React", bonusPoints: 15 }
      ]},
      { type: "text", order: 4, title: "useState & useEffect",
        content: "## Hooks\n\n### useState\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n### useEffect\n```jsx\nuseEffect(() => {\n  fetchData();\n  return () => { /* cleanup */ };\n}, [dependency]);\n```\n\n### Rules of Hooks\n1. Only call at the top level\n2. Only call from React functions" },
      { type: "quiz_end", order: 5, title: "Module 1 Assessment", questions: [
        { question: "Which hook manages local state?", options: ["useEffect", "useContext", "useState", "useRef"], correctIndex: 2, topic: "React", bonusPoints: 25 },
        { question: "useEffect with no dependency array runs:", options: ["Only on mount", "On state changes only", "After every render", "On unmount only"], correctIndex: 2, topic: "React", bonusPoints: 25 },
        { question: "Props flow in which direction?", options: ["Child to parent", "Parent to child", "Sibling to sibling", "Any direction"], correctIndex: 1, topic: "React", bonusPoints: 25 },
      ]},
    ],
  });

  const web_m2 = await Module.create({
    course: webdev._id, title: "Next.js App Router & API Routes", order: 2, rewardOnComplete: 30,
    contentBlocks: [
      { type: "text", order: 1, title: "App Router Basics",
        content: "## Next.js 14 App Router\n\nFile system = routing.\n\n```\napp/\n├── page.tsx          → /\n├── about/page.tsx    → /about\n└── blog/[slug]/page.tsx → /blog/:slug\n```\n\n### Server vs Client Components\n- **Server** (default) — renders on server, can fetch data directly\n- **Client** (add 'use client') — renders in browser, can use hooks" },
      { type: "youtube", order: 2, title: "Next.js 14 Full Tutorial", url: "https://www.youtube.com/watch?v=ZjAqacIC_3c" },
      { type: "quiz_popup", order: 3, title: "Quick Check", questions: [
        { question: "Which file defines the page component in App Router?", options: ["index.tsx", "route.tsx", "page.tsx", "layout.tsx"], correctIndex: 2, topic: "Next.js", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 4, title: "Module 2 Assessment", questions: [
        { question: "Directive for client-side rendering in Next.js?", options: ['"use server"', '"use client"', '"client only"', '"browser"'], correctIndex: 1, topic: "Next.js", bonusPoints: 25 },
        { question: "Which method handles form submissions in API routes?", options: ["GET", "PUT", "POST", "PATCH"], correctIndex: 2, topic: "Next.js", bonusPoints: 25 },
      ]},
    ],
  });

  const web_m3 = await Module.create({
    course: webdev._id, title: "MongoDB & Mongoose", order: 3, rewardOnComplete: 30,
    contentBlocks: [
      { type: "text", order: 1, title: "MongoDB Fundamentals",
        content: "## MongoDB\n\nA **NoSQL document database** storing JSON-like documents.\n\n### Concepts\n- **Collection** → group of documents (like SQL table)\n- **Document** → JSON object (like SQL row)\n\n### Basic Schema\n```typescript\nconst UserSchema = new Schema({\n  name:  { type: String, required: true },\n  email: { type: String, unique: true },\n  role:  { type: String, enum: ['student', 'instructor'] },\n}, { timestamps: true });\n```" },
      { type: "quiz_popup", order: 2, title: "Quick Check", questions: [
        { question: "MongoDB equivalent of SQL 'table'?", options: ["Document", "Field", "Collection", "Schema"], correctIndex: 2, topic: "MongoDB", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 3, title: "Module 3 Assessment", questions: [
        { question: "Mongoose method to find one matching document?", options: ["find()", "findOne()", "findById()", "get()"], correctIndex: 1, topic: "MongoDB", bonusPoints: 25 },
        { question: "What does 'unique: true' do in Mongoose?", options: ["Encrypts the field", "Makes it required", "Ensures no duplicate values", "Creates an index"], correctIndex: 2, topic: "MongoDB", bonusPoints: 25 },
      ]},
    ],
  });

  webdev.modules = [web_m1._id, web_m2._id, web_m3._id] as any;
  await webdev.save();
  console.log("Course 2: Web Dev created");

  // ── COURSE 3: Machine Learning ─────────────────────────────────────────
  const ml = await Course.create({
    title: "Machine Learning Fundamentals",
    description: "Understand the math and intuition behind ML algorithms — linear regression, neural networks, and model evaluation. No black boxes.",
    instructor: instructor._id,
    difficulty: "advanced",
    tags: ["Machine Learning", "Python", "Neural Networks", "Statistics", "AI"],
    pointCost: 700,
    isPublished: true,
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  });

  const ml_m1 = await Module.create({
    course: ml._id, title: "Linear Regression & Gradient Descent", order: 1, rewardOnComplete: 35,
    contentBlocks: [
      { type: "text", order: 1, title: "Linear Regression",
        content: "## Linear Regression\n\nPredicts a **continuous output** by fitting a line through data points.\n\n### Model\n```\ny_hat = w1*x1 + w2*x2 + b\n```\n\n### Cost Function (MSE)\nMeasures how wrong predictions are:\n```\nJ(w) = (1/n) * sum((y_hat - y)²)\n```\n\n### Goal: minimize J(w) by finding optimal weights." },
      { type: "text", order: 2, title: "Gradient Descent",
        content: "## Gradient Descent\n\nIteratively adjusts weights to minimize cost.\n\n### Update Rule\n```\nw = w - α * (dJ/dw)\n```\nWhere α = **learning rate**.\n\n### Learning Rate\n- Too large → overshoots, diverges\n- Too small → very slow convergence\n- Just right → converges smoothly\n\n### Variants\n- **Batch GD** — all data per step (stable)\n- **Stochastic GD** — one sample per step (fast)\n- **Mini-batch GD** — best of both" },
      { type: "youtube", order: 3, title: "Gradient Descent Visual", url: "https://www.youtube.com/watch?v=sDv4f4s2SB8" },
      { type: "quiz_popup", order: 4, title: "Quick Check", questions: [
        { question: "What does learning rate control in gradient descent?", options: ["Number of examples", "Size of each weight update step", "Number of hidden layers", "Activation function"], correctIndex: 1, topic: "Machine Learning", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 5, title: "Module 1 Assessment", questions: [
        { question: "Linear regression predicts:", options: ["A category", "A continuous numeric value", "A probability distribution", "A cluster label"], correctIndex: 1, topic: "Machine Learning", bonusPoints: 25 },
        { question: "Purpose of the cost function?", options: ["Define architecture", "Measure prediction error", "Normalize features", "Prevent overfitting"], correctIndex: 1, topic: "Machine Learning", bonusPoints: 25 },
        { question: "Learning rate too high causes:", options: ["Underfitting", "Slow training", "Divergence / overshoot", "Memorization"], correctIndex: 2, topic: "Machine Learning", bonusPoints: 25 },
      ]},
    ],
  });

  const ml_m2 = await Module.create({
    course: ml._id, title: "Neural Networks & Backpropagation", order: 2, rewardOnComplete: 40,
    contentBlocks: [
      { type: "text", order: 1, title: "Neural Network Architecture",
        content: "## Neural Networks\n\nLayers of connected neurons learning complex patterns.\n\n### Layers\n- **Input** — raw features\n- **Hidden** — intermediate representations\n- **Output** — final prediction\n\n### Activation Functions\n- **ReLU**: max(0, x) — most common in hidden layers\n- **Sigmoid**: 1/(1+e⁻ˣ) — binary classification output\n- **Softmax** — multiclass probabilities" },
      { type: "youtube", order: 2, title: "Neural Networks from Scratch", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
      { type: "quiz_popup", order: 3, title: "Quick Check", questions: [
        { question: "Most common activation in hidden layers?", options: ["Sigmoid", "Tanh", "ReLU", "Softmax"], correctIndex: 2, topic: "Neural Networks", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 4, title: "Module 2 Assessment", questions: [
        { question: "Backpropagation uses which calculus rule?", options: ["Product rule", "Chain rule", "Quotient rule", "L'Hopital"], correctIndex: 1, topic: "Neural Networks", bonusPoints: 25 },
        { question: "Batch normalization solves:", options: ["Overfitting", "Internal covariate shift", "Vanishing gradients only", "Too many parameters"], correctIndex: 1, topic: "Neural Networks", bonusPoints: 25 },
      ]},
    ],
  });

  ml.modules = [ml_m1._id, ml_m2._id] as any;
  await ml.save();
  console.log("Course 3: Machine Learning created");

  // ── COURSE 4: System Design ────────────────────────────────────────────
  const sysdesign = await Course.create({
    title: "System Design for Engineers",
    description: "Design scalable, reliable systems. Essential for senior engineering interviews at top product companies.",
    instructor: instructor._id,
    difficulty: "advanced",
    tags: ["System Design", "Scalability", "Databases", "Caching", "Microservices"],
    pointCost: 600,
    isPublished: true,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  });

  const sys_m1 = await Module.create({
    course: sysdesign._id, title: "Scalability Fundamentals", order: 1, rewardOnComplete: 35,
    contentBlocks: [
      { type: "text", order: 1, title: "Vertical vs Horizontal Scaling",
        content: "## Scalability\n\n### Vertical (Scale Up)\nMore power to existing machine — more CPU, RAM.\n- ✅ Simple, no code changes\n- ❌ Single point of failure, hard limits\n\n### Horizontal (Scale Out)\nMore machines, distribute load.\n- ✅ Unlimited scale, no SPOF\n- ❌ Complex — needs load balancers, distributed state\n\n### Load Balancer Algorithms\n- **Round Robin** — sequential distribution\n- **Least Connections** — route to least busy server\n- **IP Hash** — same client → same server" },
      { type: "text", order: 2, title: "CAP Theorem",
        content: "## CAP Theorem\n\nA distributed system can guarantee only **2 of 3**:\n\n- **C** — Consistency: every read gets latest write\n- **A** — Availability: every request gets a response\n- **P** — Partition Tolerance: works despite network failures\n\nSince network partitions are inevitable, choose:\n- **CP** — consistent but may be unavailable (MongoDB)\n- **AP** — available but may return stale data (Cassandra)" },
      { type: "youtube", order: 3, title: "System Design Fundamentals", url: "https://www.youtube.com/watch?v=i53Gi_K3o7I" },
      { type: "quiz_popup", order: 4, title: "Quick Check", questions: [
        { question: "Horizontal scaling means:", options: ["Upgrade existing server", "Add more machines", "Add more RAM", "Buy a faster CPU"], correctIndex: 1, topic: "System Design", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 5, title: "Module 1 Assessment", questions: [
        { question: "CAP theorem — which property must all distributed systems tolerate?", options: ["Consistency", "Availability", "Partition Tolerance", "Durability"], correctIndex: 2, topic: "System Design", bonusPoints: 25 },
        { question: "Primary purpose of a load balancer?", options: ["Store sessions", "Encrypt traffic", "Distribute requests across servers", "Cache queries"], correctIndex: 2, topic: "System Design", bonusPoints: 25 },
        { question: "MongoDB is an example of which CAP combination?", options: ["AP", "CA", "CP", "All three"], correctIndex: 2, topic: "System Design", bonusPoints: 25 },
      ]},
    ],
  });

  const sys_m2 = await Module.create({
    course: sysdesign._id, title: "Caching Strategies", order: 2, rewardOnComplete: 30,
    contentBlocks: [
      { type: "text", order: 1, title: "Caching Fundamentals",
        content: "## Caching\n\nStores copies of frequently accessed data in a fast layer.\n\n### Hit vs Miss\n- **Hit** — found in cache → fast\n- **Miss** — not found → fetch from DB, store in cache\n\n### Eviction Policies\n- **LRU** — evict least recently used\n- **LFU** — evict least frequently used\n- **TTL** — evict after set time\n\n### Strategies\n- **Write-Through** — write to cache + DB simultaneously\n- **Write-Back** — write to cache, async to DB\n- **Cache-Aside** — app manages cache explicitly\n\n### Redis vs Memcached\n- Redis: rich data types, persistence, pub/sub\n- Memcached: simpler, slightly faster for pure key-value" },
      { type: "quiz_popup", order: 2, title: "Quick Check", questions: [
        { question: "LRU cache evicts which item when full?", options: ["Most recently used", "Least recently used", "Random item", "Largest item"], correctIndex: 1, topic: "System Design", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 3, title: "Module 2 Assessment", questions: [
        { question: "Write-Through caching writes to:", options: ["Cache only", "DB only", "Cache and DB simultaneously", "Neither, queues it"], correctIndex: 2, topic: "System Design", bonusPoints: 25 },
        { question: "Main advantage of Redis over Memcached?", options: ["Always faster", "Supports rich data types, persistence, pub/sub", "Uses less memory", "Easier to install"], correctIndex: 1, topic: "System Design", bonusPoints: 25 },
      ]},
    ],
  });

  sysdesign.modules = [sys_m1._id, sys_m2._id] as any;
  await sysdesign.save();
  console.log("Course 4: System Design created");

  // ── COURSE 5: Competitive Programming ────────────────────────────────
  const cp = await Course.create({
    title: "Python for Competitive Programming",
    description: "Master competitive programming with Python — Big-O analysis, graph algorithms, segment trees, and contest-level problem solving.",
    instructor: instructor._id,
    difficulty: "intermediate",
    tags: ["Python", "Competitive Programming", "Graphs", "Dynamic Programming", "Sorting"],
    pointCost: 400,
    isPublished: true,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
  });

  const cp_m1 = await Module.create({
    course: cp._id, title: "Complexity Analysis & Big-O", order: 1, rewardOnComplete: 25,
    contentBlocks: [
      { type: "text", order: 1, title: "Time Complexity",
        content: "## Big-O Notation\n\nHow runtime grows relative to input size n.\n\n| Notation | Name | Example |\n|----------|------|---------|\n| O(1) | Constant | Array access |\n| O(log n) | Logarithmic | Binary search |\n| O(n) | Linear | Linear scan |\n| O(n log n) | Log-linear | Merge sort |\n| O(n²) | Quadratic | Bubble sort |\n| O(2ⁿ) | Exponential | All subsets |\n| O(n!) | Factorial | All permutations |\n\n### Rules\n1. Drop constants: O(2n) → O(n)\n2. Drop lower terms: O(n² + n) → O(n²)" },
      { type: "youtube", order: 2, title: "Big O Notation Guide", url: "https://www.youtube.com/watch?v=Mo4vesaut8g" },
      { type: "quiz_popup", order: 3, title: "Quick Check", questions: [
        { question: "Binary search time complexity?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], correctIndex: 2, topic: "Algorithms", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 4, title: "Module 1 Assessment", questions: [
        { question: "Simplified Big-O of 3n² + 5n + 100?", options: ["O(n)", "O(n²)", "O(3n²)", "O(5n)"], correctIndex: 1, topic: "Algorithms", bonusPoints: 25 },
        { question: "Average O(n log n) sorting algorithm?", options: ["Bubble sort", "Insertion sort", "Merge sort", "Selection sort"], correctIndex: 2, topic: "Sorting", bonusPoints: 25 },
        { question: "All subsets of n elements — time complexity?", options: ["O(n!)", "O(n²)", "O(2ⁿ)", "O(n log n)"], correctIndex: 2, topic: "Algorithms", bonusPoints: 25 },
      ]},
    ],
  });

  const cp_m2 = await Module.create({
    course: cp._id, title: "Graph Algorithms — BFS, DFS & Dijkstra", order: 2, rewardOnComplete: 40,
    contentBlocks: [
      { type: "text", order: 1, title: "Graph Representation",
        content: "## Graphs\n\nNodes connected by edges.\n\n### Adjacency List (preferred)\n```python\ngraph = {\n    0: [1, 2],\n    1: [0, 3],\n    2: [0, 4],\n}\n```\nSpace: O(V + E)\n\n### Types\n- Directed / Undirected\n- Weighted / Unweighted\n- Cyclic / Acyclic (DAG)" },
      { type: "text", order: 2, title: "BFS & DFS",
        content: "## BFS — uses Queue — shortest path (unweighted)\n```python\nfrom collections import deque\ndef bfs(graph, start):\n    visited, queue = set(), deque([start])\n    visited.add(start)\n    while queue:\n        node = queue.popleft()\n        for nb in graph[node]:\n            if nb not in visited:\n                visited.add(nb)\n                queue.append(nb)\n```\n\n## DFS — uses Stack/Recursion — cycle detection, topological sort\n```python\ndef dfs(graph, node, visited=set()):\n    visited.add(node)\n    for nb in graph[node]:\n        if nb not in visited:\n            dfs(graph, nb, visited)\n```" },
      { type: "youtube", order: 3, title: "Graph Algorithms Explained", url: "https://www.youtube.com/watch?v=tWVWeAqZ0WU" },
      { type: "quiz_popup", order: 4, title: "Quick Check", questions: [
        { question: "BFS uses which data structure?", options: ["Stack", "Queue", "Heap", "Set"], correctIndex: 1, topic: "Graphs", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 5, title: "Module 2 Assessment", questions: [
        { question: "Dijkstra's algorithm finds:", options: ["Minimum spanning tree", "Shortest path unweighted", "Shortest path weighted (non-negative)", "All cycles"], correctIndex: 2, topic: "Graphs", bonusPoints: 25 },
        { question: "Time complexity of BFS/DFS — V vertices, E edges?", options: ["O(V²)", "O(V + E)", "O(V log V)", "O(E log E)"], correctIndex: 1, topic: "Graphs", bonusPoints: 25 },
        { question: "Topological sort uses which algorithm?", options: ["BFS only", "Dijkstra", "DFS with stack", "Bellman-Ford"], correctIndex: 2, topic: "Graphs", bonusPoints: 25 },
      ]},
    ],
  });

  const cp_m3 = await Module.create({
    course: cp._id, title: "Dynamic Programming", order: 3, rewardOnComplete: 45,
    contentBlocks: [
      { type: "text", order: 1, title: "What is Dynamic Programming?",
        content: "## Dynamic Programming\n\nSolves complex problems by breaking into overlapping subproblems and storing results.\n\n### Two Conditions\n1. **Optimal Substructure** — optimal solution from optimal sub-solutions\n2. **Overlapping Subproblems** — same subproblems repeated\n\n### Top-Down (Memoization)\n```python\nmemo = {}\ndef fib(n):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\n```\n\n### Bottom-Up (Tabulation)\n```python\ndef fib(n):\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n```" },
      { type: "youtube", order: 2, title: "Dynamic Programming Full Course", url: "https://www.youtube.com/watch?v=oBt53YbR9Kk" },
      { type: "quiz_popup", order: 3, title: "Quick Check", questions: [
        { question: "Memoization means:", options: ["Writing comments", "Storing results to avoid recomputation", "Using recursion", "Sorting input first"], correctIndex: 1, topic: "Dynamic Programming", bonusPoints: 15 }
      ]},
      { type: "quiz_end", order: 4, title: "Module 3 Assessment", questions: [
        { question: "Naive recursive Fibonacci (no memo) time complexity?", options: ["O(n)", "O(n log n)", "O(2ⁿ)", "O(n²)"], correctIndex: 2, topic: "Dynamic Programming", bonusPoints: 25 },
        { question: "Classic DP — max value with weight limit?", options: ["LCS", "0/1 Knapsack", "Coin Change", "Edit Distance"], correctIndex: 1, topic: "Dynamic Programming", bonusPoints: 25 },
        { question: "Bottom-up DP avoids what issue?", options: ["Time complexity", "Space complexity", "Stack overflow from deep recursion", "Wrong results"], correctIndex: 2, topic: "Dynamic Programming", bonusPoints: 25 },
      ]},
    ],
  });

  cp.modules = [cp_m1._id, cp_m2._id, cp_m3._id] as any;
  await cp.save();
  console.log("Course 5: Competitive Programming created");

  // ── ENROLLMENTS & QUIZ RESULTS ─────────────────────────────────────────
  await Enrollment.create({ student: student._id, course: dsa._id, completedModules: [dsa_m1._id], overallProgress: 33, isCompleted: false });
  await Enrollment.create({ student: student._id, course: cp._id, completedModules: [cp_m1._id, cp_m2._id], overallProgress: 66, isCompleted: false });

  const qr = [
    { topic: "Arrays",             isCorrect: true,  pointsEarned: 25, module: dsa_m1._id, course: dsa._id, questionId: "q1" },
    { topic: "Arrays",             isCorrect: true,  pointsEarned: 25, module: dsa_m1._id, course: dsa._id, questionId: "q2" },
    { topic: "Arrays",             isCorrect: true,  pointsEarned: 15, module: dsa_m1._id, course: dsa._id, questionId: "q3" },
    { topic: "Arrays",             isCorrect: false, pointsEarned: 0,  module: dsa_m1._id, course: dsa._id, questionId: "q4" },
    { topic: "Recursion",          isCorrect: false, pointsEarned: 0,  module: dsa_m2._id, course: dsa._id, questionId: "q5" },
    { topic: "Recursion",          isCorrect: false, pointsEarned: 0,  module: dsa_m2._id, course: dsa._id, questionId: "q6" },
    { topic: "Recursion",          isCorrect: true,  pointsEarned: 15, module: dsa_m2._id, course: dsa._id, questionId: "q7" },
    { topic: "Trees",              isCorrect: true,  pointsEarned: 25, module: dsa_m3._id, course: dsa._id, questionId: "q8" },
    { topic: "Trees",              isCorrect: false, pointsEarned: 0,  module: dsa_m3._id, course: dsa._id, questionId: "q9" },
    { topic: "Trees",              isCorrect: true,  pointsEarned: 15, module: dsa_m3._id, course: dsa._id, questionId: "q10" },
    { topic: "Algorithms",         isCorrect: true,  pointsEarned: 25, module: cp_m1._id, course: cp._id, questionId: "q11" },
    { topic: "Algorithms",         isCorrect: true,  pointsEarned: 25, module: cp_m1._id, course: cp._id, questionId: "q12" },
    { topic: "Algorithms",         isCorrect: false, pointsEarned: 0,  module: cp_m1._id, course: cp._id, questionId: "q13" },
    { topic: "Sorting",            isCorrect: true,  pointsEarned: 25, module: cp_m1._id, course: cp._id, questionId: "q14" },
    { topic: "Sorting",            isCorrect: false, pointsEarned: 0,  module: cp_m1._id, course: cp._id, questionId: "q15" },
    { topic: "Graphs",             isCorrect: true,  pointsEarned: 25, module: cp_m2._id, course: cp._id, questionId: "q16" },
    { topic: "Graphs",             isCorrect: true,  pointsEarned: 25, module: cp_m2._id, course: cp._id, questionId: "q17" },
    { topic: "Graphs",             isCorrect: true,  pointsEarned: 15, module: cp_m2._id, course: cp._id, questionId: "q18" },
    { topic: "Graphs",             isCorrect: false, pointsEarned: 0,  module: cp_m2._id, course: cp._id, questionId: "q19" },
    { topic: "Dynamic Programming",isCorrect: false, pointsEarned: 0,  module: cp_m3._id, course: cp._id, questionId: "q20" },
    { topic: "Dynamic Programming",isCorrect: false, pointsEarned: 0,  module: cp_m3._id, course: cp._id, questionId: "q21" },
    { topic: "Dynamic Programming",isCorrect: true,  pointsEarned: 15, module: cp_m3._id, course: cp._id, questionId: "q22" },
  ];

  for (const r of qr) {
    await QuizResult.create({ student: student._id, ...r, answeredAt: new Date() });
  }

  await RewardTransaction.create([
    { student: student._id, action: "module_complete",    points: 25,  description: "Completed: Arrays & Sliding Window" },
    { student: student._id, action: "quiz_pass",          points: 25,  description: "Passed: Arrays Assessment" },
    { student: student._id, action: "module_complete",    points: 25,  description: "Completed: Complexity Analysis" },
    { student: student._id, action: "module_complete",    points: 40,  description: "Completed: Graph Algorithms" },
    { student: student._id, action: "quiz_pass",          points: 25,  description: "Passed: Graph Algorithms Assessment" },
    { student: student._id, action: "checkpoint_correct", points: 15,  description: "Checkpoint correct — Arrays" },
    { student: student._id, action: "checkpoint_correct", points: 15,  description: "Checkpoint correct — Graphs" },
  ]);

  console.log("\n SEED COMPLETE");
  console.log("────────────────────────────────────────");
  console.log("USERS");
  console.log("  Instructor : instructor@learniq.dev");
  console.log("  Student    : student@learniq.dev  (840 pts)");
  console.log("\nCOURSES");
  console.log("  1. Data Structures & Algorithms     — 3 modules — intermediate — 500 pts");
  console.log("  2. Full Stack Web Dev (Next.js)     — 3 modules — beginner    — 300 pts");
  console.log("  3. Machine Learning Fundamentals    — 2 modules — advanced    — 700 pts");
  console.log("  4. System Design for Engineers      — 2 modules — advanced    — 600 pts");
  console.log("  5. Python Competitive Programming   — 3 modules — intermediate— 400 pts");
  console.log("\nRADAR DATA (demo student)");
  console.log("  Arrays             75%  strong");
  console.log("  Graphs             75%  strong");
  console.log("  Trees              67%  medium");
  console.log("  Algorithms         67%  medium");
  console.log("  Sorting            50%  medium");
  console.log("  Recursion          33%  weak  <- AI will target");
  console.log("  Dynamic Programming 33%  weak  <- AI will target");
  console.log("────────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
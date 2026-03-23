# LearnIQ — Adaptive E-Learning Platform

> Hackathon 2025 — Web & App Development Track — PS1

## Quick Start (Do this first 30 minutes)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd learniq
npm install
```

### 2. Set Up Services (all free)
| Service | URL | What to get |
|---------|-----|-------------|
| MongoDB Atlas | https://cloud.mongodb.com | Connection string |
| Google OAuth  | https://console.cloud.google.com | Client ID + Secret |
| Groq API      | https://console.groq.com | API Key |
| Cloudinary    | https://cloudinary.com | Cloud name + API key + Secret |

### 3. Environment Variables
```bash
cp .env.local.example .env.local
# Fill in all values
```

### 4. Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Seed Demo Data
```bash
# After filling MONGODB_URI in .env.local:
npx ts-node -r tsconfig-paths/register src/lib/seed.ts
```

---

## Project Structure
```
src/
├── app/
│   ├── (auth)/login/           # Google OAuth login page
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + TopBar + BottomNav
│   │   ├── student/
│   │   │   ├── dashboard/      # Student home — stats + enrolled courses
│   │   │   ├── courses/        # Course discovery + module viewer
│   │   │   ├── profile/        # Radar chart + AI study plan
│   │   │   └── rewards/        # Points wallet + redemption
│   │   └── instructor/
│   │       ├── dashboard/      # Instructor home — course stats
│   │       ├── courses/        # Course list
│   │       └── courses/[id]/builder/  # Course + module builder
│   └── api/
│       ├── auth/[...nextauth]/ # Google OAuth handler
│       ├── courses/            # CRUD courses
│       ├── modules/            # CRUD modules + blocks
│       ├── enroll/             # Enroll + points redemption
│       ├── progress/           # Mark complete + award points
│       ├── quiz/submit/        # Answer validation (server-side)
│       ├── analytics/radar/    # Topic score aggregation
│       ├── ai/study-plan/      # Groq AI personalized plan
│       ├── rewards/            # Points history
│       ├── my-courses/         # Student enrolled courses
│       └── upload/             # Cloudinary file upload
├── components/
│   ├── layout/                 # Sidebar, TopBar, BottomNav, Providers
│   ├── course/                 # CourseCard
│   ├── module/                 # ContentBlock, ModuleRoadmap
│   ├── quiz/                   # QuizBlock (popup + end)
│   ├── progress/               # SkillRadar, ProgressRing, StudyPlanCard
│   ├── ui/                     # PointsPop, StreakCounter
│   └── pwa/                    # InstallBanner
├── hooks/
│   ├── useAnalytics.ts         # Radar data + AI plan
│   └── useQuiz.ts              # Quiz submission
├── lib/
│   ├── auth.ts                 # NextAuth + Google OAuth config
│   ├── db.ts                   # MongoDB connection
│   ├── groq.ts                 # Groq AI client + study plan prompt
│   ├── cloudinary.ts           # File upload utility
│   ├── utils.ts                # cn(), formatPoints(), getYouTubeId()
│   └── seed.ts                 # Demo data seed script
├── models/
│   ├── User.ts                 # User schema
│   ├── Course.ts               # Course + Module + ContentBlock schemas
│   └── Enrollment.ts           # Enrollment + QuizResult + RewardTransaction
└── types/
    └── index.ts                # TypeScript types + NextAuth session extension
```

---

## Key Features
- **Google OAuth** — one-click sign in, no passwords
- **Mixed content stream** — PDF, YouTube, instructor video, images, markdown notes
- **Checkpoint quizzes** — mid-module attention checks with +15 point rewards
- **End-of-module quizzes** — graded assessments with +25 points
- **Skill radar chart** — Recharts radar visualizing topic mastery from quiz scores
- **AI study plan** — Groq llama-3.3-70b generates personalized 7-day plan
- **Reward points** — earned per module/quiz, redeemable for free courses
- **Instructor builder** — drag-and-drop module roadmap + content block editor
- **PWA ready** — manifest, install banner, offline-capable structure

---

## Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (run from project root)
vercel

# Add all env variables in Vercel dashboard under Settings > Environment Variables
# Then redeploy: vercel --prod
```

---

## Team
| Person | Role | Owns |
|--------|------|------|
| P1 | Frontend (Next.js) | Student UI: dashboard, course viewer, progress, rewards |
| P2 | Full Stack | Instructor UI, all API routes, MongoDB, auth |
| P3 | AI/ML | Quiz engine, Groq integration, radar analytics |
| P4 | Design + Pitch | Tailwind styling, pitch deck, demo script |

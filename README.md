<![CDATA[<div align="center">

<img src="./public/homeicon.svg" alt="NextGen Tutor Logo" width="90" />

# NextGen Tutor

### 🎙️ AI-Powered Real-Time Voice Interview Coaching Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange?logo=convex)](https://convex.dev/)
[![Gemini](https://img.shields.io/badge/Google-Gemini%202.5-blue?logo=google)](https://ai.google.dev/)
[![Stack Auth](https://img.shields.io/badge/Auth-Stack%20Auth-purple)](https://stack-auth.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**[🚀 Live Demo](https://nextgen-tutor.vercel.app) · [📂 GitHub](https://github.com/mkumar2004/AI-NextGen-Tutor) · [🐛 Report a Bug](https://github.com/mkumar2004/AI-NextGen-Tutor/issues)**

</div>

---

## 📌 Overview

**NextGen Tutor** is a modern AI SaaS platform that enables candidates to master technical and behavioral interviews through **real-time voice AI coaching sessions**. Powered by **Google Gemini 2.5 Flash** and the native **Web Speech API**, it conducts live mock interviews, grades answers instantly, and delivers comprehensive PDF feedback reports.

> Built for developers, students, and professionals preparing for FAANG-tier and competitive job interviews.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎙️ **Real-Time Voice AI** | Live voice sessions powered by Gemini 2.5 Flash + Web Speech API |
| 🤖 **Multi-Persona AI Coaches** | Choose from 4 specialized AI mentors with distinct voices |
| 📅 **Dynamic & Scheduled Meetings** | Create instant sessions or schedule future meetings (15m–60m) |
| 🔔 **Convex Notifications** | Real-time meeting creation and schedule alerts |
| 📄 **PDF Reports** | Auto-generated session transcripts and AI feedback as PDFs |
| 📊 **Analytics Dashboard** | Readiness scores, session history, and performance tracking |
| 🗂️ **5 Coaching Tracks** | Lecture, Mock Interview, Q&A Practice, Language Skills, Wellness |
| 🔐 **Google OAuth** | Secure authentication via Stack Auth |
| 📱 **Fully Responsive** | Optimized for mobile, tablet and desktop |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **AI Voice Engine** | Google Gemini 2.5 Flash + Web Speech API |
| **Backend / DB** | Convex (real-time serverless database) |
| **Authentication** | Stack Auth (Google OAuth) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Radix UI + shadcn/ui |
| **Icons** | Lucide React |
| **PDF Generation** | jsPDF + jsPDF-AutoTable |
| **Deployment** | Vercel |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│    Next.js 16 (App Router)          │
│    Landing · Dashboard · Room       │
└──────────────────┬──────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
         ▼                    ▼
┌────────────────┐   ┌────────────────────┐
│  Convex DB     │   │  Gemini AI Engine  │
│  Users         │   │  Voice Coaching    │
│  Discussroom   │   │  Feedback Gen      │
│  Notifications │   │  Transcript        │
└────────────────┘   └────────────────────┘
         │
         ▼
┌─────────────────┐
│  Stack Auth     │
│  Google OAuth   │
└─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev/) account
- A [Stack Auth](https://stack-auth.com/) project
- A [Google AI Studio](https://aistudio.google.com/) Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/mkumar2004/AI-NextGen-Tutor.git
cd AI-NextGen-Tutor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your keys in `.env.local` (see [Environment Variables](#-environment-variables) below).

### 4. Set Up Convex Backend

```bash
npx convex dev --once
```

This pushes your schema and functions to your Convex cloud deployment.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file at the project root with the following keys:

```env
# Convex Database
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud

# Stack Auth (https://stack-auth.com)
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_your_key
STACK_SECRET_SERVER_KEY=ssk_your_key

# Google Gemini API (https://aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key

# OpenRouter (optional fallback)
OPENROUTER_API_KEY=sk-or-v1-your_key

# Groq (optional fast inference)
GROQ_API_KEY=gsk_your_key

# App URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GITHUB_URL=https://github.com/mkumar2004/AI-NextGen-Tutor
```

> See [`.env.example`](.env.example) for the full template.

---

## 📂 Project Structure

```
AI-NextGen-Tutor/
├── convex/                   # Convex backend functions & schema
│   ├── schema.js             # DB tables: Users, Discussroom, Notifications
│   ├── DicussRoom.jsx        # Meeting CRUD, Notifications
│   ├── FullHistory.jsx       # Session history queries
│   └── users.js              # User management
│
├── public/                   # Static assets & AI coach images
│
├── src/
│   ├── app/
│   │   ├── (main)/dashboard/ # Dashboard, History, Feedback, Discussion Room
│   │   ├── api/              # Gemini voice, AI feedback, chat routes
│   │   ├── page.jsx          # Landing page
│   │   ├── layout.js         # Root layout + metadata
│   │   └── globals.css       # Global styles + scrollbar
│   │
│   ├── components/
│   │   ├── layout/           # AppHeader, AppSidebar, NotificationDrawer
│   │   ├── features/
│   │   │   ├── dashboard/    # FeaturesAssistants, MeetingUrl, UserInputDialog
│   │   │   ├── discussion/   # Pdf report generator
│   │   │   └── feedback/     # FeedbackCard
│   │   └── ui/               # shadcn/ui components
│   │
│   └── constants/            # STAFF_MEMBERS, EXPERT_ASSISTANTS
│
├── middleware.jsx             # Stack Auth route protection
├── stack.js                  # Stack Auth server config
├── .env.example              # Environment variable template
└── package.json
```

---

## 🎯 Coaching Tracks

| Track | Description | Tag |
|---|---|---|
| 🎓 **Lecture on Topic** | Deep-dive technical explanations | Comprehensive |
| 🎭 **Mock Interview** | Live simulation with real-time scoring | Live Simulation |
| ❓ **Q&A Practice** | Rapid fire question & answer loops | Rapid Q&A |
| 🗣️ **Language Skill** | Communication and fluency coaching | Communication |
| 🧘 **Medication / Wellness** | Focus and stress management guidance | Wellness & Health |

---

## 🗺️ Roadmap

- [ ] Resume upload & AI scoring
- [ ] Multi-language interview support
- [ ] Leaderboard & peer comparison
- [ ] Email reminders for scheduled meetings
- [ ] Admin analytics panel
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

```bash
# Fork → Clone → Branch → Commit → PR
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [MK TECH TAMIZHA](https://github.com/mkumar2004)

⭐ **Star this repo if you found it helpful!**

</div>
]]>
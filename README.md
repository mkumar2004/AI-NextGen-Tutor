<div align="center">

<img src="https://raw.githubusercontent.com/mkumar2004/AI-NextGen-Tutor/main/public/homeicon.svg" alt="NextGen Tutor Logo" width="100" height="100" />

# ⚡ NextGen Tutor

### 🎙️ *Next-Generation Real-Time Voice AI Interview Coaching Platform*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-EE342F?style=for-the-badge&logo=convex&logoColor=white)](https://convex.dev/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Stack Auth](https://img.shields.io/badge/Stack%20Auth-OAuth-6366F1?style=for-the-badge)](https://stack-auth.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

<br/>

[🌐 **Live Demo**](https://nextgen-tutor.vercel.app) • [📂 **GitHub Repo**](https://github.com/mkumar2004/AI-NextGen-Tutor) • [🐛 **Report Bug**](https://github.com/mkumar2004/AI-NextGen-Tutor/issues) • [✨ **Request Feature**](https://github.com/mkumar2004/AI-NextGen-Tutor/issues)

</div>

---

## 📖 Overview

**NextGen Tutor** is a modern full-stack AI SaaS platform designed to help developers, students, and job seekers master technical and behavioral interviews through **natural, real-time voice conversations**. 

Powered by **Google Gemini 2.5 Flash** and the **Web Speech API**, NextGen Tutor simulates live interviewers that listen, reply with natural voice, evaluate answers in real-time, generate automated scoring metrics, and produce downloadable PDF interview evaluations.

---

## 🌟 Key Features

- 🎙️ **Real-Time Voice AI Simulation** — Low-latency voice discussions and mock tests with Gemini 2.5 Flash.
- 🧑‍🏫 **Multi-Persona AI Coaches** — Choose between specialized mentors (Krish, Sarah, John, Emily) with tailored speech personas.
- ⏱️ **Dynamic Meeting Duration & Expiry** — Flexible session setups (15m, 30m, 45m, 60m) with countdown badges and auto-expiry.
- 📅 **Scheduled Meetings** — Switch seamlessly between instant rooms and scheduled future interview slots.
- 🔔 **Convex Real-Time Notifications** — Instant notification drawer alerting you of newly scheduled or active rooms.
- 📊 **Readiness & Telemetry Analytics** — Track technical clarity, communication scores, and improvement trends.
- 📄 **Exportable PDF Reports** — Automatically download detailed transcript breakdowns and evaluation summaries.
- 🔒 **Stack Auth (Google OAuth)** — Seamless authentication with protected routes via Next.js middleware.
- 🎨 **Modern Glassmorphic UI** — Sleek dark landing page, custom slim scrollbar, and modern SaaS dashboard.

---

## 🛠️ Tech Stack

```text
Frontend:       Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS v4, Lucide Icons, Radix UI
Backend & DB:   Convex (Real-time reactive cloud database & serverless mutations/queries)
AI & Speech:    Google Gemini 2.5 Flash, Web Speech API (Recognition & SpeechSynthesis)
Auth & Session: Stack Auth (Google OAuth2 + Session Tokens)
Export & PDF:   jsPDF, jsPDF-AutoTable
Deployment:     Vercel
```

---

## 🗺️ Coaching Tracks

| Track | Tag | Focus Area |
| :--- | :--- | :--- |
| 🎓 **Lecture on Topic** | `Comprehensive` | Detailed concept deep dives and tech architecture walkthroughs |
| 💼 **Mock Interview** | `Live Simulation` | FAANG-style behavioral and technical live question loops |
| ⚡ **Q&A Practice** | `Rapid Q&A` | Rapid-fire concept checks and core fundamentals testing |
| 🗣️ **Language Skill** | `Fluency` | English articulation, verbal fluency, and professional pacing |
| 🧘 **Medication & Wellness** | `Health` | Focus techniques, breath pacing, and anti-anxiety interview prep |

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/mkumar2004/AI-NextGen-Tutor.git
cd AI-NextGen-Tutor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env.local` file by copying the provided template:

```bash
cp .env.example .env.local
```

Fill in your configuration:

```env
# Convex Backend
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_your_publishable_key
STACK_SECRET_SERVER_KEY=ssk_your_secret_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Push Convex schema & functions

```bash
npx convex dev --once
```

### 5. Start the development server

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```text
AI-NextGen-Tutor/
├── convex/                   # Convex cloud backend schema, queries & mutations
│   ├── schema.js             # Tables: Users, Discussroom, Notifications
│   ├── DicussRoom.jsx        # Room creation, dynamic duration, notifications
│   ├── FullHistory.jsx       # User history queries
│   └── users.js              # User profiles & credit state
├── public/                   # Static icons, avatars, and assets
├── src/
│   ├── app/
│   │   ├── (main)/dashboard/ # Career dashboard, discussion room, history, feedback
│   │   ├── api/              # AI routes & Gemini voice endpoints
│   │   ├── globals.css       # Global styles & custom light gray scrollbar
│   │   ├── layout.js         # Root layout with title & logo favicon metadata
│   │   └── page.jsx          # Dark AI SaaS Landing Page
│   ├── components/
│   │   ├── features/         # FeaturesAssistants, MeetingUrl, UserInputDialog, Pdf
│   │   ├── layout/           # AppHeader, AppSidebar, NotificationDrawer
│   │   └── ui/               # Reusable UI primitives
│   └── constants/            # Mentors and coaching track configurations
├── middleware.jsx             # Stack Auth route protection
└── stack.js                  # Stack server configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/mkumar2004/AI-NextGen-Tutor/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by [**MK TECH TAMIZHA**](https://github.com/mkumar2004)

⭐ *If you like this project, don't forget to give it a star!* ⭐

</div>

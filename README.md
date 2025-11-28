# 🚀 NextGen Placement – AI-Powered SaaS for College Placement & Career Readiness  
A modern SaaS platform built using **Next.js**, **Convex backend**, and **AI Agents** (via OpenRouter / any OpenAI-compatible LLM).  
Designed for **colleges, placement cells, and students** to improve hiring outcomes through automation and intelligent workflows.

---

# 📘 Overview
**NextGen Placement** helps colleges automate placement workflows:

- Student profiling  
- Resume scoring  
- Mock interviews  
- Job-role matching  
- Admin analytics & dashboards  

All powered by a **scalable serverless backend (Convex)** and **LLM-driven AI agents**.

---

# 🧩 Problem & Solution

## ❌ The Problem
- Manual student shortlisting  
- Weak resume feedback loops  
- Students unprepared for interviews  
- Recruiters struggle to filter candidates  
- Placement teams lack analytics  

## ✅ The Solution
- AI-generated resume corrections  
- Automated job matching using skill scoring  
- Mock interview chatbot  
- Placement dashboards for staff  
- Convex backend for real-time data access  

---

# ⚡ Features
### Students
- ✨ Create profiles  
- 📄 Upload resumes  
- 🤖 AI resume evaluation  
- 🎤 AI mock interviews  
- 🔍 Job recommendations  

### College/Placement Cell
- 📊 Dashboard & Insights  
- 🧪 Student performance tracking  
- 📝 Job posting management  
- 🔎 Auto-eligibility & shortlisting  

### Recruiters
- 🎯 View shortlisted candidates  
- 📈 Skill-score visualizations  
- 🗂 Compare candidate profiles  

---

# 🏗 System Architecture
               ┌──────────────────────────────┐
               │          Next.js              │
               │  Frontend (Students/Admin)    │
               └───────────────┬──────────────┘
                               │
                               ▼
                     ┌─────────────────┐
                     │    Convex DB    │
                     │  Backend APIs   │
                     └────────┬────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │      AI Agent Layer      │
                 │ (Node.js Server Adapter) │
                 └──────────┬──────────────┘
                            │
                            ▼
              ┌──────────────────────────────┐
              │ OpenRouter / OpenAI / LLMs   │
              │ Model Provider Gateway       │
              └──────────────────────────────┘

---

# 🔗 AI Integration – OpenRouter  
Used for:
- Resume analysis  
- Mock interview  
- Skill assessment  
- Recommendations  

**OpenRouter Docs:** https://openrouter.ai/docs

---

# 🔧 Environment Variables (Frontend + Backend)
## 📌 Root `.env.local`
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud

NEXT_PUBLIC_OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions

OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_APP_ENV=local

CONVEX_SITE_URL=http://localhost:3000

NODE_ENV=development







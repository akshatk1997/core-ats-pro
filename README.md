# CORE ATS RESUME & INTELLIGENCE PLATFORM 🚀

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deploys%20Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://core-ats-pro.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Interactive Visual Architecture & System Onboarding for Serious Professionals Targeting Top 1% Roles.**  
> Understand how enterprise Applicant Tracking Systems (ATS) scan, parse, and score candidate resumes. Practice live video & voice AI interviews with real-time facial telemetry, generate Overleaf-compatible LaTeX source code, and track your career pipeline—all in one place.

---

## 🌟 Live Public Links

- **Production App on Vercel**: [https://core-ats-pro.vercel.app](https://core-ats-pro.vercel.app)
- **GitHub Repository**: [https://github.com/akshatk1997/core-ats-pro](https://github.com/akshatk1997/core-ats-pro)
- **Local Dev Server Endpoints**:
  - Port 3000: [http://localhost:3000](http://localhost:3000)
  - Port 4000: [http://localhost:4000](http://localhost:4000)

---

## ✨ Core Platform Modules & Feature Matrix

### 1. 📄 100% Dynamic Multi-Format Resume Parser
- **File Format Support**: `.pdf`, `.docx`, `.txt`, and `.json`.
- **Authentic Extraction**: Line-by-line regex & JSON parsing for Contact Headers, Professional Summary, Work Experience, Education, Skills, Projects, and Certifications.
- **Zero Dummy Data**: Displays exact parsed candidate information across all platform screens without hardcoded placeholders.

### 2. 🎯 Real-Time ATS Compatibility Engine & Score Diagnostic
- **Mathematical 6-Parameter Evaluation**:
  1. **Formatting & Parser Readability** (Max 25 pts)
  2. **Keyword Alignment** (Max 25 pts)
  3. **Job Requirement Alignment** (Max 20 pts)
  4. **Experience Relevance** (Max 15 pts)
  5. **Structure & Completeness** (Max 10 pts)
  6. **Quantifiable Impact & Metrics** (Max 5 pts)
- **Live Keyword Frequency Analyzer**: Highlights matched hard skills, missing critical keywords, and soft skill density.

### 3. 🎥 AI Video & Voice Mock Interviewer with Facial Telemetry
- **Real-Time Voice-to-Text (`SpeechRecognition`)**: Candidate speech is transcribed live into structured text.
- **Human AI Interviewer Persona**: Realistic Speech Synthesis (`SpeechSynthesisUtterance`) with female/male voice selectors and 4 interviewer states (*Listening & Nodding*, *Reviewing Resume*, *Asking Question*, *Evaluating STAR Answer*).
- **Webcam Facial Telemetry**: Tracks camera lens eye contact percentage (0-100%), smile warmth index, and posture cadence.
- **Dynamic Post-Interview Performance Scorecard**: Evaluates speech cadence, STAR methodology usage, technical skill coverage, and quantifiable metric count.

### 4. 📝 Overleaf-Compatible LaTeX Code Generator
- Generates clean, production-ready LaTeX source code optimized for enterprise ATS parsers (`pdflatex` compatible).
- 1-click clipboard copy for Overleaf and TexMaker editing.

### 5. 💼 LinkedIn Executive Positioning & Keyword Optimizer
- Audits public profile headlines, about summaries, and experience keywords.
- Generates optimized headline alternatives tailored for recruiter search algorithms.

### 6. 📊 Application Pipeline & Job Matcher
- Tracks target roles, interview schedules, offer stages, and job description alignment matrices.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology Used |
|---|---|
| **Framework** | Next.js 14.2.15 (App Router) |
| **Language** | TypeScript 5.6.3 |
| **Styling & UI** | TailwindCSS 3.4, Lucide React Icons, Framer Motion |
| **Speech API** | HTML5 Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) |
| **Telemetry & Video** | HTML5 `navigator.mediaDevices.getUserMedia` |
| **Backend Endpoints** | Next.js Serverless API Routes |

---

## 📡 Backend API Endpoints

```http
GET  /api/health            # Service status & active endpoints health check
POST /api/analyze-resume    # Real-time ATS resume breakdown calculation
POST /api/ai-improve        # AI bullet point optimization & metric enhancement
POST /api/export-latex      # Generates ATS-friendly LaTeX source code
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/akshatk1997/core-ats-pro.git
   cd core-ats-pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) or [http://localhost:4000](http://localhost:4000).

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## ☁️ Deploying to Vercel

This repository is pre-configured for seamless Vercel deployment:

```bash
npm install -g vercel
vercel --prod
```

Or connect the repository `akshatk1997/core-ats-pro` directly in your [Vercel Dashboard](https://vercel.com/new).

---

## 🔒 Privacy & Free Access

- **100% Free Lifetime Access**: No paywalls, subscription popups, or pro locks.
- **Client-Side Privacy**: Uploaded resume data is parsed locally in browser memory (`localStorage`) and is never sold or stored externally.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.

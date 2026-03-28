# 🧠 NeuroVerse AI

**An Immersive 3D AI-Powered Learning Platform**

Built for the **EdTech & Learning Innovation** hackathon.

![NeuroVerse AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)

## ✨ Features

### 🌌 3D Learning Universe
- Futuristic landing page with Three.js particle field
- Subject exploration as glowing knowledge zones
- Framer Motion animations throughout

### 🤖 AI Mentor (Google Gemini)
- Chat with an AI tutor powered by Gemini 1.5 Flash
- 5 explanation styles: Simple, Detailed, Exam-Oriented, Beginner-Friendly, Real-World
- Auto-generated quiz questions
- Personalized study recommendations

### 🧪 Interactive Simulations
- Sorting Algorithm Visualizer (Bubble, Selection, Insertion Sort)
- Real-time animation with speed and size controls
- AI Mentor integrated into simulations

### 🤝 SkillSwap Network
- Skill-based matching algorithm
- Match percentage calculation
- Send connection requests
- Profile cards with skill tags

### 📊 Progress Tracking
- Visual progress dashboards
- Subject-wise breakdown
- Weak/Strong area identification
- XP and badge system

### 🔐 Authentication
- JWT-based signup/login
- Protected routes
- User profiles with skill management

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| 3D | React Three Fiber, Three.js |
| Backend | Next.js API Routes |
| Database | MongoDB with Mongoose |
| AI | Google Gemini API |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| State | Zustand, React Context |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API Key

### Setup

1. **Clone and install:**
```bash
cd neuroverse-ai
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/neuroverse
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Start development:**
```bash
npm run dev
```

4. **Seed sample data** (optional):
   - Navigate to the SkillSwap page
   - Click "Seed Sample Users" button
   - Or POST to `http://localhost:3000/api/seed`

5. **Demo login:**
   - Email: `alex@neuroverse.dev`
   - Password: `password123`

## 📁 Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   │   ├── auth/     # signup, login, me
│   │   ├── gemini/   # chat, quiz
│   │   ├── skillswap/# match, request, requests
│   │   ├── progress/ # update, stats
│   │   └── seed/     # sample data
│   ├── auth/         # login, signup pages
│   ├── dashboard/    # main dashboard
│   ├── mentor/       # AI chat interface
│   ├── simulation/   # sorting visualizer
│   ├── skillswap/    # matching network
│   ├── progress/     # learning analytics
│   ├── profile/      # user profile
│   └── subjects/     # topic exploration
├── components/
│   ├── layout/       # Navbar, Footer
│   ├── three/        # 3D components
│   └── ui/           # GlassCard, SkillTag, etc.
├── context/          # AuthContext
├── data/             # subjects, skills
├── lib/              # mongodb, auth, gemini
└── models/           # Mongoose schemas
```

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/gemini/chat | AI mentor chat |
| POST | /api/gemini/quiz | Generate quiz |
| GET | /api/skillswap/match | Find skill matches |
| POST | /api/skillswap/request | Send connection request |
| GET | /api/skillswap/requests | Get requests |
| POST | /api/progress/update | Update topic progress |
| GET | /api/progress/stats | Get progress stats |
| POST | /api/seed | Seed sample users |

## 🎨 Design System

- **Theme:** Dark futuristic with blue/purple/cyan glow
- **Glass morphism** cards with blur effects
- **Gradient text** for headings
- **Glow effects** on hover states
- **Custom animations** with Framer Motion
- **3D particles** with React Three Fiber
- **Responsive** across all screen sizes

## 📝 License

Built for educational purposes — EdTech & Learning Innovation Hackathon 2024.

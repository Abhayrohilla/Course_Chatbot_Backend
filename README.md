# 🎓 Course Buddy - AI Course Recommendation Chatbot

An intelligent AI-powered chatbot that helps users discover and get personalized recommendations for academic courses based on their interests, skills, and career goals.

![Demo](https://design-pathfinder-bot.lovable.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **Smart Conversations** | Natural language understanding for course queries |
| 🔍 **Semantic Search** | AI-powered search using embeddings (finds related courses even without exact matches) |
| 📚 **Course Recommendations** | Suggests courses with "Exact" or "Related" match confidence |
| 🎯 **Domain & Skill Selection** | Interactive cards for filtering by domain and skills |
| 🎨 **Modern UI** | Clean, responsive interface with Slate/Blue theme |
| 💬 **Interactive Chat** | Real-time chat interface with typing indicators |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Python 3.9+ | Core programming language |
| FastAPI | High-performance web framework |
| Sentence Transformers | AI embeddings (all-MiniLM-L6-v2) |
| Pandas | Data processing |
| PyTorch | ML framework for embeddings |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Modern CSS | Styling with Flexbox & CSS Variables |

---

## 📁 Project Structure

```
Company chatbot/
├── 📄 README.md                    # This file
├── 📄 requirements.txt             # Python dependencies
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 app/                         # Backend (Python/FastAPI)
│   ├── __init__.py
│   ├── main.py                     # FastAPI entry point
│   ├── config/
│   │   └── settings.py             # Configuration settings
│   ├── core/
│   │   ├── chatbot.py              # Conversation engine
│   │   └── search_engine.py        # Semantic search with embeddings
│   └── data/
│       ├── loader.py               # Excel data loader
│       └── Academic AI agent Data_2026.xlsx  # Course dataset
│
└── 📂 frontend/                    # Frontend (React/Vite)
    ├── package.json                # Node.js dependencies
    ├── vite.config.js              # Vite configuration
    ├── index.html                  # HTML entry point
    ├── public/                     # Static assets
    └── src/
        ├── main.jsx                # React entry point
        ├── App.jsx                 # Main App component
        ├── App.css                 # App styles
        ├── index.css               # Global styles
        ├── assets/                 # Images & icons
        └── components/             # React components
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Python** | 3.9 or higher | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9 or higher | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### Verify Installation

Open terminal/command prompt and run:

```bash
# Check Python version
python --version
# Should output: Python 3.9.x or higher

# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: 9.x.x or higher
```

---

## 🚀 Installation & Setup

### Step 1: Clone/Download the Project

```bash
# If you received the project as a ZIP file, extract it
# OR clone from repository:
git clone <repository-url>
cd "Company chatbot"
```

### Step 2: Setup Backend (Python)

```bash
# Navigate to project root
cd "Company chatbot"

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

> ⏳ **Note:** First-time installation may take 5-10 minutes as it downloads AI models (~400MB).

### Step 3: Setup Frontend (React)

```bash
# Navigate to frontend folder
cd frontend

# Install Node.js dependencies
npm install

# Go back to project root
cd ..
```

---

## ▶️ Running the Application

You need to run **both** the backend and frontend servers:

### Terminal 1: Start Backend Server

```bash
# Make sure you're in the project root folder
cd "Company chatbot"

# Activate virtual environment (if not already active)
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Start the FastAPI backend server
python -m uvicorn app.main:app --reload --port 8000
```

You should see:
```
[OK] Loaded XX courses from Excel
API ready!
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2: Start Frontend Server

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd "Company chatbot/frontend"

# Start the React development server
npm run dev
```

You should see:
```
VITE v7.x.x ready in XXX ms
➜ Local:   http://localhost:5173/
```

### Access the Application

Open your browser and go to: **http://localhost:5173**

---

## 📡 API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check - verify API is running |
| `/api/search` | POST | Chat & course search endpoint |
| `/api/filters` | GET | Get available filter options |
| `/api/suggestions` | GET | Get dynamic chat suggestions |
| `/api/courses/all` | GET | Get all courses in database |

### Interactive API Docs

When backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🔧 Troubleshooting

### Common Issues & Solutions

<details>
<summary><b>❌ "Python not recognized" error</b></summary>

**Solution:** Add Python to your system PATH:
1. Reinstall Python and check "Add Python to PATH"
2. Or manually add `C:\Users\<username>\AppData\Local\Programs\Python\Python3x` to PATH
</details>

<details>
<summary><b>❌ "npm not recognized" error</b></summary>

**Solution:** 
1. Reinstall Node.js from [nodejs.org](https://nodejs.org/)
2. Restart your terminal/command prompt after installation
</details>

<details>
<summary><b>❌ Backend shows "Excel file not found"</b></summary>

**Solution:** Ensure the data file exists at:
`app/data/Academic AI agent Data_2026.xlsx`
</details>

<details>
<summary><b>❌ Frontend shows "Network Error"</b></summary>

**Solution:** 
1. Make sure backend is running on port 8000
2. Check if any firewall is blocking the connection
</details>

<details>
<summary><b>❌ Slow first load / AI model downloading</b></summary>

**This is normal!** On first run, the system downloads AI models (~400MB). 
Subsequent runs will be much faster.
</details>

---

## 📧 Contact & Support

For questions or issues, contact:
- **Developer:** [Your Name]
- **Email:** [Your Email]

---

## 📝 License

This project is proprietary. All rights reserved.

---

*Built with ❤️ using FastAPI + React*

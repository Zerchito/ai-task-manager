# AI Task Manager

AI-powered task manager that automatically prioritizes and breaks down your tasks using LLM analysis.

🚀 **Live demo:** https://ai-task-manager-vercel.vercel.app

## Features
- Create tasks with natural language descriptions
- AI automatically assigns priority and generates subtasks
- Mark tasks as complete or delete them
- Clean Architecture backend with full test support

## Tech Stack
**Frontend:** React · TypeScript · Vite · Tailwind CSS  
**Backend:** Node.js · TypeScript · Express · MongoDB  
**AI:** Groq API (Llama 3.3 70B)  
**Deploy:** Vercel · Render · MongoDB Atlas

## Run locally

**Backend:**
\```bash
cd server
cp .env.example .env  # add your keys
pnpm install
pnpm dev
\```

**Frontend:**
\```bash
cd client
cp .env.example .env  # add backend URL
pnpm install
pnpm dev
\```

## Architecture
\```
client/          # React + TypeScript frontend
server/
└── src/
    ├── tasks/
    │   ├── controller/    # HTTP layer
    │   ├── service/       # Business logic
    │   ├── repository/    # MongoDB access
    │   └── domain/        # Entities & validations
    ├── ai/                # Groq integration
    └── shared/            # DB connection, middleware
\```
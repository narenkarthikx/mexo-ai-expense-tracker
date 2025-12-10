# 📚 Mexo Documentation

Complete documentation for the expense tracker application.

## 📖 Guides

- **[Setup Guide](./setup.md)** - Installation and configuration
- **[Database Guide](./database.md)** - Database schema and setup
- **[AI Integration](./ai-integration.md)** - Receipt scanning with Google Gemini AI

## 🚀 Quick Start

```bash
git clone https://github.com/narenkarthikx/Expense-tracker-ai.git
cd "Mexo - My Expenses Optimized"
pnpm install
cp .env.local.example .env.local
# Edit .env.local with your credentials
# Run database/setup.sql in Supabase
pnpm dev
```

## 🏗️ Project Structure

```
├── app/                  # Next.js pages
├── components/           # React components
├── database/            # SQL setup scripts
├── docs/                # Documentation
└── lib/                 # Utilities
```

## 🛠️ Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + Shadcn/ui
- Supabase (PostgreSQL + Auth)
- Google Gemini 2.5 Flash

---

[← Back to Main README](../README.md)
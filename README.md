# 💰 ExpenseAI - Smart Expense Tracker with AI Receipt Processing

A modern, AI-powered expense tracking Progressive Web App (PWA) built with Next.js 16 and Google Gemini AI.

## ✨ Features

### 🤖 AI-Powered Receipt Processing
- **Automated Data Extraction**: Upload receipt photos and let AI extract all details
- **Smart Categorization**: Automatic expense categorization
- **Multi-format Support**: Works with various receipt formats and languages

### 💰 Financial Management
- **Real-time Budget Tracking**: Set and monitor spending limits
- **Category Management**: Custom categories with icons and colors
- **Expense Analytics**: Visual charts and spending trends
- **Monthly/Yearly Reports**: Comprehensive financial insights

### 📱 Progressive Web App
- **Offline Capable**: Works without internet connection
- **Mobile Optimized**: Native app-like experience
- **Cross-Platform**: Works on desktop, tablet, and mobile

### 🔐 Secure & Private
- **Supabase Authentication**: Secure user management
- **Privacy-first**: Your data stays private
- **Real-time Sync**: Multi-device synchronization

## 🚀 Quick Start

Ready to get started? Check out our detailed [Setup Guide](docs/setup.md).

**TL;DR:**
```bash
git clone https://github.com/narenkarthikx/expense-tracker-ai.git
cd expense-tracker-pwa
pnpm install
cp .env.local.example .env.local
# Edit .env.local with your API keys
pnpm dev
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components  
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI**: Google Gemini AI for receipt processing
- **PWA**: Service workers, offline support, installable

## � How It Works

### Smart Receipt Processing
1. **Take a Photo**: Snap or upload receipt images
2. **AI Extraction**: Google Gemini AI reads and structures the data
3. **Auto-populate**: All fields filled automatically (store, items, prices, totals)
4. **Review & Save**: Quick review and save to your expense tracker

### Budget Management  
1. **Set Limits**: Define monthly/weekly budgets per category
2. **Track Spending**: Real-time monitoring of your expenses
3. **Get Alerts**: Notifications when approaching budget limits
4. **Visual Analytics**: Charts and trends to understand your spending patterns

### Expense Categories
- **Custom Categories**: Create your own with colors and icons
- **Smart Suggestions**: AI suggests categories based on receipt content
- **Flexible Organization**: Tag and filter expenses your way

## �️ Database Schema

Simple, efficient database structure:

- **👤 Users**: Authentication and user profiles
- **🏷️ Categories**: Custom expense categories  
- **💳 Expenses**: Individual expense records with AI-extracted data
- **🎯 Budgets**: Spending limits and tracking
- **🛒 Wishlist**: Shopping lists and financial goals

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms
- **Netlify**: Connect your Git repository
- **Railway**: One-click deployment  
- **Heroku**: Use Node.js buildpack

**Important**: Set these environment variables in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_GEMINI_API_KEY`

## 📚 Documentation

- **[Setup Guide](docs/setup.md)**: Complete development environment setup
- **[Database Guide](docs/database.md)**: Database schema and configuration
- **[AI Integration](docs/ai-integration.md)**: Google Gemini AI receipt processing
- **[Documentation Hub](docs/README.md)**: Full documentation index

## 🆘 Common Issues

**Build errors?** 
- Ensure Node.js 18+ is installed
- Try: `rm -rf .next node_modules && npm install`

**Supabase connection issues?**
- Check your URL and keys in `.env.local`
- Verify database tables are created

**AI features not working?**
- Confirm your Google Gemini API key is valid
- Check the model name is correct (gemini-2.5-flash)

## 🤝 Contributing

We welcome contributions! Please see our [Documentation Hub](docs/README.md) for technical details and contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, Supabase, and Google Gemini AI**

⭐ Star this repo if you find it helpful!
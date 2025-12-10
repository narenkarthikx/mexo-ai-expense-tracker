# 💰 Mexo - My Expenses Optimized

> Smart AI-Powered Expense Tracker with Receipt Scanning

A modern Progressive Web App (PWA) built with Next.js 15, Supabase, and Google Gemini AI for intelligent expense tracking and financial management.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange)](https://ai.google.dev/)

## ✨ Key Features

### 🤖 AI-Powered Receipt Scanning
- **Instant Data Extraction**: Snap or upload receipts - AI extracts store, items, quantities, prices, and totals automatically
- **High Accuracy**: Advanced OCR with Google Gemini 2.5 Flash for precise data capture
- **Smart Categorization**: Auto-categorizes expenses (Groceries, Dining, Transport, etc.)
- **Quantity Detection**: Extracts item quantities and calculates totals
- **Multi-format Support**: Works with printed and handwritten receipts

### 💰 Financial Management
- **Custom Categories**: Create and manage your own expense categories
- **Budget Tracking**: Set spending limits by category with visual progress indicators
- **Real-time Analytics**: Interactive charts and spending trends
- **Date Range Reports**: Export PDF reports for any custom date range
- **Monthly Overview**: Dashboard with spending insights and statistics

### 📱 Progressive Web App
- **Install on Any Device**: Works like a native app on mobile and desktop
- **Offline Support**: Access your data even without internet
- **Camera Integration**: Direct camera access for quick receipt capture
- **Responsive Design**: Optimized for all screen sizes
- **Mobile-First UI**: Touch-friendly interface with smooth animations

### 🔐 Security & Privacy
- **Secure Authentication**: Supabase auth with email/password
- **Row Level Security**: Your data is isolated and protected
- **Encrypted Storage**: All sensitive data encrypted at rest
- **No Data Sharing**: Your financial information stays private

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account ([free tier available](https://supabase.com))
- Google Gemini API key ([get one free](https://ai.google.dev/))

### Installation

```bash
# Clone repository
git clone https://github.com/narenkarthikx/Expense-tracker-ai.git
cd "Mexo - My Expenses Optimized"

# Install dependencies
pnpm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Setup database
# Run database/setup.sql in Supabase SQL Editor

# Start development server
pnpm dev
```

Visit `http://localhost:3000` and start tracking expenses!

📖 **Detailed Setup**: See [Setup Guide](docs/setup.md) for complete instructions.

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Language** | TypeScript 5.0 |
| **Styling** | Tailwind CSS 3, Shadcn/ui |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **AI/ML** | Google Gemini 2.5 Flash |
| **PDF Generation** | jsPDF, jsPDF-AutoTable |
| **State Management** | React Hooks, Context API |
| **Deployment** | Vercel (optimized) |

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

## 🌟 Recent Updates

### Latest Features (Dec 2024)
- ✅ **Custom Categories**: Users can create/edit/delete their own categories
- ✅ **Quantity Display**: Shows item quantities in expense details (e.g., "2× Rice")
- ✅ **PDF Export**: Select custom date ranges for expense reports
- ✅ **Mobile Dropdown Fix**: Improved z-index for better mobile UX
- ✅ **Dynamic Budget**: Budget page now uses user's custom categories
- ✅ **Better Analytics**: Enhanced PDF reports with category breakdown

### Improvements
- 🔧 Fixed jsPDF autoTable import for proper PDF generation
- 🔧 Improved receipt extraction accuracy with detailed AI prompts
- 🔧 Better responsive layout for analytics page
- 🔧 Image compression for camera uploads (reduces API load)

## 🚀 Deployment

### Deploy to Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/narenkarthikx/Expense-tracker-ai)

```bash
## 📚 Documentation

- **[Setup Guide](docs/setup.md)** - Installation and configuration
- **[Database Guide](docs/database.md)** - Database schema and setup  
- **[AI Integration](docs/ai-integration.md)** - Receipt scanning details

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

**Supabase Connection Issues**
- Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check if database tables exist (run `database/user-categories.sql`)
- Ensure RLS policies are enabled

**AI Receipt Processing Fails**
- Confirm `GOOGLE_GEMINI_API_KEY` is valid
- Check rate limits (free tier: 5 RPM, 20 RPD)
- First camera photo always works; second may fail due to rate limits
- Use image compression to reduce API usage

**PDF Export Not Working**
- Ensure `jspdf` and `jspdf-autotable` are installed
- Check browser console for errors
- Verify date range selection is valid

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [docs/README.md](docs/README.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend platform
- [Google Gemini](https://ai.google.dev/) - AI models
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Support

- 🐛 [Report Bug](https://github.com/narenkarthikx/Expense-tracker-ai/issues)
- 💡 [Request Feature](https://github.com/narenkarthikx/Expense-tracker-ai/issues)
- 📧 Contact: [narenkarthikx@gmail.com](mailto:narenkarthikx@gmail.com)

---

<div align="center">

**Built with ❤️ using Next.js, Supabase, and Google Gemini AI**

⭐ Star this repo if you find it helpful!

[Demo](https://expense-tracker-ai.vercel.app) • [Documentation](docs/README.md) • [Issues](https://github.com/narenkarthikx/Expense-tracker-ai/issues)

</div>

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
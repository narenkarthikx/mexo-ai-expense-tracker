# Expense Tracker PWA Documentation

Welcome to the comprehensive documentation for the Expense Tracker Progressive Web App (PWA). This documentation provides detailed information for developers, users, and contributors.

## 📚 Documentation Structure

### For Developers
- **[Setup & Installation](./setup.md)** - Complete development environment setup
- **[Database Guide](./database.md)** - Database schema, setup, and management
- **[API Reference](./api.md)** - All API endpoints and usage
- **[AI Integration](./ai-integration.md)** - Google Gemini AI receipt processing
- **[Architecture](./architecture.md)** - Application structure and design patterns

### For Users
- **[User Guide](./user-guide.md)** - How to use the application
- **[Features](./features.md)** - Complete feature overview
- **[FAQ](./faq.md)** - Frequently asked questions

### For Contributors
- **[Contributing](./contributing.md)** - How to contribute to the project
- **[Development Workflow](./workflow.md)** - Git workflow and best practices
- **[Testing](./testing.md)** - Testing guidelines and procedures

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker-pwa.git
   cd expense-tracker-pwa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   - Follow the [Database Guide](./database.md)
   - Run the complete setup script in your Supabase instance

4. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 🔧 Key Features

- **💰 Expense Tracking** - Manual and AI-powered receipt scanning
- **📊 Analytics** - Detailed spending insights and trends
- **🎯 Budget Management** - Set and track spending limits
- **📱 PWA Support** - Install as native app on mobile devices
- **🤖 AI Receipt Processing** - Automatic expense extraction from receipts
- **🔒 Secure Authentication** - Supabase auth integration

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Google Gemini AI (gemini-2.5-flash model)
- **Deployment**: Vercel (recommended)
- **Package Manager**: pnpm

## 📖 Additional Resources

- [Project README](../README.md) - Basic project information
- [Environment Variables](./environment.md) - Complete env setup guide
- [Deployment Guide](./deployment.md) - Production deployment instructions
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

## 🤝 Support

- Create an [issue](https://github.com/yourusername/expense-tracker-pwa/issues) for bug reports
- Join our [discussions](https://github.com/yourusername/expense-tracker-pwa/discussions) for questions
- Check the [FAQ](./faq.md) for common questions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
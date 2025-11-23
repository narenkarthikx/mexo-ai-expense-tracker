# Installation Guide

Simple step-by-step installation instructions for ExpenseAI.

## Prerequisites

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **Supabase account** - [Create free account](https://supabase.com)
- **OpenAI API key** - [Get from OpenAI Platform](https://platform.openai.com/api-keys)

## Quick Installation

### 1. Clone & Install Dependencies

```bash
git clone <your-repository-url>
cd expense-tracker-pwa
npm install
```

### 2. Environment Configuration

```bash
# Copy the environment template
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration  
OPENAI_API_KEY=sk-your-openai-api-key
```

### 3. Get Your API Keys

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for project setup to complete (2-3 minutes)
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key
5. Paste them into `.env.local`

#### OpenAI API Key
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Copy the key and paste it into `.env.local`

### 4. Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the entire contents of `scripts/init-database.sql`
4. Paste and run the SQL script
5. This creates all required tables and indexes

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verification

Test that everything is working:

1. **Homepage**: Should show login/signup forms
2. **Sign Up**: Create a new account  
3. **Dashboard**: Should redirect after successful login
4. **AI Features**: Upload a receipt image to test AI processing (requires OpenAI key)

## Troubleshooting

### Common Issues

**Development server warnings:**
- `Next.js inferred workspace root` warning: This appears if there are multiple lockfiles in parent directories. It doesn't affect functionality.
- `middleware convention is deprecated` warning: The app uses standard middleware which still works perfectly.

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Supabase connection errors:**
- Double-check your URL and anon key in `.env.local`
- Ensure the database tables were created successfully

**AI receipt processing not working:**
- Verify your OpenAI API key is correct
- Check you have sufficient OpenAI credits
- Ensure the image is in JPG/PNG format

**Build errors:**
```bash
rm -rf .next
npm run build
```

### Environment Variables

Required variables in `.env.local`:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `OPENAI_API_KEY` | OpenAI API key for AI features | OpenAI Platform → API Keys |

### Getting Help

- Check the [Development Guide](DEVELOPMENT.md) for technical details
- Review the main [README](README.md) for features and usage
- Create an issue on GitHub if you encounter problems

## Next Steps

After installation:

1. **Customize Categories**: Add your own expense categories
2. **Set Budgets**: Create monthly/weekly spending limits  
3. **Test AI**: Upload receipt photos to test AI extraction
4. **Explore Features**: Try all the dashboard features

## Production Deployment

For production deployment, see the deployment section in [README.md](README.md#deployment).

The most common platforms:
- **Vercel**: `npx vercel --prod`
- **Netlify**: Connect your Git repository
- **Railway**: One-click deployment

Remember to set your environment variables in your hosting platform!
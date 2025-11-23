# Development Guide

Technical documentation for developers working on ExpenseAI.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 Vision
- **Styling**: Tailwind CSS + Shadcn/ui
- **PWA**: Next.js PWA plugin

## Project Structure

```
expense-tracker-pwa/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with AuthProvider
│   ├── page.tsx                 # Landing/auth page
│   ├── api/                     # API routes
│   │   └── process-receipt/     # AI receipt processing
│   ├── dashboard/               # Main dashboard
│   ├── expenses/                # Expense management
│   ├── budget/                  # Budget tracking
│   ├── analytics/               # Analytics dashboard
│   └── needs/                   # Shopping list
├── components/                   # React components
│   ├── auth/                    # Authentication system
│   │   ├── auth-provider.tsx    # Supabase auth context
│   │   ├── auth-guard.tsx       # Route protection
│   │   ├── login-form.tsx       # Login form
│   │   └── signup-form.tsx      # Registration form
│   ├── layout/                  # Layout components
│   └── ui/                      # Shadcn/ui components
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities
│   ├── supabase-client.ts       # Client-side Supabase
│   ├── supabase-server.ts       # Server-side Supabase
│   └── utils.ts                 # General utilities
├── scripts/                     # Database scripts
│   └── init-database.sql        # Table creation SQL
└── middleware.ts                # Route protection middleware
```

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript validation
```

## Authentication Architecture

### Flow
1. **AuthProvider**: React context managing Supabase session
2. **Middleware**: Server-side route protection
3. **Client Components**: Use `useAuth()` hook
4. **Server Components**: Use `createServerSupabaseClient()`

### Key Files
- `components/auth/auth-provider.tsx`: Global auth state
- `middleware.ts`: Route protection
- `lib/supabase-client.ts`: Client-side Supabase
- `lib/supabase-server.ts`: Server-side Supabase

## Database Schema

### Tables

```sql
-- Core tables for expense tracking
users (id, email, name, created_at, updated_at)
categories (id, user_id, name, color, icon, created_at)
expenses (id, user_id, category_id, amount, description, receipt_url, extracted_data, date, created_at, updated_at)
budgets (id, user_id, category_id, limit_amount, period, created_at, updated_at)
wishlist (id, user_id, item_name, estimated_cost, priority, created_at, updated_at)
```

### Key Relationships
- Users own categories, expenses, budgets, and wishlist items
- Expenses can be categorized
- Budgets apply to specific categories
- All tables have proper foreign key constraints and indexes

## AI Receipt Processing

### API Endpoint: `/api/process-receipt`

**Process:**
1. Receives image data and user ID
2. Sends image to OpenAI GPT-4 Vision with structured prompt
3. Extracts: store name, date, items, prices, totals, category suggestions
4. Creates expense record in Supabase
5. Returns structured data to frontend

**Example Response:**
```json
{
  "success": true,
  "expense": { "id": "...", "amount": 25.67, ... },
  "extractedData": {
    "store_name": "Grocery Store",
    "date": "2024-01-15",
    "items": [
      { "description": "Apples", "quantity": 2, "price": 5.98 }
    ],
    "total": 25.67,
    "category": "Groceries"
  }
}
```

## Component Architecture

### Shared Components
- `components/ui/*`: Shadcn/ui base components
- `components/auth/*`: Authentication system
- `components/layout/*`: Page layouts

### Feature Components
- `components/dashboard/*`: Dashboard widgets
- `components/expenses/*`: Expense management
- `components/budget/*`: Budget tracking
- `components/analytics/*`: Charts and reports

### Custom Hooks
- `useAuth()`: Access authentication state
- `useMobile()`: Responsive design helper
- `useToast()`: Toast notifications

## Environment Configuration

### Required Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-key
```

### Optional Variables
```env
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

## Build & Deployment

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Test production build
npm run start        # Run production build locally
```

### Production Deployment
1. Set environment variables in hosting platform
2. Connect Git repository (for Vercel/Netlify)
3. Deploy automatically on push

### Environment Setup Checklist
- [ ] Supabase project created
- [ ] Database tables initialized
- [ ] Environment variables configured
- [ ] OpenAI API key added
- [ ] DNS/domain configured (production)

## Testing

### Manual Testing
1. **Auth Flow**: Sign up → Login → Dashboard
2. **Expense Management**: Add/edit/delete expenses
3. **AI Processing**: Upload receipt images
4. **Budget Tracking**: Set limits and monitor spending
5. **Responsive Design**: Test on mobile/tablet/desktop

### Key Test Cases
- Authentication (login/logout/session persistence)
- CRUD operations (expenses, categories, budgets)
- AI receipt processing with various image types
- Real-time updates and data synchronization
- Error handling and edge cases

## Performance Considerations

### Optimization
- **Images**: Next.js automatic optimization
- **Database**: Proper indexing on frequently queried columns
- **API**: Efficient Supabase queries with selective fields
- **Caching**: Browser caching for static assets

### Monitoring
- Check Supabase dashboard for query performance
- Monitor OpenAI API usage and costs
- Use Vercel analytics for frontend performance
- Set up error tracking (Sentry recommended)

## Security

### Authentication
- Row Level Security (RLS) enabled in Supabase
- JWT tokens for session management
- Server-side route protection via middleware

### Data Protection
- Environment variables for sensitive data
- HTTPS enforced in production
- Input validation on all forms
- SQL injection protection via Supabase client

## Common Development Tasks

### Adding New Features
1. Create component in appropriate folder
2. Add route in `app/` directory
3. Update navigation in `dashboard-layout.tsx`
4. Add database migrations if needed
5. Update TypeScript types

### Debugging
- Check browser console for client errors
- Use Supabase logs for database issues
- Monitor OpenAI API responses for AI failures
- Use Next.js debugging tools for SSR issues
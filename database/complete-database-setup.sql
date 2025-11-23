-- ===================================================
-- EXPENSE TRACKER PWA - COMPLETE DATABASE SETUP
-- ===================================================
-- This file contains the complete database schema and setup
-- for the Expense Tracker PWA with AI-powered receipt processing
-- 
-- Requirements:
-- - PostgreSQL 12 or higher
-- - Supabase (recommended) or standalone PostgreSQL
--
-- Instructions:
-- 1. Run this entire script in your database
-- 2. All tables, functions, and data will be created
-- 3. The database will be ready for production use
-- ===================================================

-- STEP 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================
-- TABLE DEFINITIONS
-- ===================================================

-- Users table - Store user information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System categories lookup table (predefined categories)
CREATE TABLE IF NOT EXISTS system_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3b82f6',
  icon VARCHAR(50) DEFAULT 'folder',
  created_at TIMESTAMP DEFAULT NOW()
);

-- User categories table (user-specific categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  icon VARCHAR(50),
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expenses table with AI processing support
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  category VARCHAR(100), -- Backward compatibility
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(500),
  receipt_url VARCHAR(500),
  extracted_data JSONB, -- AI-extracted receipt data
  ai_confidence DECIMAL(3, 2), -- AI confidence score (0.00-1.00)
  processing_status VARCHAR(50) DEFAULT 'completed', -- 'processing', 'completed', 'failed'
  merchant VARCHAR(255), -- Merchant/store name
  payment_method VARCHAR(100), -- Cash, card, etc.
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  limit_amount DECIMAL(10, 2) NOT NULL,
  period VARCHAR(20) DEFAULT 'monthly',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Wishlist/Needs table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  estimated_cost DECIMAL(10, 2),
  priority VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================

-- Primary indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);

-- AI processing indexes
CREATE INDEX IF NOT EXISTS idx_expenses_merchant ON expenses(merchant);
CREATE INDEX IF NOT EXISTS idx_expenses_processing_status ON expenses(processing_status);
CREATE INDEX IF NOT EXISTS idx_categories_system ON categories(is_system);

-- Category lookup indexes
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);

-- ===================================================
-- SYSTEM DATA
-- ===================================================

-- Insert predefined system categories
INSERT INTO system_categories (name, color, icon) VALUES
  ('Groceries', '#10b981', 'shopping-cart'),
  ('Dining', '#f59e0b', 'utensils'),
  ('Transportation', '#3b82f6', 'car'),
  ('Shopping', '#ec4899', 'shopping-bag'),
  ('Healthcare', '#ef4444', 'heart-pulse'),
  ('Entertainment', '#8b5cf6', 'film'),
  ('Utilities', '#06b6d4', 'zap'),
  ('Travel', '#84cc16', 'plane'),
  ('Gas', '#f97316', 'fuel'),
  ('Other', '#6b7280', 'more-horizontal')
ON CONFLICT (name) DO NOTHING;

-- ===================================================
-- HELPER FUNCTIONS
-- ===================================================

-- Function to create user categories from system categories
CREATE OR REPLACE FUNCTION create_user_categories(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO categories (user_id, name, color, icon, is_system)
  SELECT p_user_id, sc.name, sc.color, sc.icon, true
  FROM system_categories sc
  WHERE NOT EXISTS (
    SELECT 1 FROM categories c 
    WHERE c.user_id = p_user_id 
    AND c.name = sc.name 
    AND c.is_system = true
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get or create user
CREATE OR REPLACE FUNCTION get_or_create_user(
  p_user_id UUID,
  p_email VARCHAR(255),
  p_name VARCHAR(255) DEFAULT 'User'
)
RETURNS UUID AS $$
BEGIN
  -- Try to insert the user
  INSERT INTO users (id, email, name, created_at, updated_at) 
  VALUES (p_user_id, p_email, p_name, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = EXCLUDED.updated_at;
  
  -- Create user categories if they don't exist
  PERFORM create_user_categories(p_user_id);
  
  RETURN p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ===================================================
-- TESTING AND VERIFICATION
-- ===================================================

-- Create test user for verification
DO $$
DECLARE
    test_user_id UUID := 'c90ad114-9182-4faa-93b1-1aec40c2c10a';
BEGIN
    PERFORM get_or_create_user(
        test_user_id,
        'test@example.com',
        'Test User'
    );
    
    -- Insert test expense
    INSERT INTO expenses (user_id, amount, description, category, date, created_at) 
    VALUES (
        test_user_id,
        15.99,
        'Database Setup Test',
        'Other',
        CURRENT_DATE,
        NOW()
    ) ON CONFLICT DO NOTHING;
END $$;

-- ===================================================
-- VERIFICATION QUERIES
-- ===================================================

-- Verify tables exist
SELECT 
  tablename as "Table Name",
  schemaname as "Schema"
FROM pg_tables 
WHERE tablename IN ('users', 'categories', 'expenses', 'budgets', 'wishlist', 'system_categories')
ORDER BY tablename;

-- Verify test user and data
SELECT 
  u.name as "User Name",
  u.email as "Email",
  COUNT(c.id) as "Categories",
  COUNT(e.id) as "Expenses"
FROM users u
LEFT JOIN categories c ON u.id = c.user_id
LEFT JOIN expenses e ON u.id = e.user_id
WHERE u.id = 'c90ad114-9182-4faa-93b1-1aec40c2c10a'
GROUP BY u.id, u.name, u.email;

-- ===================================================
-- SETUP COMPLETE!
-- ===================================================
-- 
-- Your database is now fully configured with:
-- ✅ All required tables and relationships
-- ✅ AI processing fields for receipt scanning
-- ✅ Performance indexes
-- ✅ System categories and user categories
-- ✅ Helper functions for user management
-- ✅ Test data for verification
--
-- Next steps:
-- 1. Configure your .env.local file with database credentials
-- 2. Test the application with receipt upload
-- 3. Verify AI processing is working correctly
-- 
-- For issues, check the verification queries above
-- ===================================================
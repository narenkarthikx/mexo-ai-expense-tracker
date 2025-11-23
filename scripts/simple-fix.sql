-- SIMPLE DATABASE FIX - Run this in Supabase SQL Editor
-- This will fix all the issues step by step

-- Step 1: First, let's see what tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Step 2: Check the actual structure of expenses table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'expenses' 
ORDER BY ordinal_position;

-- Step 3: Add category column to expenses if missing
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Other';

-- Step 4: Check if users table exists, if not create it simple
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 5: Insert the user with email (to satisfy NOT NULL constraint)
INSERT INTO users (id, email, created_at, updated_at) 
VALUES (
  'c90ad114-9182-4faa-93b1-1aec40c2c10a',
  'user@example.com',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 6: Check what expenses exist
SELECT * FROM expenses WHERE user_id = 'c90ad114-9182-4faa-93b1-1aec40c2c10a';

-- Step 7: If you want to test, manually insert a simple expense
INSERT INTO expenses (user_id, amount, description, category, date) 
VALUES (
  'c90ad114-9182-4faa-93b1-1aec40c2c10a',
  10.50,
  'Test Expense',
  'Other',
  CURRENT_DATE
);
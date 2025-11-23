-- Database structure check and fix
-- Run this in your Supabase SQL Editor to ensure everything works

-- 1. Check current expenses table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'expenses' 
ORDER BY ordinal_position;

-- 2. Add missing category column if it doesn't exist
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Other';

-- 3. Check if users table exists and create basic structure if needed
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Insert the specific user that's having issues (simplified)
INSERT INTO users (id, email, created_at, updated_at) 
VALUES (
  'c90ad114-9182-4faa-93b1-1aec40c2c10a',
  'user@example.com',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 5. Check current expenses for this user
SELECT id, amount, description, category, date, created_at 
FROM expenses 
WHERE user_id = 'c90ad114-9182-4faa-93b1-1aec40c2c10a'
ORDER BY created_at DESC;

-- 6. If no expenses exist, check if there are any foreign key constraints blocking inserts
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints tc 
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'expenses' AND tc.constraint_type = 'FOREIGN KEY';
-- ULTRA-SIMPLE FIX - Just make expenses work
-- Run this if the other script still has issues

-- 1. First, add the category column that's missing
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Other';

-- 2. Check what the users table looks like
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 3. Create the user with all required fields (including name)
INSERT INTO users (id, email, name, created_at, updated_at) 
VALUES (
  'c90ad114-9182-4faa-93b1-1aec40c2c10a',
  'test@example.com',
  'Test User',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  updated_at = EXCLUDED.updated_at;

-- 4. Verify the user exists
SELECT * FROM users WHERE id = 'c90ad114-9182-4faa-93b1-1aec40c2c10a';

-- 5. Test inserting an expense manually
INSERT INTO expenses (user_id, amount, description, category, date, created_at) 
VALUES (
  'c90ad114-9182-4faa-93b1-1aec40c2c10a',
  15.99,
  'Database Test Expense',
  'Other',
  CURRENT_DATE,
  NOW()
);

-- 6. Check if it worked
SELECT id, amount, description, category, date FROM expenses 
WHERE user_id = 'c90ad114-9182-4faa-93b1-1aec40c2c10a'
ORDER BY created_at DESC;
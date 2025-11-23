-- Quick fix to create missing user
-- Run this in your Supabase SQL Editor

-- Check if user exists
SELECT * FROM users WHERE id = 'c90ad114-9182-4faa-93b1-1aec40c2c10a';

-- If user doesn't exist, create them
INSERT INTO users (id, email, full_name, created_at, updated_at) 
VALUES (
  'c90ad114-9182-4faa-93b1-1aec40c2c10a',
  'user@example.com', -- Replace with actual email if known
  'Test User',        -- Replace with actual name if known
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create user categories
SELECT create_user_categories('c90ad114-9182-4faa-93b1-1aec40c2c10a');

-- Verify user and categories exist
SELECT 'User exists:' as check_type, COUNT(*) as count FROM users 
WHERE id = 'c90ad114-9182-4faa-93b1-1aec40c2c10a'
UNION ALL
SELECT 'User categories:' as check_type, COUNT(*) as count FROM categories 
WHERE user_id = 'c90ad114-9182-4faa-93b1-1aec40c2c10a';
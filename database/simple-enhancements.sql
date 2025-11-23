-- ===================================================
-- SIMPLE DATABASE ENHANCEMENTS - STEP BY STEP
-- ===================================================
-- Run each section separately to avoid errors

-- STEP 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 2: Add AI fields to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3, 2),
ADD COLUMN IF NOT EXISTS processing_status VARCHAR(50) DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS merchant VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);

-- STEP 3: Add system flag to categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false;

-- STEP 4: Create system categories lookup table
CREATE TABLE IF NOT EXISTS system_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3b82f6',
  icon VARCHAR(50) DEFAULT 'folder',
  created_at TIMESTAMP DEFAULT NOW()
);

-- STEP 5: Insert system categories
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

-- STEP 6: Create function to setup user categories
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

-- STEP 7: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_expenses_merchant ON expenses(merchant);
CREATE INDEX IF NOT EXISTS idx_expenses_processing_status ON expenses(processing_status);
CREATE INDEX IF NOT EXISTS idx_categories_system ON categories(is_system);

-- ===================================================
-- DONE! Your database is now enhanced and ready!
-- ===================================================
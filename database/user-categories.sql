-- Create user categories table for custom category management
CREATE TABLE IF NOT EXISTS user_categories (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL DEFAULT ARRAY['Groceries', 'Dining', 'Transportation', 'Shopping', 'Healthcare', 'Entertainment', 'Utilities', 'Travel', 'Gas', 'Other'],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster category lookups
CREATE INDEX IF NOT EXISTS idx_user_categories_user_id ON user_categories(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own categories
CREATE POLICY "Users can view their own categories" 
  ON user_categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own categories
CREATE POLICY "Users can insert their own categories" 
  ON user_categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own categories
CREATE POLICY "Users can update their own categories" 
  ON user_categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own categories
CREATE POLICY "Users can delete their own categories" 
  ON user_categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

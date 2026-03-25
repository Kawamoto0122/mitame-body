-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  height NUMERIC,
  current_weight NUMERIC,
  goal_weight NUMERIC,
  registered BOOLEAN DEFAULT FALSE
);

-- Create weight_records table
CREATE TABLE weight_records (
  id UUID PRIMARY KEY,
  date TEXT NOT NULL,
  weight NUMERIC NOT NULL
);

-- Create food_records table
CREATE TABLE food_records (
  id UUID PRIMARY KEY,
  date TEXT NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL,
  image_url TEXT,
  is_ai_generated BOOLEAN DEFAULT FALSE
);

-- Disable Row Level Security (RLS) to allow anonymous read/write
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE food_records DISABLE ROW LEVEL SECURITY;

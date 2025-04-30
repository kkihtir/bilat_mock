-- Create extension for UUID generation (if not already created)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, let's check the countries table structure and modify if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'countries'
  ) THEN
    -- Create countries table if it doesn't exist
    CREATE TABLE countries (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      region TEXT,
      capital TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Add sample countries data
    INSERT INTO countries (code, name, region, capital)
    VALUES
      ('us', 'United States', 'North America', 'Washington, D.C.'),
      ('gb', 'United Kingdom', 'Europe', 'London'),
      ('fr', 'France', 'Europe', 'Paris'),
      ('de', 'Germany', 'Europe', 'Berlin'),
      ('jp', 'Japan', 'Asia', 'Tokyo'),
      ('ca', 'Canada', 'North America', 'Ottawa'),
      ('au', 'Australia', 'Oceania', 'Canberra'),
      ('br', 'Brazil', 'South America', 'Brasília'),
      ('in', 'India', 'Asia', 'New Delhi'),
      ('za', 'South Africa', 'Africa', 'Pretoria');
  ELSE
    RAISE NOTICE 'Countries table already exists, skipping creation.';
  END IF;
END
$$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  country_code TEXT NOT NULL REFERENCES countries(code),
  date DATE,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID REFERENCES users(id),
  approved_by_id UUID REFERENCES users(id),
  tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  country TEXT NOT NULL REFERENCES countries(code),
  position TEXT,
  type TEXT NOT NULL,
  education TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create agreements table
CREATE TABLE IF NOT EXISTS agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL REFERENCES countries(code),
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  description TEXT,
  latest_update TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  key_points TEXT[] DEFAULT '{}'::TEXT[],
  attachments JSONB DEFAULT '[]'::JSONB
);

-- Create action items table
CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  country TEXT NOT NULL REFERENCES countries(code),
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date DATE,
  assigned_to_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID REFERENCES users(id),
  description TEXT
);

-- Add sample users data (only if users table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
    INSERT INTO users (name, email, role)
    VALUES
      ('John Smith', 'john.smith@example.com', 'admin'),
      ('Sarah Johnson', 'sarah.johnson@example.com', 'manager'),
      ('Michael Brown', 'michael.brown@example.com', 'analyst'),
      ('Emily Davis', 'emily.davis@example.com', 'manager'),
      ('David Wilson', 'david.wilson@example.com', 'analyst');
  END IF;
END
$$; 
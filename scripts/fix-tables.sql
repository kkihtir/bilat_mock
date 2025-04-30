-- First, make sure the countries table exists and has data
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the countries table if it doesn't exist
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT,
  capital TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Directly insert countries (using ON CONFLICT to avoid duplicates)
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
  ('za', 'South Africa', 'Africa', 'Pretoria'),
  ('cn', 'China', 'Asia', 'Beijing')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  region = EXCLUDED.region,
  capital = EXCLUDED.capital;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert users
INSERT INTO users (name, email, role)
VALUES
  ('John Smith', 'john.smith@example.com', 'admin'),
  ('Sarah Johnson', 'sarah.johnson@example.com', 'manager'),
  ('Michael Brown', 'michael.brown@example.com', 'analyst'),
  ('Emily Davis', 'emily.davis@example.com', 'manager'),
  ('David Wilson', 'david.wilson@example.com', 'analyst')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Query the users to get their IDs for referencing in other tables
SELECT id as john_id FROM users WHERE email = 'john.smith@example.com';
SELECT id as sarah_id FROM users WHERE email = 'sarah.johnson@example.com';
SELECT id as michael_id FROM users WHERE email = 'michael.brown@example.com';
SELECT id as emily_id FROM users WHERE email = 'emily.davis@example.com';
SELECT id as david_id FROM users WHERE email = 'david.wilson@example.com'; 
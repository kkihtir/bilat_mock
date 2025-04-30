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
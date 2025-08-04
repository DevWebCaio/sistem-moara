-- Enable the uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a table for power plants
CREATE TABLE IF NOT EXISTS public.power_plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  location VARCHAR(255),
  capacity VARCHAR(50), -- e.g., '1.2 MWp', '500 kWp'
  status VARCHAR(50), -- e.g., 'Operacional', 'Em Construção', 'Manutenção', 'Desativada'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES public.users(id),
  type TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC
);

-- Set up Row Level Security (RLS)
ALTER TABLE power_plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON power_plants
  FOR SELECT USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON power_plants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Power plants are viewable by their owners." ON power_plants
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create power plants." ON power_plants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own power plants." ON power_plants
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own power plants." ON power_plants
  FOR DELETE USING (auth.uid() = owner_id);

-- This script combines all schema creation into one for convenience.

-- Enable the uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'public' schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Create the 'power_plants' table
CREATE TABLE IF NOT EXISTS public.power_plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    capacity VARCHAR(50), -- e.g., '1.2 MWp', '500 kWp'
    status VARCHAR(50), -- e.g., 'Operacional', 'Em Construção', 'Manutenção', 'Desativada'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'energy_vault' table
CREATE TABLE IF NOT EXISTS public.energy_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id UUID REFERENCES public.power_plants(id),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_type VARCHAR(50), -- e.g., 'CSV', 'JSON'
    data_blob JSONB, -- Store raw data as JSONB
    status VARCHAR(50), -- e.g., 'Pending', 'Processed', 'Failed'
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- e.g., 'admin', 'user', 'viewer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'settings' table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial settings (example)
INSERT INTO public.settings (key, value)
VALUES
    ('platform_name', '"Solar DG Platform"'),
    ('admin_email', '"admin@solardg.com"')
ON CONFLICT (key) DO NOTHING;

-- Optional: Add RLS policies for security
ALTER TABLE public.power_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policies for 'power_plants'
CREATE POLICY "Enable read access for all users" ON public.power_plants FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.power_plants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.power_plants FOR UPDATE USING (auth.uid() = id); -- Assuming user_id in power_plants if applicable

-- Policies for 'energy_vault'
CREATE POLICY "Enable read access for all users" ON public.energy_vault FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.energy_vault FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for 'users'
CREATE POLICY "Enable read access for all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.users FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for 'settings'
CREATE POLICY "Enable read access for users based on user_id" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.settings FOR DELETE USING (auth.uid() = user_id);

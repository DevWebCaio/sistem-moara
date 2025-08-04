-- This script is intended to create any tables that might be missing from the database schema.
-- It should be run after the initial schema creation if new tables are introduced.

-- Enable the 'uuid-ossp' extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'users' table if it does not exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- e.g., 'admin', 'user', 'viewer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'power_plants' table if it does not exist
CREATE TABLE IF NOT EXISTS public.power_plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    location VARCHAR(255),
    capacity VARCHAR(50),
    status VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'energy_vault' table if it does not exist
CREATE TABLE IF NOT EXISTS public.energy_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    type VARCHAR(50),
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'settings' table if it does not exist
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'contracts' table if it does not exist
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    contract_name TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id)
);

-- Optional: Add RLS policies for security if not already added
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Policies for 'users'
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.users FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users" ON public.users FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for 'power_plants' table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated read access to power_plants' AND tablename = 'power_plants') THEN
        CREATE POLICY "Allow authenticated read access to power_plants" ON public.power_plants FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner insert access to power_plants' AND tablename = 'power_plants') THEN
        CREATE POLICY "Allow owner insert access to power_plants" ON public.power_plants FOR INSERT WITH CHECK (auth.uid() = owner_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner update access to power_plants' AND tablename = 'power_plants') THEN
        CREATE POLICY "Allow owner update access to power_plants" ON public.power_plants FOR UPDATE USING (auth.uid() = owner_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner delete access to power_plants' AND tablename = 'power_plants') THEN
        CREATE POLICY "Allow owner delete access to power_plants" ON public.power_plants FOR DELETE USING (auth.uid() = owner_id);
    END IF;
END $$;

-- Policies for 'energy_vault' table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated read access to energy_vault' AND tablename = 'energy_vault') THEN
        CREATE POLICY "Allow authenticated read access to energy_vault" ON public.energy_vault FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner insert access to energy_vault' AND tablename = 'energy_vault') THEN
        CREATE POLICY "Allow owner insert access to energy_vault" ON public.energy_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner update access to energy_vault' AND tablename = 'energy_vault') THEN
        CREATE POLICY "Allow owner update access to energy_vault" ON public.energy_vault FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner delete access to energy_vault' AND tablename = 'energy_vault') THEN
        CREATE POLICY "Allow owner delete access to energy_vault" ON public.energy_vault FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Policies for 'settings'
CREATE POLICY IF NOT EXISTS "Enable read access for users based on user_id" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Enable update for users based on user_id" ON public.settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Enable delete for users based on user_id" ON public.settings FOR DELETE USING (auth.uid() = user_id);

-- Policies for 'contracts' table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Contracts are viewable by their owners.' AND tablename = 'contracts') THEN
        CREATE POLICY "Contracts are viewable by their owners." ON public.contracts FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

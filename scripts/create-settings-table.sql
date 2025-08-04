-- Enable the uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'settings' table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add RLS policies for security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for users based on user_id" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.settings FOR DELETE USING (auth.uid() = user_id);

-- Insert initial settings (example)
INSERT INTO public.settings (key, value)
VALUES
    ('platform_name', '"Solar DG Platform"'),
    ('admin_email', '"admin@solardg.com"')
ON CONFLICT (key) DO NOTHING;

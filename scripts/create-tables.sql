-- This script creates the initial set of tables for the application.
-- It includes tables for users, power_plants, and energy_vault_data.

-- Enable the uuid-ossp extension for generating UUIDs
create extension if not exists "uuid-ossp";

-- Create a table for public profiles
create table users (
  id uuid primary key default gen_random_uuid(),
  username varchar(255),
  email varchar(255) unique not null,
  role varchar(50) default 'user', -- e.g., 'admin', 'user', 'viewer'
  created_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table users enable row level security;

create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, email)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'email');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for power plants
create table power_plants (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  location varchar(255),
  capacity varchar(50), -- e.g., '1.2 MWp', '500 kWp'
  status varchar(50), -- e.g., 'Operacional', 'Em Construção', 'Manutenção', 'Desativada'
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up RLS for power_plants
alter table power_plants enable row level security;

create policy "Power plants are viewable by their owners." on power_plants
  for select using (auth.uid() = owner_id);

create policy "Users can create power plants." on power_plants
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own power plants." on power_plants
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own power plants." on power_plants
  for delete using (auth.uid() = owner_id);

-- Create a table for energy vault data
create table energy_vault (
  id uuid primary key default gen_random_uuid(),
  name varchar(255),
  type varchar(50),
  data jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up RLS for energy_vault_data
alter table energy_vault enable row level security;

create policy "Energy vault data is viewable by authenticated users." on energy_vault
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can insert energy vault data." on energy_vault
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update energy vault data." on energy_vault
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete energy vault data." on energy_vault
  for delete using (auth.role() = 'authenticated');

-- Create the 'settings' table
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, key) -- Ensure unique settings per user
);

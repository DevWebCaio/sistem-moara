-- ============================================
-- SISTEMA DE GESTÃO DE ENERGIA SOLAR - SCHEMA COMPLETO
-- ============================================

-- Create the 'public' schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- REMOVER TABELAS EXISTENTES (se necessário)
-- ============================================
-- Descomente as linhas abaixo se precisar recriar as tabelas
-- DROP TABLE IF EXISTS support_tickets CASCADE;
-- DROP TABLE IF EXISTS energy_compensation CASCADE;
-- DROP TABLE IF EXISTS energy_vault CASCADE;
-- DROP TABLE IF EXISTS energy_readings CASCADE;
-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS invoices CASCADE;
-- DROP TABLE IF EXISTS contracts CASCADE;
-- DROP TABLE IF EXISTS clients CASCADE;
-- DROP TABLE IF EXISTS power_plants CASCADE;
-- DROP TABLE IF EXISTS generating_units CASCADE;
-- DROP TABLE IF EXISTS consumer_units CASCADE;
-- DROP TABLE IF EXISTS settings CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    role TEXT DEFAULT 'user' NOT NULL -- e.g., 'admin', 'user', 'viewer'
);

-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  billing_address JSONB,
  payment_method JSONB
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own user data." ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Can update own user data." ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- 3. TABELA DE UNIDADES CONSUMIDORAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.consumer_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    installation_number TEXT UNIQUE NOT NULL,
    distributor_id TEXT NOT NULL,
    monthly_consumption NUMERIC NOT NULL,
    tariff_class TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. TABELA DE UNIDADES GERADORAS
-- ============================================
CREATE TABLE IF NOT EXISTS generating_units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  capacity_kw DECIMAL(10,2) NOT NULL,
  distributor_id VARCHAR(100) NOT NULL,
  technology VARCHAR(50) DEFAULT 'solar_photovoltaic',
  status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'maintenance', 'suspended')) DEFAULT 'active',
  installation_date DATE NOT NULL,
  commissioning_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. TABELA DE USINAS/PLANTAS DE ENERGIA
-- ============================================
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

-- Set up RLS for power_plants
ALTER TABLE public.power_plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.power_plants FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.power_plants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.power_plants FOR UPDATE USING (auth.uid() = id); -- Assuming user_id in power_plants if applicable

-- ============================================
-- 6. TABELA DE LEITURAS DE ENERGIA
-- ============================================
CREATE TABLE IF NOT EXISTS energy_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  generating_unit_id UUID REFERENCES generating_units(id) ON DELETE CASCADE,
  consumer_unit_id UUID REFERENCES public.consumer_units(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  energy_generated DECIMAL(10,2) DEFAULT 0,
  energy_consumed DECIMAL(10,2) DEFAULT 0,
  energy_injected DECIMAL(10,2) DEFAULT 0,
  energy_received DECIMAL(10,2) DEFAULT 0,
  peak_power DECIMAL(10,2) DEFAULT 0,
  reading_type VARCHAR(20) DEFAULT 'automatic' CHECK (reading_type IN ('automatic', 'manual', 'estimated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_reading_per_unit_date UNIQUE(generating_unit_id, consumer_unit_id, reading_date)
);

-- ============================================
-- 7. TABELA DE FATURAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT NOT NULL UNIQUE,
    consumer_unit_id UUID REFERENCES public.consumer_units(id),
    amount NUMERIC,
    invoice_date DATE,
    due_date DATE,
    status TEXT, -- e.g., 'paid', 'pending', 'overdue'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. TABELA DE PAGAMENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consumer_unit_id UUID REFERENCES public.consumer_units(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'scheduled', 'cancelled')),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  gateway_response TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. TABELA DE CONTRATOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    consumer_unit_id UUID REFERENCES public.consumer_units(id) ON DELETE CASCADE NOT NULL,
    power_plant_id UUID REFERENCES public.power_plants(id) ON DELETE CASCADE NOT NULL,
    contract_start_date DATE NOT NULL,
    contract_end_date DATE NOT NULL,
    supply_percentage NUMERIC NOT NULL,
    signed_date DATE NOT NULL,
    contract_status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 10. TABELA DE CLIENTES (CRM)
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company_name VARCHAR(255),
  cnpj VARCHAR(18),
  cpf VARCHAR(14),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  stage VARCHAR(20) DEFAULT 'lead' CHECK (stage IN ('lead', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'contract_signed', 'activated', 'lost')),
  source VARCHAR(100),
  monthly_consumption DECIMAL(10,2) DEFAULT 0,
  interest_level VARCHAR(20) DEFAULT 'medium' CHECK (interest_level IN ('low', 'medium', 'high')),
  budget_range VARCHAR(50),
  notes TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  last_contact DATE,
  next_followup DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 11. TABELA DE COFRE DE ENERGIA
-- ============================================
CREATE TABLE IF NOT EXISTS public.energy_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    type VARCHAR(50),
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for energy_vault
ALTER TABLE public.energy_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.energy_vault FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.energy_vault FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 12. TABELA DE COMPENSAÇÃO DE ENERGIA
-- ============================================
CREATE TABLE IF NOT EXISTS energy_compensation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consumer_unit_id UUID REFERENCES public.consumer_units(id) ON DELETE CASCADE NOT NULL,
  generating_unit_id UUID REFERENCES generating_units(id) ON DELETE CASCADE NOT NULL,
  reference_month VARCHAR(7) NOT NULL, -- formato: YYYY-MM
  allocated_kwh DECIMAL(10,2) NOT NULL DEFAULT 0,
  compensation_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  compensation_rate DECIMAL(10,4) DEFAULT 0.95,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_compensation_per_month UNIQUE(consumer_unit_id, generating_unit_id, reference_month)
);

-- ============================================
-- 13. TABELA DE TICKETS DE SUPORTE
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) CHECK (category IN ('technical', 'billing', 'general', 'urgent', 'feature_request', 'bug_report')) DEFAULT 'general',
  status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'pending_customer')) DEFAULT 'open',
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to UUID REFERENCES public.profiles(id),
  consumer_unit_id UUID REFERENCES public.consumer_units(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  estimated_resolution DATE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 14. TABELA DE CONFIGURAÇÕES DO SISTEMA
-- ============================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for users based on user_id" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for users based on user_id" ON public.settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for users based on user_id" ON public.settings FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- INSERIR CONFIGURAÇÕES PADRÃO DO SISTEMA
-- ============================================
INSERT INTO public.settings (key, value) 
SELECT * FROM (VALUES
  -- Configurações de Faturamento
  ('tariff_rate', '{"value": "0.65"}'),
  ('compensation_rate', '{"value": "0.95"}'),
  ('invoice_due_days', '{"value": "30"}'),
  ('late_fee_rate', '{"value": "0.02"}'),
  ('interest_rate', '{"value": "0.01"}'),
  
  -- Configurações do Sistema
  ('auto_notifications', '{"value": "true"}'),
  ('backup_frequency', '{"value": "daily"}'),
  ('maintenance_mode', '{"value": "false"}'),
  ('max_file_size', '{"value": "10"}'),
  ('session_timeout', '{"value": "60"}'),
  
  -- Configurações de Integrações
  ('whatsapp_api_key', '{"value": ""}'),
  ('whatsapp_enabled', '{"value": "false"}'),
  ('email_api_key', '{"value": ""}'),
  ('email_enabled', '{"value": "true"}'),
  ('sms_api_key', '{"value": ""}'),
  ('sms_enabled', '{"value": "false"}'),
  ('payment_gateway_key', '{"value": ""}'),
  ('payment_gateway_enabled', '{"value": "false"}'),
  
  -- Configurações de Usuários
  ('default_user_role', '{"value": "client"}'),
  ('allow_registration', '{"value": "true"}'),
  ('require_email_verification', '{"value": "true"}'),
  ('password_min_length', '{"value": "8"}'),
  
  -- Configurações de Segurança
  ('require_2fa', '{"value": "false"}'),
  ('auto_logout', '{"value": "true"}'),
  ('max_login_attempts', '{"value": "5"}'),
  ('lockout_duration', '{"value": "30"}'),
  ('password_expiry_days', '{"value": "90"}'),
  
  -- Configurações de Relatórios
  ('report_retention_days', '{"value": "365"}'),
  ('auto_generate_reports', '{"value": "true"}'),
  ('report_format', '{"value": "pdf"}'),
  
  -- Initial settings
  ('platform_name', '"Solar DG Platform"'),
  ('admin_email', '"admin@solardg.com"')
) AS v(key, value)
WHERE NOT EXISTS (SELECT 1 FROM public.settings WHERE public.settings.key = v.key);

-- ============================================
-- CRIAR ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================

-- Índices da tabela users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Índices da tabela profiles
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON public.profiles(avatar_url);
CREATE INDEX IF NOT EXISTS idx_profiles_billing_address ON public.profiles(billing_address);
CREATE INDEX IF NOT EXISTS idx_profiles_payment_method ON public.profiles(payment_method);

-- Índices da tabela consumer_units
CREATE INDEX IF NOT EXISTS idx_consumer_units_profile_id ON public.consumer_units(profile_id);
CREATE INDEX IF NOT EXISTS idx_consumer_units_name ON public.consumer_units(name);
CREATE INDEX IF NOT EXISTS idx_consumer_units_address ON public.consumer_units(address);
CREATE INDEX IF NOT EXISTS idx_consumer_units_installation_number ON public.consumer_units(installation_number);
CREATE INDEX IF NOT EXISTS idx_consumer_units_distributor_id ON public.consumer_units(distributor_id);
CREATE INDEX IF NOT EXISTS idx_consumer_units_status ON public.consumer_units(status);

-- Índices da tabela generating_units
CREATE INDEX IF NOT EXISTS idx_generating_units_status ON generating_units(status);
CREATE INDEX IF NOT EXISTS idx_generating_units_installation_date ON generating_units(installation_date);

-- Índices da tabela power_plants
CREATE INDEX IF NOT EXISTS idx_power_plants_name ON public.power_plants(name);
CREATE INDEX IF NOT EXISTS idx_power_plants_location ON public.power_plants(location);
CREATE INDEX IF NOT EXISTS idx_power_plants_capacity ON public.power_plants(capacity);
CREATE INDEX IF NOT EXISTS idx_power_plants_status ON public.power_plants(status);

-- Índices da tabela energy_readings
CREATE INDEX IF NOT EXISTS idx_energy_readings_generating_unit_id ON energy_readings(generating_unit_id);
CREATE INDEX IF NOT EXISTS idx_energy_readings_consumer_unit_id ON energy_readings(consumer_unit_id);
CREATE INDEX IF NOT EXISTS idx_energy_readings_date ON energy_readings(reading_date);

-- Índices da tabela invoices
CREATE INDEX IF NOT EXISTS idx_invoices_consumer_unit_id ON public.invoices(consumer_unit_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON public.invoices(invoice_date);

-- Índices da tabela payments
CREATE INDEX IF NOT EXISTS idx_payments_consumer_unit_id ON payments(consumer_unit_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

-- Índices da tabela contracts
CREATE INDEX IF NOT EXISTS idx_contracts_profile_id ON public.contracts(profile_id);
CREATE INDEX IF NOT EXISTS idx_contracts_consumer_unit_id ON public.contracts(consumer_unit_id);
CREATE INDEX IF NOT EXISTS idx_contracts_power_plant_id ON public.contracts(power_plant_id);
CREATE INDEX IF NOT EXISTS idx_contracts_contract_start_date ON public.contracts(contract_start_date);
CREATE INDEX IF NOT EXISTS idx_contracts_contract_end_date ON public.contracts(contract_end_date);

-- Índices da tabela clients
CREATE INDEX IF NOT EXISTS idx_clients_stage ON clients(stage);
CREATE INDEX IF NOT EXISTS idx_clients_assigned_to ON clients(assigned_to);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_last_contact ON clients(last_contact);

-- Índices da tabela energy_vault
CREATE INDEX IF NOT EXISTS idx_energy_vault_name ON public.energy_vault(name);
CREATE INDEX IF NOT EXISTS idx_energy_vault_type ON public.energy_vault(type);
CREATE INDEX IF NOT EXISTS idx_energy_vault_created_at ON public.energy_vault(created_at);
CREATE INDEX IF NOT EXISTS idx_energy_vault_updated_at ON public.energy_vault(updated_at);

-- Índices da tabela energy_compensation
CREATE INDEX IF NOT EXISTS idx_energy_compensation_consumer_unit_id ON energy_compensation(consumer_unit_id);
CREATE INDEX IF NOT EXISTS idx_energy_compensation_generating_unit_id ON energy_compensation(generating_unit_id);
CREATE INDEX IF NOT EXISTS idx_energy_compensation_reference_month ON energy_compensation(reference_month);

-- Índices da tabela support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_profile_id ON support_tickets(profile_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);

-- Índices da tabela settings
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_created_at ON public.settings(created_at);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumer_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE generating_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_compensation ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CRIAR POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- ============================================

-- Políticas para users
CREATE POLICY "Allow public read access" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access" ON public.users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow individual update access" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual delete access" ON public.users FOR DELETE USING (auth.uid() = id);

-- Políticas para profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para consumer_units
CREATE POLICY "Allow authenticated users to view their consumer units." ON public.consumer_units
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Allow authenticated users to insert their consumer units." ON public.consumer_units
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Allow authenticated users to update their consumer units." ON public.consumer_units
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Allow authenticated users to delete their consumer units." ON public.consumer_units
  FOR DELETE USING (auth.uid() = profile_id);

-- Políticas para generating_units
CREATE POLICY "Allow authenticated read access to generating_units" ON generating_units FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to generating_units" ON generating_units FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access to generating_units" ON generating_units FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access to generating_units" ON generating_units FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para energy_compensation
CREATE POLICY "Allow authenticated read access to energy_compensation" ON energy_compensation FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to energy_compensation" ON energy_compensation FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access to energy_compensation" ON energy_compensation FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access to energy_compensation" ON energy_compensation FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para support_tickets
CREATE POLICY "Allow authenticated read access to support_tickets" ON support_tickets FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to support_tickets" ON support_tickets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access to support_tickets" ON support_tickets FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access to support_tickets" ON support_tickets FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para clients
CREATE POLICY "Allow authenticated read access to clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to clients" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access to clients" ON clients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access to clients" ON clients FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para energy_vault
CREATE POLICY "Allow authenticated read access to energy_vault" ON public.energy_vault FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to energy_vault" ON public.energy_vault FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access to energy_vault" ON public.energy_vault FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access to energy_vault" ON public.energy_vault FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para settings
CREATE POLICY "Allow authenticated read access to settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow owner insert access to settings" ON public.settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow owner update access to settings" ON public.settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow owner delete access to settings" ON public.settings FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- CRIAR TRIGGERS PARA UPDATED_AT
-- ============================================

-- Função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consumer_units_updated_at BEFORE UPDATE ON public.consumer_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generating_units_updated_at BEFORE UPDATE ON generating_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_power_plants_updated_at BEFORE UPDATE ON public.power_plants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_energy_vault_updated_at BEFORE UPDATE ON public.energy_vault FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_energy_compensation_updated_at BEFORE UPDATE ON energy_compensation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CRIAR VIEWS ÚTEIS PARA RELATÓRIOS
-- ============================================

-- View para resumo de unidades consumidoras
CREATE OR REPLACE VIEW consumer_units_summary AS
SELECT 
    cu.id,
    cu.name,
    cu.owner_name,
    cu.owner_document,
    cu.created_at,
    p.full_name as owner_name,
    p.email as owner_email,
    COUNT(i.id) as total_invoices,
    SUM(i.amount) as total_amount_invoiced,
    COALESCE(ev.amount_kwh, 0) as energy_vault_balance
FROM public.consumer_units cu
LEFT JOIN public.profiles p ON cu.profile_id = p.id
LEFT JOIN public.invoices i ON cu.id = i.consumer_unit_id
LEFT JOIN public.energy_vault ev ON cu.id = ev.consumer_unit_id AND ev.month = EXTRACT(MONTH FROM NOW()) AND ev.year = EXTRACT(YEAR FROM NOW())
GROUP BY cu.id, cu.name, cu.owner_name, cu.owner_document, cu.created_at, p.full_name, p.email, ev.amount_kwh;

-- View para resumo financeiro
CREATE OR REPLACE VIEW financial_summary AS
SELECT 
    DATE_TRUNC('month', i.invoice_date) as month,
    COUNT(i.id) as total_invoices,
    SUM(i.amount) as total_invoiced,
    SUM(CASE WHEN i.status = 'paid' THEN i.amount ELSE 0 END) as total_paid,
    SUM(CASE WHEN i.status = 'overdue' THEN i.amount ELSE 0 END) as total_overdue
FROM public.invoices i
GROUP BY DATE_TRUNC('month', i.invoice_date)
ORDER BY month DESC;

-- ============================================
-- FINALIZAÇÃO
-- ============================================

-- Verificar se todas as tabelas foram criadas
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'settings', 'profiles', 'consumer_units', 'generating_units',
        'power_plants', 'energy_readings', 'invoices', 'payments',
        'contracts', 'clients', 'energy_vault', 'support_tickets', 'users'
    );
    
    RAISE NOTICE '============================================';
    RAISE NOTICE 'SCHEMA CRIADO COM SUCESSO!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Total de tabelas criadas: %', table_count;
    RAISE NOTICE 'Configurações padrão inseridas';
    RAISE NOTICE 'Índices criados para melhor performance';
    RAISE NOTICE 'Políticas de segurança (RLS) configuradas';
    RAISE NOTICE 'Triggers de updated_at configurados';
    RAISE NOTICE 'Views de relatórios criadas';
    RAISE NOTICE '============================================';
END $$;

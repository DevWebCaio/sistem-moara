-- This script is for testing purposes, to insert sample data into the 'energy_vault' table.
-- It assumes the 'users' and 'energy_vault' tables already exist.

-- First, ensure you have a user to associate the data with.
-- If you don't have one, you can insert a dummy user or use an existing user's ID.
-- Replace 'your_user_id_here' with an actual user ID from your 'users' table.
-- For demonstration, let's assume a user with ID 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' exists.
-- If not, uncomment and run the following to create a dummy user:
-- INSERT INTO public.users (id, email, name, role) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'test@example.com', 'Test User', 'user') ON CONFLICT (id) DO NOTHING;

-- Insert sample production data
INSERT INTO public.energy_vault (user_id, name, type, data)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Solar Production - Jan 2023', 'production', '[
        {"timestamp": "2023-01-01T00:00:00Z", "value_kwh": 10.5},
        {"timestamp": "2023-01-01T01:00:00Z", "value_kwh": 12.3},
        {"timestamp": "2023-01-01T02:00:00Z", "value_kwh": 11.8},
        {"timestamp": "2023-01-01T03:00:00Z", "value_kwh": 9.7},
        {"timestamp": "2023-01-01T04:00:00Z", "value_kwh": 8.2}
    ]'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Solar Production - Feb 2023', 'production', '[
        {"timestamp": "2023-02-01T00:00:00Z", "value_kwh": 11.0},
        {"timestamp": "2023-02-01T01:00:00Z", "value_kwh": 13.0},
        {"timestamp": "2023-02-01T02:00:00Z", "value_kwh": 12.5},
        {"timestamp": "2023-02-01T03:00:00Z", "value_kwh": 10.0},
        {"timestamp": "2023-02-01T04:00:00Z", "value_kwh": 9.0}
    ]');

-- Insert sample consumption data
INSERT INTO public.energy_vault (user_id, name, type, data)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Home Consumption - Jan 2023', 'consumption', '[
        {"timestamp": "2023-01-01T00:00:00Z", "value_kwh": 5.0},
        {"timestamp": "2023-01-01T01:00:00Z", "value_kwh": 4.5},
        {"timestamp": "2023-01-01T02:00:00Z", "value_kwh": 4.8},
        {"timestamp": "2023-01-01T03:00:00Z", "value_kwh": 5.2},
        {"timestamp": "2023-01-01T04:00:00Z", "value_kwh": 5.5}
    ]');

-- Insert sample forecast data
INSERT INTO public.energy_vault (user_id, name, type, data)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Production Forecast - Mar 2023', 'forecast', '[
        {"timestamp": "2023-03-01T00:00:00Z", "value_kwh": 15.0},
        {"timestamp": "2023-03-01T01:00:00Z", "value_kwh": 16.0},
        {"timestamp": "2023-03-01T02:00:00Z", "value_kwh": 15.5},
        {"timestamp": "2023-03-01T03:00:00Z", "value_kwh": 14.0},
        {"timestamp": "2023-03-01T04:00:00Z", "value_kwh": 13.0}
    ]');

-- Insert sample energy vault data
INSERT INTO energy_vault_data (name, data) VALUES
('Sample Data 1', '{
  "timestamp": "2023-01-01T00:00:00Z",
  "energy_production": 150.5,
  "energy_consumption": 100.2,
  "battery_level": 0.85
}'),
('Sample Data 2', '{
  "timestamp": "2023-01-01T01:00:00Z",
  "energy_production": 160.0,
  "energy_consumption": 110.5,
  "battery_level": 0.88
}'),
('Sample Data 3', '{
  "timestamp": "2023-01-01T02:00:00Z",
  "energy_production": 145.2,
  "energy_consumption": 95.0,
  "battery_level": 0.82
}');

-- Insert test data into the 'energy_vault' table
INSERT INTO public.energy_vault (name, type, data)
VALUES
    ('Produção Diária Usina A', 'daily_production', '{"date": "2023-01-01", "value": 1500.5, "unit": "kWh"}'),
    ('Consumo Mensal Residência X', 'monthly_consumption', '{"month": "2023-01", "value": 300.2, "unit": "kWh"}'),
    ('Dados de Irradiação Solar', 'weather_data', '{"city": "São Paulo", "date": "2023-01-01", "irradiance": 5.2, "unit": "kWh/m2/day"}')
ON CONFLICT DO NOTHING;

-- This script is for testing purposes, to insert sample data into the energy_vault table.
-- It assumes the 'power_plants' table already exists and has at least one plant.

-- First, ensure there's at least one power plant to link to.
-- If you don't have any, uncomment and run the following INSERT:
-- INSERT INTO public.power_plants (name, location, capacity, status)
-- VALUES ('Sample Plant for Test', 'Test Location', '100 kWp', 'Operacional')
-- ON CONFLICT (name) DO NOTHING; -- Prevents error if plant already exists

-- Get an existing plant_id (replace with a real ID if you have one, or use a subquery)
DO $$
DECLARE
    plant_uuid UUID;
BEGIN
    -- Try to get an existing plant ID, or create one if none exists
    SELECT id INTO plant_uuid FROM public.power_plants LIMIT 1;

    IF plant_uuid IS NULL THEN
        INSERT INTO public.power_plants (name, location, capacity, status)
        VALUES ('Default Test Plant', 'Test City, TS', '50 kWp', 'Operacional')
        RETURNING id INTO plant_uuid;
    END IF;

    -- Insert sample data into 'energy_vault'
    INSERT INTO public.energy_vault (plant_id, upload_date, data_type, data_blob, status, processed_at) VALUES
    (
        plant_uuid,
        '2023-01-01 10:00:00+00',
        'CSV',
        '{"headers": ["timestamp", "production_kwh"], "rows": [["2023-01-01 08:00", 10.5], ["2023-01-01 09:00", 12.1]]}',
        'Processed',
        '2023-01-01 10:05:00+00'
    ),
    (
        plant_uuid,
        '2023-01-02 11:00:00+00',
        'JSON',
        '{"readings": [{"time": "2023-01-02T08:00:00Z", "kwh": 11.2}, {"time": "2023-01-02T09:00:00Z", "kwh": 13.5}]}',
        'Pending',
        NULL
    ),
    (
        plant_uuid,
        '2023-01-03 14:00:00+00',
        'CSV',
        '{"headers": ["timestamp", "production_kwh"], "rows": [["2023-01-03 10:00", 9.8], ["2023-01-03 11:00", 11.0]]}',
        'Failed',
        '2023-01-03 14:02:00+00'
    );

    RAISE NOTICE 'Sample data inserted into energy_vault for plant_id: %', plant_uuid;

END $$;

-- This script updates the 'energy_vault' table schema.
-- It can be used to add new columns, modify existing ones, or add constraints.

-- Example: Add a 'source' column to track where the data came from (e.g., 'manual', 'api', 'csv_upload')
ALTER TABLE public.energy_vault
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Example: Add an index to the 'user_id' and 'type' columns for faster queries
CREATE INDEX IF NOT EXISTS idx_energy_vault_user_type ON public.energy_vault (user_id, type);

-- Example: Add a 'metadata' JSONB column for additional flexible data
ALTER TABLE public.energy_vault
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Example: Update existing rows to set a default 'source' value if the column was just added
UPDATE public.energy_vault
SET source = 'manual'
WHERE source IS NULL;

-- Example: Add a check constraint to ensure 'type' is one of a few allowed values
ALTER TABLE public.energy_vault
ADD CONSTRAINT chk_energy_vault_type CHECK (type IN ('production', 'consumption', 'forecast', 'grid_import', 'grid_export'));

-- Example: Add a 'notes' column to the energy_vault table
ALTER TABLE public.energy_vault
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Example: Add an index to the plant_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_energy_vault_plant_id ON public.energy_vault (plant_id);

-- Example: Add a 'source_file_name' column
ALTER TABLE public.energy_vault
ADD COLUMN IF NOT EXISTS source_file_name VARCHAR(255);

-- Add a new column 'updated_at' to the 'energy_vault' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='energy_vault' and column_name='updated_at') THEN
        ALTER TABLE public.energy_vault ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END
$$;

-- Update the 'updated_at' column on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update 'updated_at' on each row update
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_energy_vault_updated_at') THEN
        CREATE TRIGGER set_energy_vault_updated_at
        BEFORE UPDATE ON public.energy_vault
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- This script is for updating the energy_vault_data table, e.g., adding new columns.

-- Example: Add a new column 'source' to the energy_vault_data table
ALTER TABLE energy_vault_data
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual_upload';

-- Example: Update existing rows with a default source value
UPDATE energy_vault_data
SET source = 'manual_upload'
WHERE source IS NULL;

-- IMPORTANT: Before running any ALTER TABLE statements on a production database,
-- ensure you have a backup and understand the implications of the changes.
-- For this project, we are keeping the schema simple, but these are examples
-- of how you might extend it.

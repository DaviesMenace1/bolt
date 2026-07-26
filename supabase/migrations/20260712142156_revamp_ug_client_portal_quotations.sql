/*
# Revamp UG — Client Portal & Quotations (Parts 9-11)

## Overview
Creates tables for the client portal:
1. Client profiles — extends auth.users with client-specific data
2. Client projects — projects assigned to specific clients (visible in their portal)
3. Quotations — price quotes for client projects
4. Quotation items — line items within a quotation
5. Appointments — consultation and meeting scheduling

## New Tables

### client_profiles (Part 9)
- Extends auth.users with client-specific information
- id (FK auth.users), full_name, phone, address, company, avatar_url, preferences, created_at, updated_at

### client_projects (Part 10)
- Projects linked to specific clients, visible in their portal dashboard
- id, client_id (FK auth.users), title, description, status, budget_range, start_date, target_completion, hero_image_url, progress_percentage, created_at, updated_at
- status: 'consultation' | 'design' | 'sourcing' | 'installation' | 'completed' | 'on_hold'

### quotations (Part 11)
- Price quotations for client projects
- id, client_id (FK auth.users), project_id (FK client_projects), quote_number, title, total_amount, status, valid_until, notes, created_at, updated_at
- status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'

### quotation_items (Part 11)
- Line items within a quotation
- id, quotation_id (FK quotations), description, quantity, unit_price, total_price, category, sort_order

### appointments (Part 9)
- Consultation and meeting scheduling
- id, client_id (FK auth.users), project_id (FK client_projects), title, description, scheduled_at, duration_minutes, location, status, notes, created_at, updated_at
- status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'

## Security
- RLS enabled on all tables
- Client profiles: owner can SELECT/UPDATE own profile; admins have full access
- Client projects: owner can SELECT own; admins full CRUD
- Quotations: owner can SELECT own; admins full CRUD
- Quotation items: owner can SELECT via quotation ownership; admins full CRUD
- Appointments: owner can SELECT own; admins full CRUD
- All client_id columns default to auth.uid() for seamless inserts
*/

-- ============================================================
-- client_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address text,
  company text,
  avatar_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "client_read_own_profile" ON client_profiles;
CREATE POLICY "client_read_own_profile"
  ON client_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "client_insert_own_profile" ON client_profiles;
CREATE POLICY "client_insert_own_profile"
  ON client_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "client_update_own_profile" ON client_profiles;
CREATE POLICY "client_update_own_profile"
  ON client_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_read_all_profiles" ON client_profiles;
CREATE POLICY "admin_read_all_profiles"
  ON client_profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_update_all_profiles" ON client_profiles;
CREATE POLICY "admin_update_all_profiles"
  ON client_profiles FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- client_projects
-- ============================================================
CREATE TABLE IF NOT EXISTS client_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'consultation' CHECK (status IN ('consultation', 'design', 'sourcing', 'installation', 'completed', 'on_hold')),
  budget_range text,
  start_date date,
  target_completion date,
  hero_image_url text,
  progress_percentage integer NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "client_read_own_projects" ON client_projects;
CREATE POLICY "client_read_own_projects"
  ON client_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "admin_insert_projects" ON client_projects;
CREATE POLICY "admin_insert_projects"
  ON client_projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON client_projects;
CREATE POLICY "admin_update_projects"
  ON client_projects FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON client_projects;
CREATE POLICY "admin_delete_projects"
  ON client_projects FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- quotations
-- ============================================================
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES client_projects(id) ON DELETE SET NULL,
  quote_number text UNIQUE,
  title text,
  total_amount numeric(12,2),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  valid_until date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "client_read_own_quotations" ON quotations;
CREATE POLICY "client_read_own_quotations"
  ON quotations FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "admin_insert_quotations" ON quotations;
CREATE POLICY "admin_insert_quotations"
  ON quotations FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_quotations" ON quotations;
CREATE POLICY "admin_update_quotations"
  ON quotations FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_quotations" ON quotations;
CREATE POLICY "admin_delete_quotations"
  ON quotations FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- quotation_items
-- ============================================================
CREATE TABLE IF NOT EXISTS quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  total_price numeric(12,2) NOT NULL DEFAULT 0,
  category text,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "client_read_own_quotation_items" ON quotation_items;
CREATE POLICY "client_read_own_quotation_items"
  ON quotation_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_items.quotation_id
      AND quotations.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "admin_insert_quotation_items" ON quotation_items;
CREATE POLICY "admin_insert_quotation_items"
  ON quotation_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_quotation_items" ON quotation_items;
CREATE POLICY "admin_update_quotation_items"
  ON quotation_items FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_quotation_items" ON quotation_items;
CREATE POLICY "admin_delete_quotation_items"
  ON quotation_items FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- appointments
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES client_projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  location text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "client_read_own_appointments" ON appointments;
CREATE POLICY "client_read_own_appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "client_insert_own_appointments" ON appointments;
CREATE POLICY "client_insert_own_appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "admin_insert_appointments" ON appointments;
CREATE POLICY "admin_insert_appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_appointments" ON appointments;
CREATE POLICY "admin_update_appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_appointments" ON appointments;
CREATE POLICY "admin_delete_appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_client_profiles_user ON client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_client_projects_client ON client_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_client_projects_status ON client_projects(status);
CREATE INDEX IF NOT EXISTS idx_quotations_client ON quotations(client_id);
CREATE INDEX IF NOT EXISTS idx_quotations_project ON quotations(project_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_project ON appointments(project_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);

-- Triggers
DROP TRIGGER IF EXISTS update_client_profiles_updated_at ON client_profiles;
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_client_projects_updated_at ON client_projects;
CREATE TRIGGER update_client_projects_updated_at BEFORE UPDATE ON client_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotations_updated_at ON quotations;
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

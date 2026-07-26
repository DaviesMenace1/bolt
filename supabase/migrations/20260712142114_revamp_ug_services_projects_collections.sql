/*
# Revamp UG — Services, Projects & Collections (Parts 3-5)

## Overview
Creates tables for the three core business pillars:
1. Services — interior design, architecture, global sourcing, white-glove installation
2. Projects — portfolio of completed work with phases and galleries
3. Collections — curated product collections available for purchase

## New Tables

### services (Part 3)
- The four core service offerings
- id, slug, title, short_description, full_description, icon_name, hero_image_url, sort_order, is_active, created_at, updated_at

### service_features (Part 3)
- Bullet-point features under each service
- id, service_id (FK services), title, description, sort_order

### projects (Part 4)
- Portfolio projects with full metadata
- id, slug, title, client_name, location, project_type, style, budget_range, start_date, completion_date, description, hero_image_url, gallery_urls (text[]), is_featured, is_published, sort_order, created_at, updated_at

### project_phases (Part 4)
- Timeline phases for each project (consultation, design, sourcing, installation, reveal)
- id, project_id (FK projects), phase_name, description, start_date, end_date, sort_order

### collections (Part 5)
- Curated product collections (furniture, lighting, textiles, art, accessories)
- id, slug, name, description, category, hero_image_url, sort_order, is_active, created_at, updated_at

### collection_items (Part 5)
- Individual items within a collection
- id, collection_id (FK collections), name, description, price, image_url, source_country, material, dimensions, sort_order, is_active, created_at

## Security
- RLS enabled on all tables
- Public (anon) can SELECT active/published records
- Authenticated users have full CRUD
*/

-- ============================================================
-- services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text,
  full_description text,
  icon_name text,
  hero_image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_services" ON services;
CREATE POLICY "public_read_active_services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_services" ON services;
CREATE POLICY "admin_insert_services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services"
  ON services FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- service_features
-- ============================================================
CREATE TABLE IF NOT EXISTS service_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_service_features" ON service_features;
CREATE POLICY "public_read_service_features"
  ON service_features FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_service_features" ON service_features;
CREATE POLICY "admin_insert_service_features"
  ON service_features FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_service_features" ON service_features;
CREATE POLICY "admin_update_service_features"
  ON service_features FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_service_features" ON service_features;
CREATE POLICY "admin_delete_service_features"
  ON service_features FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  client_name text,
  location text,
  project_type text,
  style text,
  budget_range text,
  start_date date,
  completion_date date,
  description text,
  hero_image_url text,
  gallery_urls text[] DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_projects" ON projects;
CREATE POLICY "public_read_published_projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- project_phases
-- ============================================================
CREATE TABLE IF NOT EXISTS project_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_name text NOT NULL,
  description text,
  start_date date,
  end_date date,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_phases" ON project_phases;
CREATE POLICY "public_read_project_phases"
  ON project_phases FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_project_phases" ON project_phases;
CREATE POLICY "admin_insert_project_phases"
  ON project_phases FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_project_phases" ON project_phases;
CREATE POLICY "admin_update_project_phases"
  ON project_phases FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_project_phases" ON project_phases;
CREATE POLICY "admin_delete_project_phases"
  ON project_phases FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- collections
-- ============================================================
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text,
  hero_image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_collections" ON collections;
CREATE POLICY "public_read_active_collections"
  ON collections FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_collections" ON collections;
CREATE POLICY "admin_insert_collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_collections" ON collections;
CREATE POLICY "admin_update_collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_collections" ON collections;
CREATE POLICY "admin_delete_collections"
  ON collections FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- collection_items
-- ============================================================
CREATE TABLE IF NOT EXISTS collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2),
  image_url text,
  source_country text,
  material text,
  dimensions text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_collection_items" ON collection_items;
CREATE POLICY "public_read_active_collection_items"
  ON collection_items FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_collection_items" ON collection_items;
CREATE POLICY "admin_insert_collection_items"
  ON collection_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_collection_items" ON collection_items;
CREATE POLICY "admin_update_collection_items"
  ON collection_items FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_collection_items" ON collection_items;
CREATE POLICY "admin_delete_collection_items"
  ON collection_items FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_service_features_service ON service_features(service_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_project_phases_project ON project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_active ON collections(is_active);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);

-- Triggers
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

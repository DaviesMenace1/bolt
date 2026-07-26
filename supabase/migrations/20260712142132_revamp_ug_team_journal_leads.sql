/*
# Revamp UG — Team, Journal & Leads (Parts 6-8)

## Overview
Creates tables for:
1. Team members — designers, architects, and staff profiles
2. Journal — editorial blog/insights content
3. Leads — contact form submissions and consultation requests

## New Tables

### team_members (Part 6)
- Staff profiles displayed on About and Team pages
- id, slug, full_name, title, bio, specialties (text[]), image_url, email, phone, linkedin_url, instagram_url, sort_order, is_active, created_at, updated_at

### journal_posts (Part 7)
- Editorial journal/insights articles
- id, slug, title, excerpt, body, hero_image_url, author_id (FK team_members), category, tags (text[]), status, published_at, sort_order, created_at, updated_at

### leads (Part 8)
- Contact form submissions and consultation booking requests
- id, full_name, email, phone, project_type, budget_range, message, source_page, status, preferred_contact_date, created_at, updated_at
- status: 'new' | 'contacted' | 'qualified' | 'archived'

## Security
- RLS enabled on all tables
- Public (anon) can SELECT active/published team members and journal posts
- Public (anon) can INSERT leads (contact form submissions)
- Authenticated users have full CRUD on all
- Leads are INSERT-only for anon (no SELECT/UPDATE/DELETE) — sensitive client data
*/

-- ============================================================
-- team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  full_name text NOT NULL,
  title text,
  bio text,
  specialties text[] DEFAULT '{}',
  image_url text,
  email text,
  phone text,
  linkedin_url text,
  instagram_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_team" ON team_members;
CREATE POLICY "public_read_active_team"
  ON team_members FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_team" ON team_members;
CREATE POLICY "admin_insert_team"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_team" ON team_members;
CREATE POLICY "admin_update_team"
  ON team_members FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_team" ON team_members;
CREATE POLICY "admin_delete_team"
  ON team_members FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- journal_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS journal_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  body text,
  hero_image_url text,
  author_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  category text,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE journal_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_journal" ON journal_posts;
CREATE POLICY "public_read_published_journal"
  ON journal_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "admin_insert_journal" ON journal_posts;
CREATE POLICY "admin_insert_journal"
  ON journal_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_journal" ON journal_posts;
CREATE POLICY "admin_update_journal"
  ON journal_posts FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_journal" ON journal_posts;
CREATE POLICY "admin_delete_journal"
  ON journal_posts FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- leads
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  project_type text,
  budget_range text,
  message text,
  source_page text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'archived')),
  preferred_contact_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anon can INSERT leads (contact form) but cannot SELECT/UPDATE/DELETE
DROP POLICY IF EXISTS "public_insert_leads" ON leads;
CREATE POLICY "public_insert_leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_leads" ON leads;
CREATE POLICY "admin_select_leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_update_leads" ON leads;
CREATE POLICY "admin_update_leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_leads" ON leads;
CREATE POLICY "admin_delete_leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_team_slug ON team_members(slug);
CREATE INDEX IF NOT EXISTS idx_team_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_journal_slug ON journal_posts(slug);
CREATE INDEX IF NOT EXISTS idx_journal_status ON journal_posts(status);
CREATE INDEX IF NOT EXISTS idx_journal_published_at ON journal_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_journal_category ON journal_posts(category);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Triggers
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_journal_posts_updated_at ON journal_posts;
CREATE TRIGGER update_journal_posts_updated_at BEFORE UPDATE ON journal_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

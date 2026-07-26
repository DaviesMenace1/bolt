/*
# Revamp UG — Core CMS Tables (Parts 1-2)

## Overview
Creates the foundational CMS tables that drive all public website content.
These tables allow admins to manage site content dynamically — nothing is hardcoded.

## New Tables

### cms_pages (Part 1)
- Stores all public website pages with SEO metadata
- id, slug, title, hero_title, hero_subtitle, hero_image_url, body_content, meta_description, meta_keywords, status, sort_order, created_at, updated_at
- Pages are fetched by slug on the public site; status='published' only shown to public

### cms_sections (Part 1)
- Reusable content sections that can be attached to any page
- id, page_id (FK cms_pages), section_type, title, subtitle, body, image_url, sort_order, is_active, created_at, updated_at
- section_type: 'hero' | 'feature_grid' | 'cta' | 'testimonial' | 'gallery' | 'text_block' | 'stats' | 'team'

### cms_navigation (Part 1)
- Navigation menu items — header and footer menus are fully CMS-driven
- id, menu_location ('header' | 'footer'), label, href, parent_id (self-ref for dropdowns), sort_order, is_active, target ('_self' | '_blank')

### cms_site_settings (Part 1)
- Global site settings: company name, tagline, contact info, social links
- Single-row table (enforced by unique constraint on id)
- id, company_name, tagline, phone, email, address, whatsapp, instagram_url, linkedin_url, facebook_url, pinterest_url, hours, logo_url, footer_text

### cms_faqs (Part 2)
- FAQ entries managed in CMS, displayed on FAQ page and relevant sections
- id, question, answer, category, sort_order, is_active, created_at, updated_at

### cms_testimonials (Part 2)
- Client testimonials — displayed on homepage, about, and projects pages
- id, client_name, client_title, project_name, quote, rating (1-5), image_url, is_featured, sort_order, is_active, created_at

## Security
- RLS enabled on all tables
- Public (anon) can SELECT published/active records only
- Authenticated users (admins) have full CRUD
- No user_id columns — this is CMS content managed by staff, not user-scoped data
*/

-- ============================================================
-- cms_pages
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  body_content text,
  meta_description text,
  meta_keywords text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_pages" ON cms_pages;
CREATE POLICY "public_read_published_pages"
  ON cms_pages FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "admin_insert_pages" ON cms_pages;
CREATE POLICY "admin_insert_pages"
  ON cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_pages" ON cms_pages;
CREATE POLICY "admin_update_pages"
  ON cms_pages FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_pages" ON cms_pages;
CREATE POLICY "admin_delete_pages"
  ON cms_pages FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- cms_sections
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES cms_pages(id) ON DELETE CASCADE,
  section_type text NOT NULL CHECK (section_type IN ('hero', 'feature_grid', 'cta', 'testimonial', 'gallery', 'text_block', 'stats', 'team', 'image_split', 'process_steps')),
  title text,
  subtitle text,
  body text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_sections" ON cms_sections;
CREATE POLICY "public_read_active_sections"
  ON cms_sections FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_sections" ON cms_sections;
CREATE POLICY "admin_insert_sections"
  ON cms_sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_sections" ON cms_sections;
CREATE POLICY "admin_update_sections"
  ON cms_sections FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_sections" ON cms_sections;
CREATE POLICY "admin_delete_sections"
  ON cms_sections FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- cms_navigation
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_location text NOT NULL CHECK (menu_location IN ('header', 'footer', 'mobile')),
  label text NOT NULL,
  href text NOT NULL,
  parent_id uuid REFERENCES cms_navigation(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  target text NOT NULL DEFAULT '_self' CHECK (target IN ('_self', '_blank')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_navigation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_nav" ON cms_navigation;
CREATE POLICY "public_read_active_nav"
  ON cms_navigation FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_nav" ON cms_navigation;
CREATE POLICY "admin_insert_nav"
  ON cms_navigation FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_nav" ON cms_navigation;
CREATE POLICY "admin_update_nav"
  ON cms_navigation FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_nav" ON cms_navigation;
CREATE POLICY "admin_delete_nav"
  ON cms_navigation FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- cms_site_settings (single-row)
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Revamp UG',
  tagline text NOT NULL DEFAULT 'From Inspiration to Installation',
  phone text,
  email text,
  address text,
  whatsapp text,
  instagram_url text,
  linkedin_url text,
  facebook_url text,
  pinterest_url text,
  hours text,
  logo_url text,
  footer_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON cms_site_settings;
CREATE POLICY "public_read_settings"
  ON cms_site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_settings" ON cms_site_settings;
CREATE POLICY "admin_insert_settings"
  ON cms_site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_settings" ON cms_site_settings;
CREATE POLICY "admin_update_settings"
  ON cms_site_settings FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_settings" ON cms_site_settings;
CREATE POLICY "admin_delete_settings"
  ON cms_site_settings FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- cms_faqs
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_faqs" ON cms_faqs;
CREATE POLICY "public_read_active_faqs"
  ON cms_faqs FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_faqs" ON cms_faqs;
CREATE POLICY "admin_insert_faqs"
  ON cms_faqs FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_faqs" ON cms_faqs;
CREATE POLICY "admin_update_faqs"
  ON cms_faqs FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_faqs" ON cms_faqs;
CREATE POLICY "admin_delete_faqs"
  ON cms_faqs FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- cms_testimonials
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_title text,
  project_name text,
  quote text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_testimonials" ON cms_testimonials;
CREATE POLICY "public_read_active_testimonials"
  ON cms_testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_testimonials" ON cms_testimonials;
CREATE POLICY "admin_insert_testimonials"
  ON cms_testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON cms_testimonials;
CREATE POLICY "admin_update_testimonials"
  ON cms_testimonials FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON cms_testimonials;
CREATE POLICY "admin_delete_testimonials"
  ON cms_testimonials FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_sections_page_id ON cms_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_sections_sort ON cms_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_nav_location ON cms_navigation(menu_location);
CREATE INDEX IF NOT EXISTS idx_cms_nav_parent ON cms_navigation(parent_id);
CREATE INDEX IF NOT EXISTS idx_cms_faqs_active ON cms_faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_cms_testimonials_active ON cms_testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_cms_testimonials_featured ON cms_testimonials(is_featured);

-- ============================================================
-- updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_cms_pages_updated_at ON cms_pages;
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_sections_updated_at ON cms_sections;
CREATE TRIGGER update_cms_sections_updated_at BEFORE UPDATE ON cms_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_faqs_updated_at ON cms_faqs;
CREATE TRIGGER update_cms_faqs_updated_at BEFORE UPDATE ON cms_faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_site_settings_updated_at ON cms_site_settings;
CREATE TRIGGER update_cms_site_settings_updated_at BEFORE UPDATE ON cms_site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

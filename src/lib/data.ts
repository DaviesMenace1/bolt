import { supabase } from "./supabase"

export type Page = {
  id: string
  slug: string
  title: string
  hero_title: string | null
  hero_subtitle: string | null
  hero_image_url: string | null
  body_content: string | null
  meta_description: string | null
  status: string
  sort_order: number
}

export type Section = {
  id: string
  page_id: string | null
  section_type: string
  title: string | null
  subtitle: string | null
  body: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
}

export type NavItem = {
  id: string
  menu_location: string
  label: string
  href: string
  parent_id: string | null
  sort_order: number
  is_active: boolean
  target: string
}

export type SiteSettings = {
  id: string
  company_name: string
  tagline: string
  phone: string | null
  email: string | null
  address: string | null
  whatsapp: string | null
  instagram_url: string | null
  linkedin_url: string | null
  facebook_url: string | null
  pinterest_url: string | null
  hours: string | null
  logo_url: string | null
  footer_text: string | null
}

export type Service = {
  id: string
  slug: string
  title: string
  short_description: string | null
  full_description: string | null
  icon_name: string | null
  hero_image_url: string | null
  sort_order: number
  is_active: boolean
}

export type ServiceFeature = {
  id: string
  service_id: string
  title: string
  description: string | null
  sort_order: number
}

export type Project = {
  id: string
  slug: string
  title: string
  client_name: string | null
  location: string | null
  project_type: string | null
  style: string | null
  budget_range: string | null
  start_date: string | null
  completion_date: string | null
  description: string | null
  hero_image_url: string | null
  gallery_urls: string[]
  is_featured: boolean
  is_published: boolean
  sort_order: number
}

export type ProjectPhase = {
  id: string
  project_id: string
  phase_name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  sort_order: number
}

export type Collection = {
  id: string
  slug: string
  name: string
  description: string | null
  category: string | null
  hero_image_url: string | null
  sort_order: number
  is_active: boolean
}

export type CollectionItem = {
  id: string
  collection_id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  source_country: string | null
  material: string | null
  dimensions: string | null
  sort_order: number
  is_active: boolean
}

export type TeamMember = {
  id: string
  slug: string
  full_name: string
  title: string | null
  bio: string | null
  specialties: string[]
  image_url: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  instagram_url: string | null
  sort_order: number
  is_active: boolean
}

export type JournalPost = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  body: string | null
  hero_image_url: string | null
  author_id: string | null
  category: string | null
  tags: string[]
  status: string
  published_at: string | null
  sort_order: number
}

export type FAQ = {
  id: string
  question: string
  answer: string
  category: string | null
  sort_order: number
  is_active: boolean
}

export type Testimonial = {
  id: string
  client_name: string
  client_title: string | null
  project_name: string | null
  quote: string
  rating: number
  image_url: string | null
  is_featured: boolean
  sort_order: number
  is_active: boolean
}

export type Lead = {
  id: string
  full_name: string
  email: string
  phone: string | null
  project_type: string | null
  budget_range: string | null
  message: string | null
  source_page: string | null
  status: string
  preferred_contact_date: string | null
  created_at: string
}

// ============================================================
// Data access functions
// ============================================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("cms_site_settings")
    .select("*")
    .limit(1)
    .maybeSingle()
  if (error) {
    console.error("Error fetching site settings:", error)
    return null
  }
  return data as SiteSettings | null
}

export async function getNavigation(location: string): Promise<NavItem[]> {
  const { data, error } = await supabase
    .from("cms_navigation")
    .select("*")
    .eq("menu_location", location)
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching navigation:", error)
    return []
  }
  return (data || []) as NavItem[]
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) {
    console.error("Error fetching page:", error)
    return null
  }
  return data as Page | null
}

export async function getPageSections(pageId: string): Promise<Section[]> {
  const { data, error } = await supabase
    .from("cms_sections")
    .select("*")
    .eq("page_id", pageId)
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching sections:", error)
    return []
  }
  return (data || []) as Section[]
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching services:", error)
    return []
  }
  return (data || []) as Service[]
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()
  if (error) {
    console.error("Error fetching service:", error)
    return null
  }
  return data as Service | null
}

export async function getServiceFeatures(serviceId: string): Promise<ServiceFeature[]> {
  const { data, error } = await supabase
    .from("service_features")
    .select("*")
    .eq("service_id", serviceId)
    .order("sort_order")
  if (error) {
    console.error("Error fetching service features:", error)
    return []
  }
  return (data || []) as ServiceFeature[]
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }
  return (data || []) as Project[]
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching featured projects:", error)
    return []
  }
  return (data || []) as Project[]
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()
  if (error) {
    console.error("Error fetching project:", error)
    return null
  }
  return data as Project | null
}

export async function getProjectPhases(projectId: string): Promise<ProjectPhase[]> {
  const { data, error } = await supabase
    .from("project_phases")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order")
  if (error) {
    console.error("Error fetching project phases:", error)
    return []
  }
  return (data || []) as ProjectPhase[]
}

export async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching collections:", error)
    return []
  }
  return (data || []) as Collection[]
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()
  if (error) {
    console.error("Error fetching collection:", error)
    return null
  }
  return data as Collection | null
}

export async function getCollectionItems(collectionId: string): Promise<CollectionItem[]> {
  const { data, error } = await supabase
    .from("collection_items")
    .select("*")
    .eq("collection_id", collectionId)
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching collection items:", error)
    return []
  }
  return (data || []) as CollectionItem[]
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching team members:", error)
    return []
  }
  return (data || []) as TeamMember[]
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
  if (error) {
    console.error("Error fetching journal posts:", error)
    return []
  }
  return (data || []) as JournalPost[]
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) {
    console.error("Error fetching journal post:", error)
    return null
  }
  return data as JournalPost | null
}

export async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from("cms_faqs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching FAQs:", error)
    return []
  }
  return (data || []) as FAQ[]
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("cms_testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
  return (data || []) as Testimonial[]
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("cms_testimonials")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order")
  if (error) {
    console.error("Error fetching featured testimonials:", error)
    return []
  }
  return (data || []) as Testimonial[]
}

export async function submitLead(lead: {
  full_name: string
  email: string
  phone?: string
  project_type?: string
  budget_range?: string
  message?: string
  source_page?: string
  preferred_contact_date?: string
}): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase.from("leads").insert({
    full_name: lead.full_name,
    email: lead.email,
    phone: lead.phone || null,
    project_type: lead.project_type || null,
    budget_range: lead.budget_range || null,
    message: lead.message || null,
    source_page: lead.source_page || null,
    preferred_contact_date: lead.preferred_contact_date || null,
    status: "new",
  })
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true, error: null }
}

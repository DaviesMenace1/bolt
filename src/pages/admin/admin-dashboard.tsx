import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Inbox, FolderOpen, FileText, Users, TrendingUp, Clock } from "lucide-react"

type Stats = {
  newLeads: number
  totalProjects: number
  publishedPages: number
  teamMembers: number
}

type RecentLead = {
  id: string
  full_name: string
  email: string
  project_type: string | null
  status: string
  created_at: string
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ newLeads: 0, totalProjects: 0, publishedPages: 0, teamMembers: 0 })
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("cms_pages").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("team_members").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
    ]).then(([l, p, pages, team, recent]) => {
      setStats({
        newLeads: l.count || 0,
        totalProjects: p.count || 0,
        publishedPages: pages.count || 0,
        teamMembers: team.count || 0,
      })
      setRecentLeads((recent.data || []) as RecentLead[])
    })
  }, [])

  const statCards = [
    { label: "New Leads", value: stats.newLeads, icon: Inbox, href: "/admin/leads", color: "text-accent" },
    { label: "Published Projects", value: stats.totalProjects, icon: FolderOpen, href: "/admin/projects", color: "text-accent" },
    { label: "Published Pages", value: stats.publishedPages, icon: FileText, href: "/admin/pages", color: "text-accent" },
    { label: "Team Members", value: stats.teamMembers, icon: Users, href: "/admin/team", color: "text-accent" },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl tracking-luxe mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} to={s.href} className="bg-card border border-border/40 p-6 hover:border-accent/40 transition-colors">
              <Icon className={`h-8 w-8 ${s.color} mb-3`} />
              <p className="font-display text-3xl">{s.value}</p>
              <p className="font-sans text-sm text-muted-foreground">{s.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl tracking-luxe">Recent Leads</h2>
            <Link to="/admin/leads" className="text-sm font-sans text-accent hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <p className="font-serif text-muted-foreground">No leads yet.</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="bg-card border border-border/40 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-sans text-sm font-medium">{lead.full_name}</p>
                      <p className="font-sans text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                    <span className={`text-xs font-sans px-2 py-1 rounded-sm ${
                      lead.status === "new" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  {lead.project_type && (
                    <p className="font-sans text-xs text-muted-foreground mt-2">{lead.project_type}</p>
                  )}
                  <p className="font-sans text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl tracking-luxe mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/pages" className="block bg-card border border-border/40 p-4 hover:border-accent/40 transition-colors">
              <FileText className="h-5 w-5 text-accent mb-2" />
              <p className="font-sans text-sm font-medium">Edit Page Content</p>
              <p className="font-sans text-xs text-muted-foreground">Update homepage, about, and other pages</p>
            </Link>
            <Link to="/admin/services" className="block bg-card border border-border/40 p-4 hover:border-accent/40 transition-colors">
              <TrendingUp className="h-5 w-5 text-accent mb-2" />
              <p className="font-sans text-sm font-medium">Manage Services</p>
              <p className="font-sans text-xs text-muted-foreground">Add or update service offerings</p>
            </Link>
            <Link to="/admin/projects" className="block bg-card border border-border/40 p-4 hover:border-accent/40 transition-colors">
              <FolderOpen className="h-5 w-5 text-accent mb-2" />
              <p className="font-sans text-sm font-medium">Add Project</p>
              <p className="font-sans text-xs text-muted-foreground">Publish new portfolio work</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

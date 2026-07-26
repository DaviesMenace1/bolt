import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, Calendar, FileText, FolderOpen, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

type ClientProject = {
  id: string
  title: string
  description: string | null
  status: string
  budget_range: string | null
  start_date: string | null
  target_completion: string | null
  hero_image_url: string | null
  progress_percentage: number
}

type Quotation = {
  id: string
  quote_number: string | null
  title: string | null
  total_amount: number | null
  status: string
  valid_until: string | null
  project_id: string | null
}

type Appointment = {
  id: string
  title: string
  description: string | null
  scheduled_at: string
  duration_minutes: number
  location: string | null
  status: string
}

export function PortalDashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ClientProject[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [profileName, setProfileName] = useState<string>("")

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from("client_projects").select("*").eq("client_id", user.id).order("created_at", { ascending: false }),
      supabase.from("quotations").select("*").eq("client_id", user.id).order("created_at", { ascending: false }),
      supabase.from("appointments").select("*").eq("client_id", user.id).order("scheduled_at", { ascending: true }),
      supabase.from("client_profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
    ]).then(([p, q, a, prof]) => {
      setProjects(p.data as ClientProject[] || [])
      setQuotations(q.data as Quotation[] || [])
      setAppointments(a.data as Appointment[] || [])
      if (prof.data) setProfileName((prof.data as { full_name: string }).full_name || "")
    })
  }, [user])

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "scheduled" && new Date(a.scheduled_at) >= new Date()
  )

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mb-2">Client Portal</p>
            <h1 className="font-display text-3xl tracking-luxe">
              Welcome{profileName ? `, ${profileName}` : ""}
            </h1>
          </div>
          <Button variant="outline" onClick={() => { signOut(); navigate("/") }} className="font-sans">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border border-border/40 p-6">
            <FolderOpen className="h-8 w-8 text-accent mb-3" />
            <p className="font-display text-3xl">{projects.length}</p>
            <p className="font-sans text-sm text-muted-foreground">Active Projects</p>
          </div>
          <div className="bg-card border border-border/40 p-6">
            <FileText className="h-8 w-8 text-accent mb-3" />
            <p className="font-display text-3xl">{quotations.length}</p>
            <p className="font-sans text-sm text-muted-foreground">Quotations</p>
          </div>
          <div className="bg-card border border-border/40 p-6">
            <Calendar className="h-8 w-8 text-accent mb-3" />
            <p className="font-display text-3xl">{upcomingAppointments.length}</p>
            <p className="font-sans text-sm text-muted-foreground">Upcoming Appointments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl tracking-luxe mb-6">Your Projects</h2>
            {projects.length === 0 ? (
              <p className="font-serif text-lg text-muted-foreground">
                No projects yet. <Link to="/contact" className="text-accent hover:underline">Start one</Link>.
              </p>
            ) : (
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="bg-card border border-border/40 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-lg tracking-luxe">{p.title}</h3>
                      <span className="text-xs font-sans px-3 py-1 border border-border/40 rounded-sm text-accent">
                        {p.status.replace("_", " ")}
                      </span>
                    </div>
                    {p.description && <p className="font-serif text-sm text-muted-foreground mb-4">{p.description}</p>}
                    <div className="flex items-center gap-4 text-xs font-sans text-muted-foreground">
                      {p.start_date && <span>Started: {new Date(p.start_date).toLocaleDateString()}</span>}
                      {p.target_completion && <span>Target: {new Date(p.target_completion).toLocaleDateString()}</span>}
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-sans mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-accent">{p.progress_percentage}%</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${p.progress_percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-luxe mb-6">Quotations</h2>
            {quotations.length === 0 ? (
              <p className="font-serif text-lg text-muted-foreground">No quotations yet.</p>
            ) : (
              <div className="space-y-4 mb-12">
                {quotations.map((q) => (
                  <div key={q.id} className="bg-card border border-border/40 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-lg tracking-luxe">
                        {q.quote_number || q.title || "Quotation"}
                      </h3>
                      <span className="text-xs font-sans px-3 py-1 border border-border/40 rounded-sm text-accent">
                        {q.status}
                      </span>
                    </div>
                    {q.total_amount != null && (
                      <p className="font-display text-2xl text-accent">${q.total_amount.toLocaleString()}</p>
                    )}
                    {q.valid_until && (
                      <p className="font-sans text-xs text-muted-foreground mt-2">
                        Valid until: {new Date(q.valid_until).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h2 className="font-display text-2xl tracking-luxe mb-6">Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <p className="font-serif text-lg text-muted-foreground">No upcoming appointments.</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((a) => (
                  <div key={a.id} className="bg-card border border-border/40 p-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-accent mt-1" />
                      <div>
                        <h3 className="font-display text-lg tracking-luxe">{a.title}</h3>
                        <p className="font-sans text-sm text-muted-foreground mt-1">
                          {new Date(a.scheduled_at).toLocaleDateString()} at{" "}
                          {new Date(a.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground mt-1">
                          Duration: {a.duration_minutes} min
                          {a.location ? ` — ${a.location}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

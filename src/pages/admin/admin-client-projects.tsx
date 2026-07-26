import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Pencil, Trash2 } from "lucide-react"

type ClientProject = {
  id: string
  client_id: string
  title: string
  description: string | null
  status: string
  budget_range: string | null
  start_date: string | null
  target_completion: string | null
  hero_image_url: string | null
  progress_percentage: number
}

type ClientProfile = { id: string; user_id: string; full_name: string | null }

export function AdminClientProjectsPage() {
  const [projects, setProjects] = useState<ClientProject[]>([])
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [editing, setEditing] = useState<ClientProject | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadProjects()
    supabase.from("client_profiles").select("id, user_id, full_name").order("full_name").then(({ data }) => {
      setClients((data || []) as ClientProfile[])
    })
  }, [])

  function loadProjects() {
    supabase.from("client_projects").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setProjects((data || []) as ClientProject[])
    })
  }

  function openNew() {
    setEditing({ id: "", client_id: "", title: "", description: null, status: "consultation", budget_range: null, start_date: null, target_completion: null, hero_image_url: null, progress_percentage: 0 })
    setOpen(true)
  }

  function openEdit(p: ClientProject) { setEditing(p); setOpen(true) }

  async function handleSave() {
    if (!editing || !editing.title || !editing.client_id) { toast.error("Title and client required"); return }
    if (editing.id) {
      const { error } = await supabase.from("client_projects").update(editing).eq("id", editing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Project updated")
    } else {
      const { error } = await supabase.from("client_projects").insert(editing)
      if (error) { toast.error(error.message); return }
      toast.success("Project created")
    }
    setOpen(false)
    loadProjects()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("client_projects").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Project deleted")
    loadProjects()
  }

  const clientName = (clientId: string) => clients.find(c => c.user_id === clientId)?.full_name || "Unknown"

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl tracking-luxe">Client Projects</h1>
        <Button onClick={openNew} className="font-sans"><Plus className="h-4 w-4 mr-2" /> New Project</Button>
      </div>

      <div className="bg-card border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Title</TableHead>
              <TableHead className="font-sans">Client</TableHead>
              <TableHead className="font-sans">Status</TableHead>
              <TableHead className="font-sans">Progress</TableHead>
              <TableHead className="font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-sans font-medium">{p.title}</TableCell>
                <TableCell className="font-sans text-muted-foreground">{clientName(p.client_id)}</TableCell>
                <TableCell><span className="text-xs font-sans px-2 py-1 rounded-sm bg-accent/15 text-accent">{p.status.replace("_", " ")}</span></TableCell>
                <TableCell className="font-sans text-muted-foreground">{p.progress_percentage}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display tracking-luxe">{editing?.id ? "Edit Project" : "New Client Project"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label className="font-sans text-sm mb-2">Client *</Label>
                <Select value={editing.client_id} onValueChange={(v) => setEditing({ ...editing, client_id: v })}>
                  <SelectTrigger className="font-sans"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => <SelectItem key={c.user_id} value={c.user_id}>{c.full_name || c.user_id}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="font-sans text-sm mb-2">Title *</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Description</Label><Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="font-sans" rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans text-sm mb-2">Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger className="font-sans"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="sourcing">Sourcing</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="font-sans text-sm mb-2">Budget Range</Label><Input value={editing.budget_range || ""} onChange={(e) => setEditing({ ...editing, budget_range: e.target.value })} className="font-sans" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Start Date</Label><Input type="date" value={editing.start_date || ""} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Target Completion</Label><Input type="date" value={editing.target_completion || ""} onChange={(e) => setEditing({ ...editing, target_completion: e.target.value })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Hero Image URL</Label><Input value={editing.hero_image_url || ""} onChange={(e) => setEditing({ ...editing, hero_image_url: e.target.value })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Progress (%)</Label><Input type="number" min="0" max="100" value={editing.progress_percentage} onChange={(e) => setEditing({ ...editing, progress_percentage: parseInt(e.target.value) || 0 })} className="font-sans" /></div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline" className="font-sans">Cancel</Button></DialogClose><Button onClick={handleSave} className="font-sans">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

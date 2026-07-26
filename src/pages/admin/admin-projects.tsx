import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Pencil, Trash2 } from "lucide-react"

type Project = {
  id: string
  slug: string
  title: string
  client_name: string | null
  location: string | null
  project_type: string | null
  style: string | null
  budget_range: string | null
  description: string | null
  hero_image_url: string | null
  gallery_urls: string[]
  is_featured: boolean
  is_published: boolean
  sort_order: number
}

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editing, setEditing] = useState<Project | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => { loadProjects() }, [])

  function loadProjects() {
    supabase.from("projects").select("*").order("sort_order").then(({ data }) => {
      setProjects((data || []) as Project[])
    })
  }

  function openNew() {
    setEditing({ id: "", slug: "", title: "", client_name: null, location: null, project_type: null, style: null, budget_range: null, description: null, hero_image_url: null, gallery_urls: [], is_featured: false, is_published: false, sort_order: 0 })
    setOpen(true)
  }

  function openEdit(p: Project) { setEditing(p); setOpen(true) }

  async function handleSave() {
    if (!editing || !editing.slug || !editing.title) { toast.error("Slug and title required"); return }
    if (editing.id) {
      const { error } = await supabase.from("projects").update(editing).eq("id", editing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Project updated")
    } else {
      const { error } = await supabase.from("projects").insert(editing)
      if (error) { toast.error(error.message); return }
      toast.success("Project created")
    }
    setOpen(false)
    loadProjects()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Project deleted")
    loadProjects()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl tracking-luxe">Projects</h1>
        <Button onClick={openNew} className="font-sans"><Plus className="h-4 w-4 mr-2" /> New Project</Button>
      </div>

      <div className="bg-card border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Title</TableHead>
              <TableHead className="font-sans">Location</TableHead>
              <TableHead className="font-sans">Type</TableHead>
              <TableHead className="font-sans">Published</TableHead>
              <TableHead className="font-sans">Featured</TableHead>
              <TableHead className="font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-sans font-medium">{p.title}</TableCell>
                <TableCell className="font-sans text-muted-foreground">{p.location}</TableCell>
                <TableCell className="font-sans text-muted-foreground">{p.project_type}</TableCell>
                <TableCell><span className={`text-xs font-sans px-2 py-1 rounded-sm ${p.is_published ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{p.is_published ? "Yes" : "No"}</span></TableCell>
                <TableCell><span className={`text-xs font-sans px-2 py-1 rounded-sm ${p.is_featured ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{p.is_featured ? "Yes" : "No"}</span></TableCell>
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
          <DialogHeader>
            <DialogTitle className="font-display tracking-luxe">{editing?.id ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Title *</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Slug *</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="font-sans" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Client Name</Label><Input value={editing.client_name || ""} onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Location</Label><Input value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="font-sans" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Project Type</Label><Input value={editing.project_type || ""} onChange={(e) => setEditing({ ...editing, project_type: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Style</Label><Input value={editing.style || ""} onChange={(e) => setEditing({ ...editing, style: e.target.value })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Budget Range</Label><Input value={editing.budget_range || ""} onChange={(e) => setEditing({ ...editing, budget_range: e.target.value })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Description</Label><Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="font-sans" rows={4} /></div>
              <div><Label className="font-sans text-sm mb-2">Hero Image URL</Label><Input value={editing.hero_image_url || ""} onChange={(e) => setEditing({ ...editing, hero_image_url: e.target.value })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Gallery URLs (one per line)</Label><Textarea value={(editing.gallery_urls || []).join("\n")} onChange={(e) => setEditing({ ...editing, gallery_urls: e.target.value.split("\n").filter(Boolean) })} className="font-sans" rows={3} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label className="font-sans text-sm mb-2">Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="font-sans" /></div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 font-sans text-sm cursor-pointer">
                    <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="h-4 w-4" /> Published
                  </label>
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 font-sans text-sm cursor-pointer">
                    <input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} className="h-4 w-4" /> Featured
                  </label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="font-sans">Cancel</Button></DialogClose>
            <Button onClick={handleSave} className="font-sans">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

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

type TeamMember = {
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

export function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => { loadMembers() }, [])

  function loadMembers() {
    supabase.from("team_members").select("*").order("sort_order").then(({ data }) => {
      setMembers((data || []) as TeamMember[])
    })
  }

  function openNew() {
    setEditing({ id: "", slug: "", full_name: "", title: null, bio: null, specialties: [], image_url: null, email: null, phone: null, linkedin_url: null, instagram_url: null, sort_order: 0, is_active: true })
    setOpen(true)
  }

  function openEdit(m: TeamMember) { setEditing(m); setOpen(true) }

  async function handleSave() {
    if (!editing || !editing.slug || !editing.full_name) { toast.error("Slug and name required"); return }
    if (editing.id) {
      const { error } = await supabase.from("team_members").update(editing).eq("id", editing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Member updated")
    } else {
      const { error } = await supabase.from("team_members").insert(editing)
      if (error) { toast.error(error.message); return }
      toast.success("Member added")
    }
    setOpen(false)
    loadMembers()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("team_members").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Member deleted")
    loadMembers()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl tracking-luxe">Team</h1>
        <Button onClick={openNew} className="font-sans"><Plus className="h-4 w-4 mr-2" /> New Member</Button>
      </div>

      <div className="bg-card border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Name</TableHead>
              <TableHead className="font-sans">Title</TableHead>
              <TableHead className="font-sans">Active</TableHead>
              <TableHead className="font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-sans font-medium">{m.full_name}</TableCell>
                <TableCell className="font-sans text-muted-foreground">{m.title}</TableCell>
                <TableCell><span className={`text-xs font-sans px-2 py-1 rounded-sm ${m.is_active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{m.is_active ? "Yes" : "No"}</span></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display tracking-luxe">{editing?.id ? "Edit Member" : "New Member"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Full Name *</Label><Input value={editing.full_name} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Slug *</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Title</Label><Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Bio</Label><Textarea value={editing.bio || ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} className="font-sans" rows={4} /></div>
              <div><Label className="font-sans text-sm mb-2">Specialties (comma-separated)</Label><Input value={editing.specialties.join(", ")} onChange={(e) => setEditing({ ...editing, specialties: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Image URL</Label><Input value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="font-sans" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Email</Label><Input value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Phone</Label><Input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="font-sans" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">LinkedIn URL</Label><Input value={editing.linkedin_url || ""} onChange={(e) => setEditing({ ...editing, linkedin_url: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Instagram URL</Label><Input value={editing.instagram_url || ""} onChange={(e) => setEditing({ ...editing, instagram_url: e.target.value })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="font-sans" /></div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline" className="font-sans">Cancel</Button></DialogClose><Button onClick={handleSave} className="font-sans">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

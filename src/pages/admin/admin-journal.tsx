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

type JournalPost = {
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

type TeamMember = { id: string; full_name: string }

export function AdminJournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([])
  const [authors, setAuthors] = useState<TeamMember[]>([])
  const [editing, setEditing] = useState<JournalPost | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadPosts()
    supabase.from("team_members").select("id, full_name").order("full_name").then(({ data }) => {
      setAuthors((data || []) as TeamMember[])
    })
  }, [])

  function loadPosts() {
    supabase.from("journal_posts").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setPosts((data || []) as JournalPost[])
    })
  }

  function openNew() {
    setEditing({ id: "", slug: "", title: "", excerpt: null, body: null, hero_image_url: null, author_id: null, category: null, tags: [], status: "draft", published_at: null, sort_order: 0 })
    setOpen(true)
  }

  function openEdit(p: JournalPost) { setEditing(p); setOpen(true) }

  async function handleSave() {
    if (!editing || !editing.slug || !editing.title) { toast.error("Slug and title required"); return }
    const payload = { ...editing }
    if (editing.status === "published" && !editing.published_at) {
      payload.published_at = new Date().toISOString()
    }
    if (editing.id) {
      const { error } = await supabase.from("journal_posts").update(payload).eq("id", editing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Post updated")
    } else {
      const { error } = await supabase.from("journal_posts").insert(payload)
      if (error) { toast.error(error.message); return }
      toast.success("Post created")
    }
    setOpen(false)
    loadPosts()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("journal_posts").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Post deleted")
    loadPosts()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl tracking-luxe">Journal</h1>
        <Button onClick={openNew} className="font-sans"><Plus className="h-4 w-4 mr-2" /> New Post</Button>
      </div>

      <div className="bg-card border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Title</TableHead>
              <TableHead className="font-sans">Category</TableHead>
              <TableHead className="font-sans">Status</TableHead>
              <TableHead className="font-sans">Published</TableHead>
              <TableHead className="font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-sans font-medium">{p.title}</TableCell>
                <TableCell className="font-sans text-muted-foreground">{p.category}</TableCell>
                <TableCell><span className={`text-xs font-sans px-2 py-1 rounded-sm ${p.status === "published" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{p.status}</span></TableCell>
                <TableCell className="font-sans text-muted-foreground">{p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}</TableCell>
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
          <DialogHeader><DialogTitle className="font-display tracking-luxe">{editing?.id ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Title *</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Slug *</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Excerpt</Label><Textarea value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="font-sans" rows={2} /></div>
              <div><Label className="font-sans text-sm mb-2">Body</Label><Textarea value={editing.body || ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="font-sans" rows={6} /></div>
              <div><Label className="font-sans text-sm mb-2">Hero Image URL</Label><Input value={editing.hero_image_url || ""} onChange={(e) => setEditing({ ...editing, hero_image_url: e.target.value })} className="font-sans" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans text-sm mb-2">Author</Label>
                  <Select value={editing.author_id || ""} onValueChange={(v) => setEditing({ ...editing, author_id: v })}>
                    <SelectTrigger className="font-sans"><SelectValue placeholder="Select author" /></SelectTrigger>
                    <SelectContent>
                      {authors.map((a) => <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="font-sans text-sm mb-2">Category</Label><Input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Tags (comma-separated)</Label><Input value={editing.tags.join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="font-sans" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans text-sm mb-2">Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger className="font-sans"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="font-sans text-sm mb-2">Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="font-sans" /></div>
              </div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline" className="font-sans">Cancel</Button></DialogClose><Button onClick={handleSave} className="font-sans">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

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

type Page = {
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

export function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [editing, setEditing] = useState<Page | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadPages()
  }, [])

  function loadPages() {
    supabase.from("cms_pages").select("*").order("sort_order").then(({ data }) => {
      setPages((data || []) as Page[])
    })
  }

  function openNew() {
    setEditing({
      id: "",
      slug: "",
      title: "",
      hero_title: null,
      hero_subtitle: null,
      hero_image_url: null,
      body_content: null,
      meta_description: null,
      status: "draft",
      sort_order: 0,
    })
    setOpen(true)
  }

  function openEdit(page: Page) {
    setEditing(page)
    setOpen(true)
  }

  async function handleSave() {
    if (!editing) return
    if (!editing.slug || !editing.title) {
      toast.error("Slug and title are required")
      return
    }
    if (editing.id) {
      const { error } = await supabase.from("cms_pages").update({
        slug: editing.slug,
        title: editing.title,
        hero_title: editing.hero_title,
        hero_subtitle: editing.hero_subtitle,
        hero_image_url: editing.hero_image_url,
        body_content: editing.body_content,
        meta_description: editing.meta_description,
        status: editing.status,
        sort_order: editing.sort_order,
      }).eq("id", editing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Page updated")
    } else {
      const { error } = await supabase.from("cms_pages").insert({
        slug: editing.slug,
        title: editing.title,
        hero_title: editing.hero_title,
        hero_subtitle: editing.hero_subtitle,
        hero_image_url: editing.hero_image_url,
        body_content: editing.body_content,
        meta_description: editing.meta_description,
        status: editing.status,
        sort_order: editing.sort_order,
      })
      if (error) { toast.error(error.message); return }
      toast.success("Page created")
    }
    setOpen(false)
    loadPages()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("cms_pages").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Page deleted")
    loadPages()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl tracking-luxe">Pages</h1>
        <Button onClick={openNew} className="font-sans">
          <Plus className="h-4 w-4 mr-2" /> New Page
        </Button>
      </div>

      <div className="bg-card border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Title</TableHead>
              <TableHead className="font-sans">Slug</TableHead>
              <TableHead className="font-sans">Status</TableHead>
              <TableHead className="font-sans">Order</TableHead>
              <TableHead className="font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-sans font-medium">{page.title}</TableCell>
                <TableCell className="font-sans text-muted-foreground">/{page.slug}</TableCell>
                <TableCell>
                  <span className={`text-xs font-sans px-2 py-1 rounded-sm ${
                    page.status === "published" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                  }`}>
                    {page.status}
                  </span>
                </TableCell>
                <TableCell className="font-sans text-muted-foreground">{page.sort_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(page)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(page.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
            <DialogTitle className="font-display tracking-luxe">
              {editing?.id ? "Edit Page" : "New Page"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans text-sm mb-2">Title *</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="font-sans" />
                </div>
                <div>
                  <Label className="font-sans text-sm mb-2">Slug *</Label>
                  <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="font-sans" />
                </div>
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Hero Title</Label>
                <Input value={editing.hero_title || ""} onChange={(e) => setEditing({ ...editing, hero_title: e.target.value })} className="font-sans" />
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Hero Subtitle</Label>
                <Textarea value={editing.hero_subtitle || ""} onChange={(e) => setEditing({ ...editing, hero_subtitle: e.target.value })} className="font-sans" rows={2} />
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Hero Image URL</Label>
                <Input value={editing.hero_image_url || ""} onChange={(e) => setEditing({ ...editing, hero_image_url: e.target.value })} className="font-sans" />
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Body Content</Label>
                <Textarea value={editing.body_content || ""} onChange={(e) => setEditing({ ...editing, body_content: e.target.value })} className="font-sans" rows={4} />
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Meta Description</Label>
                <Textarea value={editing.meta_description || ""} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} className="font-sans" rows={2} />
              </div>
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
                <div>
                  <Label className="font-sans text-sm mb-2">Sort Order</Label>
                  <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="font-sans" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="font-sans">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} className="font-sans">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

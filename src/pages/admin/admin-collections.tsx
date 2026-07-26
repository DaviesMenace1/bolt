import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react"

type Collection = {
  id: string
  slug: string
  name: string
  description: string | null
  category: string | null
  hero_image_url: string | null
  sort_order: number
  is_active: boolean
}

type CollectionItem = {
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

export function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [items, setItems] = useState<Record<string, CollectionItem[]>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<Collection | null>(null)
  const [open, setOpen] = useState(false)
  const [itemEditing, setItemEditing] = useState<CollectionItem | null>(null)
  const [itemOpen, setItemOpen] = useState(false)
  const [itemCollectionId, setItemCollectionId] = useState<string | null>(null)

  useEffect(() => { loadCollections() }, [])

  function loadCollections() {
    supabase.from("collections").select("*").order("sort_order").then(({ data }) => {
      setCollections((data || []) as Collection[])
    })
  }

  async function loadItems(collectionId: string) {
    const { data } = await supabase.from("collection_items").select("*").eq("collection_id", collectionId).order("sort_order")
    setItems((prev) => ({ ...prev, [collectionId]: (data || []) as CollectionItem[] }))
  }

  function openNew() {
    setEditing({ id: "", slug: "", name: "", description: null, category: null, hero_image_url: null, sort_order: 0, is_active: true })
    setOpen(true)
  }

  function openEdit(c: Collection) { setEditing(c); setOpen(true) }

  async function handleSave() {
    if (!editing || !editing.slug || !editing.name) { toast.error("Slug and name required"); return }
    if (editing.id) {
      const { error } = await supabase.from("collections").update(editing).eq("id", editing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Collection updated")
    } else {
      const { error } = await supabase.from("collections").insert(editing)
      if (error) { toast.error(error.message); return }
      toast.success("Collection created")
    }
    setOpen(false)
    loadCollections()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("collections").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Collection deleted")
    loadCollections()
  }

  function openNewItem(collectionId: string) {
    setItemCollectionId(collectionId)
    setItemEditing({ id: "", collection_id: collectionId, name: "", description: null, price: null, image_url: null, source_country: null, material: null, dimensions: null, sort_order: 0, is_active: true })
    setItemOpen(true)
  }

  function openEditItem(item: CollectionItem) { setItemEditing(item); setItemOpen(true) }

  async function handleSaveItem() {
    if (!itemEditing || !itemEditing.name) { toast.error("Name required"); return }
    if (itemEditing.id) {
      const { error } = await supabase.from("collection_items").update(itemEditing).eq("id", itemEditing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Item updated")
    } else {
      const { error } = await supabase.from("collection_items").insert(itemEditing)
      if (error) { toast.error(error.message); return }
      toast.success("Item added")
    }
    setItemOpen(false)
    if (itemCollectionId) loadItems(itemCollectionId)
  }

  async function handleDeleteItem(id: string, collectionId: string) {
    const { error } = await supabase.from("collection_items").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Item deleted")
    loadItems(collectionId)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl tracking-luxe">Collections</h1>
        <Button onClick={openNew} className="font-sans"><Plus className="h-4 w-4 mr-2" /> New Collection</Button>
      </div>

      <div className="bg-card border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead className="font-sans">Name</TableHead>
              <TableHead className="font-sans">Category</TableHead>
              <TableHead className="font-sans">Active</TableHead>
              <TableHead className="font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((c) => (
              <>
                <TableRow key={c.id}>
                  <TableCell>
                    <button onClick={() => { if (expanded === c.id) { setExpanded(null) } else { setExpanded(c.id); loadItems(c.id) } }} className="text-muted-foreground hover:text-accent">
                      {expanded === c.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </TableCell>
                  <TableCell className="font-sans font-medium">{c.name}</TableCell>
                  <TableCell className="font-sans text-muted-foreground">{c.category}</TableCell>
                  <TableCell><span className={`text-xs font-sans px-2 py-1 rounded-sm ${c.is_active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{c.is_active ? "Yes" : "No"}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expanded === c.id && (
                  <TableRow key={c.id + "-items"}>
                    <TableCell colSpan={5} className="bg-muted/30">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="font-sans text-sm font-medium">Items</p>
                          <Button size="sm" variant="outline" onClick={() => openNewItem(c.id)} className="font-sans"><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
                        </div>
                        <div className="space-y-2">
                          {(items[c.id] || []).map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-card border border-border/40 p-3">
                              <div className="flex items-center gap-3">
                                {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 object-cover" />}
                                <div>
                                  <p className="font-sans text-sm font-medium">{item.name}</p>
                                  <p className="font-sans text-xs text-muted-foreground">{item.source_country} — ${item.price?.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openEditItem(item)}><Pencil className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id, c.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                              </div>
                            </div>
                          ))}
                          {(items[c.id] || []).length === 0 && <p className="font-sans text-xs text-muted-foreground">No items yet.</p>}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display tracking-luxe">{editing?.id ? "Edit Collection" : "New Collection"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Name *</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Slug *</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Category</Label><Input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Description</Label><Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="font-sans" rows={2} /></div>
              <div><Label className="font-sans text-sm mb-2">Hero Image URL</Label><Input value={editing.hero_image_url || ""} onChange={(e) => setEditing({ ...editing, hero_image_url: e.target.value })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="font-sans" /></div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline" className="font-sans">Cancel</Button></DialogClose><Button onClick={handleSave} className="font-sans">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={itemOpen} onOpenChange={setItemOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display tracking-luxe">{itemEditing?.id ? "Edit Item" : "New Item"}</DialogTitle></DialogHeader>
          {itemEditing && (
            <div className="space-y-4">
              <div><Label className="font-sans text-sm mb-2">Name *</Label><Input value={itemEditing.name} onChange={(e) => setItemEditing({ ...itemEditing, name: e.target.value })} className="font-sans" /></div>
              <div><Label className="font-sans text-sm mb-2">Description</Label><Textarea value={itemEditing.description || ""} onChange={(e) => setItemEditing({ ...itemEditing, description: e.target.value })} className="font-sans" rows={2} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Price ($)</Label><Input type="number" step="0.01" value={itemEditing.price || ""} onChange={(e) => setItemEditing({ ...itemEditing, price: parseFloat(e.target.value) || null })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Sort Order</Label><Input type="number" value={itemEditing.sort_order} onChange={(e) => setItemEditing({ ...itemEditing, sort_order: parseInt(e.target.value) || 0 })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Image URL</Label><Input value={itemEditing.image_url || ""} onChange={(e) => setItemEditing({ ...itemEditing, image_url: e.target.value })} className="font-sans" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-sm mb-2">Source Country</Label><Input value={itemEditing.source_country || ""} onChange={(e) => setItemEditing({ ...itemEditing, source_country: e.target.value })} className="font-sans" /></div>
                <div><Label className="font-sans text-sm mb-2">Material</Label><Input value={itemEditing.material || ""} onChange={(e) => setItemEditing({ ...itemEditing, material: e.target.value })} className="font-sans" /></div>
              </div>
              <div><Label className="font-sans text-sm mb-2">Dimensions</Label><Input value={itemEditing.dimensions || ""} onChange={(e) => setItemEditing({ ...itemEditing, dimensions: e.target.value })} className="font-sans" /></div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline" className="font-sans">Cancel</Button></DialogClose><Button onClick={handleSaveItem} className="font-sans">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

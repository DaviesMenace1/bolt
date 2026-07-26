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

type Service = {
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

type ServiceFeature = {
  id: string
  service_id: string
  title: string
  description: string | null
  sort_order: number
}

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [features, setFeatures] = useState<Record<string, ServiceFeature[]>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<Service | null>(null)
  const [open, setOpen] = useState(false)
  const [featureEditing, setFeatureEditing] = useState<ServiceFeature | null>(null)
  const [featureOpen, setFeatureOpen] = useState(false)
  const [featureServiceId, setFeatureServiceId] = useState<string | null>(null)

  useEffect(() => { loadServices() }, [])

  function loadServices() {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      setServices((data || []) as Service[])
    })
  }

  async function loadFeatures(serviceId: string) {
    const { data } = await supabase.from("service_features").select("*").eq("service_id", serviceId).order("sort_order")
    setFeatures((prev) => ({ ...prev, [serviceId]: (data || []) as ServiceFeature[] }))
  }

  function openNew() {
    setEditing({ id: "", slug: "", title: "", short_description: null, full_description: null, icon_name: null, hero_image_url: null, sort_order: 0, is_active: true })
    setOpen(true)
  }

  function openEdit(s: Service) {
    setEditing(s)
    setOpen(true)
  }

  async function handleSave() {
    if (!editing || !editing.slug || !editing.title) { toast.error("Slug and title required"); return }
    if (editing.id) {
      const { error } = await supabase.from("services").update(editing).eq("id", editing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Service updated")
    } else {
      const { error } = await supabase.from("services").insert(editing)
      if (error) { toast.error(error.message); return }
      toast.success("Service created")
    }
    setOpen(false)
    loadServices()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Service deleted")
    loadServices()
  }

  function openNewFeature(serviceId: string) {
    setFeatureServiceId(serviceId)
    setFeatureEditing({ id: "", service_id: serviceId, title: "", description: null, sort_order: 0 })
    setFeatureOpen(true)
  }

  function openEditFeature(f: ServiceFeature) {
    setFeatureEditing(f)
    setFeatureOpen(true)
  }

  async function handleSaveFeature() {
    if (!featureEditing || !featureEditing.title) { toast.error("Title required"); return }
    if (featureEditing.id) {
      const { error } = await supabase.from("service_features").update({
        title: featureEditing.title,
        description: featureEditing.description,
        sort_order: featureEditing.sort_order,
      }).eq("id", featureEditing.id)
      if (error) { toast.error(error.message); return }
      toast.success("Feature updated")
    } else {
      const { error } = await supabase.from("service_features").insert(featureEditing)
      if (error) { toast.error(error.message); return }
      toast.success("Feature added")
    }
    setFeatureOpen(false)
    if (featureServiceId) loadFeatures(featureServiceId)
  }

  async function handleDeleteFeature(id: string, serviceId: string) {
    const { error } = await supabase.from("service_features").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Feature deleted")
    loadFeatures(serviceId)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl tracking-luxe">Services</h1>
        <Button onClick={openNew} className="font-sans"><Plus className="h-4 w-4 mr-2" /> New Service</Button>
      </div>

      <div className="bg-card border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans w-8"></TableHead>
              <TableHead className="font-sans">Title</TableHead>
              <TableHead className="font-sans">Slug</TableHead>
              <TableHead className="font-sans">Active</TableHead>
              <TableHead className="font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <>
                <TableRow key={s.id}>
                  <TableCell>
                    <button onClick={() => {
                      if (expanded === s.id) { setExpanded(null) } else { setExpanded(s.id); loadFeatures(s.id) }
                    }} className="text-muted-foreground hover:text-accent">
                      {expanded === s.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </TableCell>
                  <TableCell className="font-sans font-medium">{s.title}</TableCell>
                  <TableCell className="font-sans text-muted-foreground">/{s.slug}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-sans px-2 py-1 rounded-sm ${s.is_active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expanded === s.id && (
                  <TableRow key={s.id + "-features"}>
                    <TableCell colSpan={5} className="bg-muted/30">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="font-sans text-sm font-medium">Features</p>
                          <Button size="sm" variant="outline" onClick={() => openNewFeature(s.id)} className="font-sans">
                            <Plus className="h-3 w-3 mr-1" /> Add Feature
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(features[s.id] || []).map((f) => (
                            <div key={f.id} className="flex items-center justify-between bg-card border border-border/40 p-3">
                              <div>
                                <p className="font-sans text-sm font-medium">{f.title}</p>
                                <p className="font-sans text-xs text-muted-foreground">{f.description}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openEditFeature(f)}><Pencil className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteFeature(f.id, s.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                              </div>
                            </div>
                          ))}
                          {(features[s.id] || []).length === 0 && <p className="font-sans text-xs text-muted-foreground">No features yet.</p>}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display tracking-luxe">{editing?.id ? "Edit Service" : "New Service"}</DialogTitle>
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
                <Label className="font-sans text-sm mb-2">Short Description</Label>
                <Textarea value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="font-sans" rows={2} />
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Full Description</Label>
                <Textarea value={editing.full_description || ""} onChange={(e) => setEditing({ ...editing, full_description: e.target.value })} className="font-sans" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans text-sm mb-2">Icon Name</Label>
                  <Input value={editing.icon_name || ""} onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })} className="font-sans" placeholder="palette, building, globe, sparkles" />
                </div>
                <div>
                  <Label className="font-sans text-sm mb-2">Sort Order</Label>
                  <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="font-sans" />
                </div>
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Hero Image URL</Label>
                <Input value={editing.hero_image_url || ""} onChange={(e) => setEditing({ ...editing, hero_image_url: e.target.value })} className="font-sans" />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="font-sans">Cancel</Button></DialogClose>
            <Button onClick={handleSave} className="font-sans">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={featureOpen} onOpenChange={setFeatureOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display tracking-luxe">{featureEditing?.id ? "Edit Feature" : "New Feature"}</DialogTitle>
          </DialogHeader>
          {featureEditing && (
            <div className="space-y-4">
              <div>
                <Label className="font-sans text-sm mb-2">Title *</Label>
                <Input value={featureEditing.title} onChange={(e) => setFeatureEditing({ ...featureEditing, title: e.target.value })} className="font-sans" />
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Description</Label>
                <Textarea value={featureEditing.description || ""} onChange={(e) => setFeatureEditing({ ...featureEditing, description: e.target.value })} className="font-sans" rows={3} />
              </div>
              <div>
                <Label className="font-sans text-sm mb-2">Sort Order</Label>
                <Input type="number" value={featureEditing.sort_order} onChange={(e) => setFeatureEditing({ ...featureEditing, sort_order: parseInt(e.target.value) || 0 })} className="font-sans" />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="font-sans">Cancel</Button></DialogClose>
            <Button onClick={handleSaveFeature} className="font-sans">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

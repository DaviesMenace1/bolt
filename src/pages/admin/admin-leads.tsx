import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Eye, Filter } from "lucide-react"

type Lead = {
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

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewing, setViewing] = useState<Lead | null>(null)

  useEffect(() => { loadLeads() }, [])

  function loadLeads() {
    let query = supabase.from("leads").select("*").order("created_at", { ascending: false })
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }
    query.then(({ data }) => { setLeads((data || []) as Lead[]) })
  }

  useEffect(() => { loadLeads() }, [statusFilter])

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("Status updated")
    loadLeads()
    if (viewing?.id === id) setViewing({ ...viewing, status })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl tracking-luxe">Leads</h1>
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="font-sans w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Name</TableHead>
              <TableHead className="font-sans">Email</TableHead>
              <TableHead className="font-sans">Project Type</TableHead>
              <TableHead className="font-sans">Status</TableHead>
              <TableHead className="font-sans">Date</TableHead>
              <TableHead className="font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-sans font-medium">{lead.full_name}</TableCell>
                <TableCell className="font-sans text-muted-foreground">{lead.email}</TableCell>
                <TableCell className="font-sans text-muted-foreground">{lead.project_type || "—"}</TableCell>
                <TableCell>
                  <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                    <SelectTrigger className="font-sans w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="font-sans text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setViewing(lead)}><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {leads.length === 0 && <p className="text-center font-sans text-sm text-muted-foreground py-8">No leads found.</p>}
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => { if (!open) setViewing(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display tracking-luxe">Lead Details</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-xs text-muted-foreground">Name</Label><p className="font-sans text-sm">{viewing.full_name}</p></div>
                <div><Label className="font-sans text-xs text-muted-foreground">Email</Label><p className="font-sans text-sm">{viewing.email}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-xs text-muted-foreground">Phone</Label><p className="font-sans text-sm">{viewing.phone || "—"}</p></div>
                <div><Label className="font-sans text-xs text-muted-foreground">Project Type</Label><p className="font-sans text-sm">{viewing.project_type || "—"}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-sans text-xs text-muted-foreground">Budget</Label><p className="font-sans text-sm">{viewing.budget_range || "—"}</p></div>
                <div><Label className="font-sans text-xs text-muted-foreground">Preferred Date</Label><p className="font-sans text-sm">{viewing.preferred_contact_date ? new Date(viewing.preferred_contact_date).toLocaleDateString() : "—"}</p></div>
              </div>
              <div><Label className="font-sans text-xs text-muted-foreground">Message</Label><p className="font-serif text-sm leading-relaxed">{viewing.message || "—"}</p></div>
              <div><Label className="font-sans text-xs text-muted-foreground">Source</Label><p className="font-sans text-sm">{viewing.source_page || "—"}</p></div>
              <div><Label className="font-sans text-xs text-muted-foreground">Submitted</Label><p className="font-sans text-sm">{new Date(viewing.created_at).toLocaleString()}</p></div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline" className="font-sans">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

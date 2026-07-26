import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Save } from "lucide-react"

type Settings = {
  id: string
  company_name: string
  tagline: string
  phone: string | null
  email: string | null
  address: string | null
  whatsapp: string | null
  instagram_url: string | null
  linkedin_url: string | null
  facebook_url: string | null
  pinterest_url: string | null
  hours: string | null
  logo_url: string | null
  footer_text: string | null
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from("cms_site_settings").select("*").limit(1).maybeSingle().then(({ data }) => {
      setSettings(data as Settings | null)
    })
  }, [])

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    const { error } = await supabase.from("cms_site_settings").update({
      company_name: settings.company_name,
      tagline: settings.tagline,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      whatsapp: settings.whatsapp,
      instagram_url: settings.instagram_url,
      linkedin_url: settings.linkedin_url,
      facebook_url: settings.facebook_url,
      pinterest_url: settings.pinterest_url,
      hours: settings.hours,
      logo_url: settings.logo_url,
      footer_text: settings.footer_text,
    }).eq("id", settings.id)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success("Settings saved")
  }

  if (!settings) return <p className="font-sans text-muted-foreground">Loading...</p>

  return (
    <div>
      <h1 className="font-display text-3xl tracking-luxe mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="font-sans text-sm mb-2">Company Name</Label><Input value={settings.company_name} onChange={(e) => setSettings({ ...settings, company_name: e.target.value })} className="font-sans" /></div>
          <div><Label className="font-sans text-sm mb-2">Tagline</Label><Input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="font-sans" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><Label className="font-sans text-sm mb-2">Phone</Label><Input value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="font-sans" /></div>
          <div><Label className="font-sans text-sm mb-2">Email</Label><Input value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="font-sans" /></div>
        </div>

        <div><Label className="font-sans text-sm mb-2">Address</Label><Textarea value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="font-sans" rows={2} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div><Label className="font-sans text-sm mb-2">WhatsApp</Label><Input value={settings.whatsapp || ""} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} className="font-sans" /></div>
          <div><Label className="font-sans text-sm mb-2">Hours</Label><Input value={settings.hours || ""} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} className="font-sans" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><Label className="font-sans text-sm mb-2">Instagram URL</Label><Input value={settings.instagram_url || ""} onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })} className="font-sans" /></div>
          <div><Label className="font-sans text-sm mb-2">LinkedIn URL</Label><Input value={settings.linkedin_url || ""} onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })} className="font-sans" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><Label className="font-sans text-sm mb-2">Facebook URL</Label><Input value={settings.facebook_url || ""} onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })} className="font-sans" /></div>
          <div><Label className="font-sans text-sm mb-2">Pinterest URL</Label><Input value={settings.pinterest_url || ""} onChange={(e) => setSettings({ ...settings, pinterest_url: e.target.value })} className="font-sans" /></div>
        </div>

        <div><Label className="font-sans text-sm mb-2">Logo URL</Label><Input value={settings.logo_url || ""} onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })} className="font-sans" /></div>

        <div><Label className="font-sans text-sm mb-2">Footer Text</Label><Textarea value={settings.footer_text || ""} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} className="font-sans" rows={2} /></div>

        <Button onClick={handleSave} disabled={saving} className="font-sans tracking-luxe-wide uppercase py-6">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}

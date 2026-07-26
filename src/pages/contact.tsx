import { useEffect, useState } from "react"
import { PageHero } from "@/components/page-hero"
import { getFAQs, getSiteSettings, submitLead, type FAQ, type SiteSettings } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"

export function ContactPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getFAQs().then(setFaqs)
    getSiteSettings().then(setSettings)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const result = await submitLead({
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string || undefined,
      project_type: formData.get("project_type") as string || undefined,
      budget_range: formData.get("budget_range") as string || undefined,
      message: formData.get("message") as string || undefined,
      source_page: "contact",
      preferred_contact_date: formData.get("preferred_contact_date") as string || undefined,
    })
    setSubmitting(false)
    if (result.success) {
      toast.success("Thank you. We'll be in touch within 48 hours.")
      e.currentTarget.reset()
    } else {
      toast.error("Something went wrong. Please try again or call us directly.")
    }
  }

  return (
    <div>
      <PageHero
        title="Begin the Conversation"
        subtitle="Tell us about your space, your vision, and your timeline."
        imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-3xl tracking-luxe mb-8">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name" className="font-sans text-sm tracking-wide mb-2">Full Name *</Label>
                    <Input id="full_name" name="full_name" required className="font-sans" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-sans text-sm tracking-wide mb-2">Email *</Label>
                    <Input id="email" name="email" type="email" required className="font-sans" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="font-sans text-sm tracking-wide mb-2">Phone</Label>
                    <Input id="phone" name="phone" className="font-sans" />
                  </div>
                  <div>
                    <Label htmlFor="preferred_contact_date" className="font-sans text-sm tracking-wide mb-2">Preferred Contact Date</Label>
                    <Input id="preferred_contact_date" name="preferred_contact_date" type="date" className="font-sans" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="project_type" className="font-sans text-sm tracking-wide mb-2">Project Type</Label>
                    <Select name="project_type">
                      <SelectTrigger className="font-sans"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="sourcing">Global Sourcing</SelectItem>
                        <SelectItem value="installation">Installation Only</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget_range" className="font-sans text-sm tracking-wide mb-2">Budget Range</Label>
                    <Select name="budget_range">
                      <SelectTrigger className="font-sans"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-50k">Under $50K</SelectItem>
                        <SelectItem value="50k-100k">$50K – $100K</SelectItem>
                        <SelectItem value="100k-200k">$100K – $200K</SelectItem>
                        <SelectItem value="200k-plus">$200K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="font-sans text-sm tracking-wide mb-2">Tell Us About Your Project *</Label>
                  <Textarea id="message" name="message" required rows={5} className="font-sans" />
                </div>
                <Button type="submit" disabled={submitting} className="font-sans tracking-luxe-wide uppercase px-8 py-6">
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="font-display text-3xl tracking-luxe mb-8">Contact Details</h2>
              <div className="space-y-6">
                {settings?.phone && (
                  <div>
                    <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-1">Phone</p>
                    <p className="font-serif text-lg">{settings.phone}</p>
                  </div>
                )}
                {settings?.email && (
                  <div>
                    <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-1">Email</p>
                    <p className="font-serif text-lg">{settings.email}</p>
                  </div>
                )}
                {settings?.address && (
                  <div>
                    <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-1">Studio</p>
                    <p className="font-serif text-lg">{settings.address}</p>
                  </div>
                )}
                {settings?.hours && (
                  <div>
                    <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-1">Hours</p>
                    <p className="font-serif text-lg">{settings.hours}</p>
                  </div>
                )}
                {settings?.whatsapp && (
                  <div>
                    <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-1">WhatsApp</p>
                    <p className="font-serif text-lg">{settings.whatsapp}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-24 bg-card/30">
          <div className="container mx-auto max-w-3xl px-6">
            <h2 className="font-display text-3xl tracking-luxe mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border border-border/40 px-6">
                  <AccordionTrigger className="font-display text-lg tracking-luxe text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-serif text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  )
}

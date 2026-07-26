import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react"
import { getNavigation, getSiteSettings, type NavItem, type SiteSettings } from "@/lib/data"

export function SiteFooter() {
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    getNavigation("footer").then(setNavItems)
    getSiteSettings().then(setSettings)
  }, [])

  return (
    <footer className="bg-card/50 border-t border-border/40 mt-24">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl tracking-luxe font-semibold mb-4">
              {settings?.company_name || "Revamp UG"}
            </h3>
            <p className="font-serif text-lg text-muted-foreground max-w-md leading-relaxed">
              {settings?.tagline || "From Inspiration to Installation"}
            </p>
            <p className="text-sm text-muted-foreground mt-4 max-w-md">
              {settings?.footer_text}
            </p>
          </div>

          <div>
            <h4 className="font-sans text-sm tracking-luxe-wide uppercase mb-4 text-muted-foreground">
              Explore
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className="text-sm font-sans text-foreground/70 hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm tracking-luxe-wide uppercase mb-4 text-muted-foreground">
              Connect
            </h4>
            <ul className="space-y-3">
              {settings?.phone && (
                <li className="flex items-center gap-2 text-sm text-foreground/70">
                  <Phone className="h-4 w-4 text-accent" />
                  {settings.phone}
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2 text-sm text-foreground/70">
                  <Mail className="h-4 w-4 text-accent" />
                  {settings.email}
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2 text-sm text-foreground/70">
                  <MapPin className="h-4 w-4 text-accent mt-0.5" />
                  {settings.address}
                </li>
              )}
            </ul>
            <div className="flex gap-3 mt-4">
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings?.company_name || "Revamp UG"}. All rights reserved.
          </p>
          {settings?.hours && (
            <p className="text-xs text-muted-foreground">{settings.hours}</p>
          )}
        </div>
      </div>
    </footer>
  )
}

import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { getNavigation, getSiteSettings, type NavItem, type SiteSettings } from "@/lib/data"

export function SiteHeader() {
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    getNavigation("header").then(setNavItems)
    getSiteSettings().then(setSettings)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const companyName = settings?.company_name || "Revamp UG"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl tracking-luxe font-semibold text-foreground">
            {companyName}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={`text-sm tracking-wide font-sans transition-colors hover:text-accent ${
                location.pathname === item.href
                  ? "text-accent"
                  : "text-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl px-6 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`text-sm font-sans py-2 transition-colors hover:text-accent ${
                  location.pathname === item.href ? "text-accent" : "text-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

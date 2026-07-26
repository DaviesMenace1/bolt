import { type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAdminAuth } from "@/lib/admin-auth"
import {
  LayoutDashboard,
  FileText,
  Wrench,
  FolderOpen,
  Package,
  Users,
  PenLine,
  Inbox,
  Briefcase,
  LogOut,
  Settings,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Collections", href: "/admin/collections", icon: Package },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Journal", href: "/admin/journal", icon: PenLine },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "Client Projects", href: "/admin/client-projects", icon: Briefcase },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut().then(() => navigate("/admin"))
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border/40 flex flex-col fixed h-screen overflow-y-auto">
        <div className="p-6 border-b border-border/40">
          <Link to="/admin/dashboard" className="block">
            <p className="font-display text-lg tracking-luxe font-semibold">Revamp UG</p>
            <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent">Admin</p>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-sans rounded-sm transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent border-l-2 border-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-sans text-muted-foreground hover:text-destructive transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
          >
            View Website
          </Link>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}

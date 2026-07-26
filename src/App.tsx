import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { useEffect, type ReactNode } from "react"
import { AuthProvider } from "@/lib/auth"
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HomePage } from "@/pages/home"
import { AboutPage } from "@/pages/about"
import { ServicesPage, ServiceDetailPage } from "@/pages/services"
import { ProjectsPage, ProjectDetailPage } from "@/pages/projects"
import { CollectionsPage, CollectionDetailPage } from "@/pages/collections"
import { JournalPage, JournalPostPage } from "@/pages/journal"
import { ContactPage } from "@/pages/contact"
import { PortalAuthPage } from "@/pages/portal-auth"
import { PortalDashboardPage } from "@/pages/portal-dashboard"
import { NotFoundPage } from "@/pages/not-found"
import { AdminAuthPage } from "@/pages/admin/admin-auth"
import { AdminLayout } from "@/pages/admin/admin-layout"
import { AdminDashboardPage } from "@/pages/admin/admin-dashboard"
import { AdminPagesPage } from "@/pages/admin/admin-pages"
import { AdminServicesPage } from "@/pages/admin/admin-services"
import { AdminProjectsPage } from "@/pages/admin/admin-projects"
import { AdminCollectionsPage } from "@/pages/admin/admin-collections"
import { AdminTeamPage } from "@/pages/admin/admin-team"
import { AdminJournalPage } from "@/pages/admin/admin-journal"
import { AdminLeadsPage } from "@/pages/admin/admin-leads"
import { AdminClientProjectsPage } from "@/pages/admin/admin-client-projects"
import { AdminSettingsPage } from "@/pages/admin/admin-settings"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}

function AdminGuard({ children }: { children: ReactNode }) {
  const { session, loading } = useAdminAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-sans text-muted-foreground">Loading...</p>
    </div>
  )
  if (!session) return <Navigate to="/admin" replace />
  return <AdminLayout>{children}</AdminLayout>
}

function AdminRoot() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="" element={<AdminAuthPage />} />
        <Route path="dashboard" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
        <Route path="pages" element={<AdminGuard><AdminPagesPage /></AdminGuard>} />
        <Route path="services" element={<AdminGuard><AdminServicesPage /></AdminGuard>} />
        <Route path="projects" element={<AdminGuard><AdminProjectsPage /></AdminGuard>} />
        <Route path="collections" element={<AdminGuard><AdminCollectionsPage /></AdminGuard>} />
        <Route path="team" element={<AdminGuard><AdminTeamPage /></AdminGuard>} />
        <Route path="journal" element={<AdminGuard><AdminJournalPage /></AdminGuard>} />
        <Route path="leads" element={<AdminGuard><AdminLeadsPage /></AdminGuard>} />
        <Route path="client-projects" element={<AdminGuard><AdminClientProjectsPage /></AdminGuard>} />
        <Route path="settings" element={<AdminGuard><AdminSettingsPage /></AdminGuard>} />
      </Routes>
    </AdminAuthProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public website */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/services/:slug" element={<PublicLayout><ServiceDetailPage /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
          <Route path="/projects/:slug" element={<PublicLayout><ProjectDetailPage /></PublicLayout>} />
          <Route path="/collections" element={<PublicLayout><CollectionsPage /></PublicLayout>} />
          <Route path="/collections/:slug" element={<PublicLayout><CollectionDetailPage /></PublicLayout>} />
          <Route path="/journal" element={<PublicLayout><JournalPage /></PublicLayout>} />
          <Route path="/journal/:slug" element={<PublicLayout><JournalPostPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

          {/* Client portal */}
          <Route path="/portal" element={<PortalAuthPage />} />
          <Route path="/portal/dashboard" element={<PortalDashboardPage />} />

          {/* Admin dashboard — single AdminAuthProvider wraps all admin routes */}
          <Route path="/admin/*" element={<AdminRoot />} />

          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, Calendar, MapPin, DollarSign } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { CtaLink } from "@/components/cta-link"
import {
  getProjects,
  getProjectBySlug,
  getProjectPhases,
  type Project,
  type ProjectPhase,
} from "@/lib/data"

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  return (
    <div>
      <PageHero
        title="Selected Work"
        subtitle="A portfolio of spaces where craft, material, and intention converge."
        imageUrl="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.slug}`} className="group">
                <div className="aspect-[4/3] overflow-hidden bg-muted mb-6">
                  {project.hero_image_url && (
                    <img
                      src={project.hero_image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-2">
                  {project.project_type} — {project.location}
                </p>
                <h3 className="font-display text-2xl tracking-luxe mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="font-serif text-lg text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-accent font-sans tracking-wide">
                  View Project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-luxe mb-6 text-balance">
            Your Space, Our Next Project
          </h2>
          <p className="font-serif text-xl text-background/70 mb-12 max-w-2xl mx-auto">
            Let's add your project to our portfolio.
          </p>
          <CtaLink to="/contact" variant="outline" className="border-background/30 hover:border-accent hover:text-accent">
            Start a Project
          </CtaLink>
        </div>
      </section>
    </div>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [phases, setPhases] = useState<ProjectPhase[]>([])

  useEffect(() => {
    if (!slug) return
    getProjectBySlug(slug).then(setProject)
  }, [slug])

  useEffect(() => {
    if (project) {
      getProjectPhases(project.id).then(setPhases)
    }
  }, [project])

  if (!project) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="font-serif text-xl text-muted-foreground">Project not found.</p>
        <Link to="/projects" className="text-accent hover:underline mt-4 inline-block">
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        title={project.title}
        subtitle={project.description || undefined}
        imageUrl={project.hero_image_url || undefined}
        height="full"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {project.location && (
              <div>
                <MapPin className="h-5 w-5 text-accent mb-2" />
                <p className="font-sans text-xs tracking-luxe-wide uppercase text-muted-foreground mb-1">Location</p>
                <p className="font-serif text-base">{project.location}</p>
              </div>
            )}
            {project.project_type && (
              <div>
                <p className="font-sans text-xs tracking-luxe-wide uppercase text-muted-foreground mb-1 mt-7">Type</p>
                <p className="font-serif text-base">{project.project_type}</p>
              </div>
            )}
            {project.style && (
              <div>
                <p className="font-sans text-xs tracking-luxe-wide uppercase text-muted-foreground mb-1 mt-7">Style</p>
                <p className="font-serif text-base">{project.style}</p>
              </div>
            )}
            {project.budget_range && (
              <div>
                <DollarSign className="h-5 w-5 text-accent mb-2" />
                <p className="font-sans text-xs tracking-luxe-wide uppercase text-muted-foreground mb-1">Budget</p>
                <p className="font-serif text-base">{project.budget_range}</p>
              </div>
            )}
          </div>

          {project.description && (
            <div className="mb-16">
              <p className="font-serif text-xl leading-relaxed text-foreground/80">{project.description}</p>
            </div>
          )}

          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-2xl tracking-luxe mb-8">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery_urls.map((url, i) => (
                  <div key={i} className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src={url} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {phases.length > 0 && (
            <div>
              <h2 className="font-display text-2xl tracking-luxe mb-8">Project Timeline</h2>
              <div className="space-y-6">
                {phases.map((phase, i) => (
                  <div key={phase.id} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center font-display text-sm text-accent">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-lg tracking-luxe mb-1">{phase.phase_name}</h3>
                      {phase.description && (
                        <p className="font-serif text-base text-muted-foreground">{phase.description}</p>
                      )}
                      {(phase.start_date || phase.end_date) && (
                        <p className="font-sans text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {phase.start_date ? new Date(phase.start_date).toLocaleDateString() : ""} — {phase.end_date ? new Date(phase.end_date).toLocaleDateString() : "Present"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl tracking-luxe mb-6">Like What You See?</h2>
          <CtaLink to="/contact">Start Your Project</CtaLink>
        </div>
      </section>

      <div className="pb-16 text-center">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> All Projects
        </Link>
      </div>
    </div>
  )
}

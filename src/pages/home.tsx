import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Star } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { CtaLink } from "@/components/cta-link"
import {
  getServices,
  getFeaturedProjects,
  getFeaturedTestimonials,
  getTeamMembers,
  getSiteSettings,
  type Service,
  type Project,
  type Testimonial,
  type TeamMember,
  type SiteSettings,
} from "@/lib/data"

export function HomePage() {
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    getServices().then(setServices)
    getFeaturedProjects().then(setProjects)
    getFeaturedTestimonials().then(setTestimonials)
    getTeamMembers().then(setTeam)
    getSiteSettings().then(setSettings)
  }, [])

  return (
    <div>
      <PageHero
        title={settings?.tagline || "From Inspiration to Installation"}
        subtitle="Luxury interior design, architecture, and global sourcing — crafted for those who expect more."
        imageUrl="https://images.unsplash.com/photo-1618221195710-dd6b22fa8dc7?w=1920&q=80"
        height="full"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-5xl px-6 text-center">
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground/80 text-balance">
            Revamp UG is a full-service interior design and architecture studio based in Kampala,
            serving clients across East Africa and beyond. We believe that great design is not about
            trends — it is about timelessness, craft, and the human experience of space.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mb-4">What We Do</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-luxe">Four Disciplines, One Standard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group bg-card border border-border/40 p-8 transition-all duration-300 hover:border-accent/40 hover:shadow-lg"
              >
                <div className="aspect-square mb-6 overflow-hidden bg-muted">
                  {service.hero_image_url ? (
                    <img
                      src={service.hero_image_url}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-4xl text-muted-foreground">0{service.sort_order + 1}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-xl tracking-luxe mb-3">{service.title}</h3>
                <p className="font-serif text-base text-muted-foreground leading-relaxed line-clamp-3">
                  {service.short_description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-accent font-sans tracking-wide">
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mb-4">Selected Work</p>
                <h2 className="font-display text-4xl md:text-5xl tracking-luxe">Recent Projects</h2>
              </div>
              <CtaLink to="/projects" variant="ghost">View All Projects</CtaLink>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project) => (
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
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="py-24 bg-card/30">
          <div className="container mx-auto max-w-5xl px-6 text-center">
            <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mb-4">Client Words</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-luxe mb-16">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-card border border-border/40 p-8 text-left">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">"{t.quote}"</p>
                  <div>
                    <p className="font-sans text-sm font-medium">{t.client_name}</p>
                    <p className="font-sans text-xs text-muted-foreground">
                      {t.client_title}{t.project_name ? ` — ${t.project_name}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mb-4">The Studio</p>
              <h2 className="font-display text-4xl md:text-5xl tracking-luxe">Our Team</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {team.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="aspect-square overflow-hidden bg-muted mb-4">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-3xl text-muted-foreground">
                          {member.full_name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-lg tracking-luxe">{member.full_name}</h3>
                  <p className="font-sans text-xs text-muted-foreground mt-1">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-6xl tracking-luxe mb-6 text-balance">
            Ready to Begin?
          </h2>
          <p className="font-serif text-xl text-background/70 mb-12 max-w-2xl mx-auto">
            Every great space begins with a conversation. Tell us about your vision.
          </p>
          <CtaLink to="/contact" variant="outline" className="border-background/30 hover:border-accent hover:text-accent">
            Start Your Project
          </CtaLink>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useState } from "react"
import { PageHero } from "@/components/page-hero"
import { CtaLink } from "@/components/cta-link"
import { getTeamMembers, getTestimonials, type TeamMember, type Testimonial } from "@/lib/data"

export function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    getTeamMembers().then(setTeam)
    getTestimonials().then(setTestimonials)
  }, [])

  return (
    <div>
      <PageHero
        title="Our Story"
        subtitle="A studio built on craft, travel, and the belief that every space tells a story."
        imageUrl="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-4xl px-6">
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground/80 text-balance mb-8">
            Revamp UG was founded with a singular vision: to bring world-class interior design and
            architecture to East Africa.
          </p>
          <p className="font-serif text-xl leading-relaxed text-muted-foreground mb-6">
            We believe that great design is not about trends — it is about timelessness, craft, and
            the human experience of space. Our work is rooted in deep material knowledge, a global
            sourcing network, and an unwavering commitment to detail.
          </p>
          <p className="font-serif text-xl leading-relaxed text-muted-foreground">
            From our studio in Kampala, we serve clients across East Africa and beyond. Every project
            is a collaboration, and every space is designed to be lived in, not just looked at.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="font-display text-5xl text-accent mb-2">15+</p>
              <p className="font-sans text-sm tracking-luxe-wide uppercase text-muted-foreground">Years of Experience</p>
            </div>
            <div>
              <p className="font-display text-5xl text-accent mb-2">50+</p>
              <p className="font-sans text-sm tracking-luxe-wide uppercase text-muted-foreground">Projects Completed</p>
            </div>
            <div>
              <p className="font-display text-5xl text-accent mb-2">4</p>
              <p className="font-sans text-sm tracking-luxe-wide uppercase text-muted-foreground">Continents Sourced</p>
            </div>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mb-4">The People</p>
              <h2 className="font-display text-4xl md:text-5xl tracking-luxe">Meet the Team</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.id} className="bg-card border border-border/40 p-8">
                  <div className="aspect-square overflow-hidden bg-muted mb-6">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-4xl text-muted-foreground">
                          {member.full_name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-xl tracking-luxe mb-1">{member.full_name}</h3>
                  <p className="font-sans text-sm text-accent mb-4">{member.title}</p>
                  <p className="font-serif text-base text-muted-foreground leading-relaxed mb-4">{member.bio}</p>
                  {member.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((s) => (
                        <span key={s} className="text-xs font-sans px-3 py-1 border border-border/40 rounded-sm text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="py-24 bg-card/30">
          <div className="container mx-auto max-w-5xl px-6 text-center">
            <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mb-4">In Their Words</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-luxe mb-16">Client Testimonials</h2>
            <div className="space-y-8">
              {testimonials.slice(0, 3).map((t) => (
                <blockquote key={t.id} className="max-w-3xl mx-auto">
                  <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground/80 mb-4 text-pretty">
                    "{t.quote}"
                  </p>
                  <footer className="font-sans text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{t.client_name}</span>
                    {t.client_title ? ` — ${t.client_title}` : ""}
                    {t.project_name ? ` — ${t.project_name}` : ""}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-luxe mb-6 text-balance">
            Let's Create Together
          </h2>
          <p className="font-serif text-xl text-background/70 mb-12 max-w-2xl mx-auto">
            We would love to hear about your space and your vision.
          </p>
          <CtaLink to="/contact" variant="outline" className="border-background/30 hover:border-accent hover:text-accent">
            Get in Touch
          </CtaLink>
        </div>
      </section>
    </div>
  )
}

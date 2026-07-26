import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { CtaLink } from "@/components/cta-link"
import {
  getServices,
  getServiceBySlug,
  getServiceFeatures,
  type Service,
  type ServiceFeature,
} from "@/lib/data"

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    getServices().then(setServices)
  }, [])

  return (
    <div>
      <PageHero
        title="What We Do"
        subtitle="Four disciplines, one standard: uncompromising craft from concept to completion."
        imageUrl="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1920&q=80"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="space-y-24">
            {services.map((service, index) => (
              <ServiceRow key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-luxe mb-6 text-balance">
            Not Sure Which Service You Need?
          </h2>
          <p className="font-serif text-xl text-background/70 mb-12 max-w-2xl mx-auto">
            Every engagement begins with a consultation. We'll help you find the right path.
          </p>
          <CtaLink to="/contact" variant="outline" className="border-background/30 hover:border-accent hover:text-accent">
            Book a Consultation
          </CtaLink>
        </div>
      </section>
    </div>
  )
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const [features, setFeatures] = useState<ServiceFeature[]>([])
  const isReversed = index % 2 === 1

  useEffect(() => {
    getServiceFeatures(service.id).then(setFeatures)
  }, [service.id])

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReversed ? "lg:[direction:rtl]" : ""}`}>
      <div className={`aspect-[4/3] overflow-hidden bg-muted ${isReversed ? "lg:[direction:ltr]" : ""}`}>
        {service.hero_image_url && (
          <img src={service.hero_image_url} alt={service.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className={isReversed ? "lg:[direction:ltr]" : ""}>
        <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mb-4">
          0{index + 1}
        </p>
        <h2 className="font-display text-3xl md:text-4xl tracking-luxe mb-4">{service.title}</h2>
        <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-6">
          {service.full_description || service.short_description}
        </p>
        {features.length > 0 && (
          <ul className="space-y-3 mb-8">
            {features.map((f) => (
              <li key={f.id} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-sans text-sm font-medium">{f.title}</p>
                  {f.description && (
                    <p className="font-serif text-sm text-muted-foreground mt-1">{f.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 font-sans text-sm tracking-luxe-wide uppercase text-accent hover:gap-3 transition-all"
        >
          Learn More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [features, setFeatures] = useState<ServiceFeature[]>([])
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    if (!slug) return
    getServiceBySlug(slug).then(setService)
    getServices().then(setServices)
  }, [slug])

  useEffect(() => {
    if (service) {
      getServiceFeatures(service.id).then(setFeatures)
    }
  }, [service])

  if (!service) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="font-serif text-xl text-muted-foreground">Service not found.</p>
        <Link to="/services" className="text-accent hover:underline mt-4 inline-block">
          Back to Services
        </Link>
      </div>
    )
  }

  const currentIndex = services.findIndex((s) => s.slug === service.slug)
  const nextService = currentIndex < services.length - 1 ? services[currentIndex + 1] : null

  return (
    <div>
      <PageHero
        title={service.title}
        subtitle={service.short_description || undefined}
        imageUrl={service.hero_image_url || undefined}
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-4xl px-6">
          <p className="font-serif text-2xl leading-relaxed text-foreground/80 mb-8">
            {service.full_description}
          </p>

          {features.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl tracking-luxe mb-8">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((f) => (
                  <div key={f.id} className="border border-border/40 p-6 bg-card/30">
                    <h3 className="font-display text-lg tracking-luxe mb-2">{f.title}</h3>
                    <p className="font-serif text-base text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl tracking-luxe mb-6">Ready to Begin?</h2>
          <p className="font-serif text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Book a consultation to discuss your project and how this service can bring your vision to life.
          </p>
          <CtaLink to="/contact">Book a Consultation</CtaLink>
        </div>
      </section>

      {nextService && (
        <section className="py-16 bg-background border-t border-border/40">
          <div className="container mx-auto max-w-7xl px-6">
            <Link
              to={`/services/${nextService.slug}`}
              className="flex items-center justify-between group"
            >
              <div>
                <p className="font-sans text-xs tracking-luxe-wide uppercase text-muted-foreground mb-2">Next Service</p>
                <h3 className="font-display text-2xl tracking-luxe group-hover:text-accent transition-colors">
                  {nextService.title}
                </h3>
              </div>
              <ArrowRight className="h-8 w-8 text-accent group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </section>
      )}

      <div className="pb-16 text-center">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> All Services
        </Link>
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { CtaLink } from "@/components/cta-link"
import {
  getCollections,
  getCollectionBySlug,
  getCollectionItems,
  type Collection,
  type CollectionItem,
} from "@/lib/data"

export function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    getCollections().then(setCollections)
  }, [])

  return (
    <div>
      <PageHero
        title="Curated Collections"
        subtitle="Pieces sourced from around the world, available through our studio."
        imageUrl="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1920&q=80"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link key={collection.id} to={`/collections/${collection.slug}`} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-muted mb-6">
                  {collection.hero_image_url && (
                    <img
                      src={collection.hero_image_url}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-2">
                  {collection.category}
                </p>
                <h3 className="font-display text-2xl tracking-luxe mb-2 group-hover:text-accent transition-colors">
                  {collection.name}
                </h3>
                <p className="font-serif text-base text-muted-foreground line-clamp-2">{collection.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-luxe mb-6 text-balance">
            Looking for Something Specific?
          </h2>
          <p className="font-serif text-xl text-background/70 mb-12 max-w-2xl mx-auto">
            Our global sourcing network can find pieces beyond what's shown here. Tell us what you're looking for.
          </p>
          <CtaLink to="/contact" variant="outline" className="border-background/30 hover:border-accent hover:text-accent">
            Request a Sourcing Quote
          </CtaLink>
        </div>
      </section>
    </div>
  )
}

export function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [items, setItems] = useState<CollectionItem[]>([])

  useEffect(() => {
    if (!slug) return
    getCollectionBySlug(slug).then(setCollection)
  }, [slug])

  useEffect(() => {
    if (collection) {
      getCollectionItems(collection.id).then(setItems)
    }
  }, [collection])

  if (!collection) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="font-serif text-xl text-muted-foreground">Collection not found.</p>
        <Link to="/collections" className="text-accent hover:underline mt-4 inline-block">
          Back to Collections
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        title={collection.name}
        subtitle={collection.description || undefined}
        imageUrl={collection.hero_image_url || undefined}
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          {items.length === 0 ? (
            <p className="font-serif text-xl text-muted-foreground text-center">
              Items coming soon. Please check back or contact us for availability.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="aspect-square overflow-hidden bg-muted mb-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="font-display text-lg tracking-luxe mb-1">{item.name}</h3>
                  <p className="font-serif text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                  <div className="space-y-1">
                    {item.source_country && (
                      <p className="font-sans text-xs text-muted-foreground">Origin: {item.source_country}</p>
                    )}
                    {item.material && (
                      <p className="font-sans text-xs text-muted-foreground">Material: {item.material}</p>
                    )}
                    {item.dimensions && (
                      <p className="font-sans text-xs text-muted-foreground">Dimensions: {item.dimensions}</p>
                    )}
                  </div>
                  {item.price != null && (
                    <p className="font-display text-lg text-accent mt-3">
                      ${item.price.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl tracking-luxe mb-6">Interested in a Piece?</h2>
          <p className="font-serif text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Contact us for pricing, availability, and custom orders.
          </p>
          <CtaLink to="/contact">Inquire</CtaLink>
        </div>
      </section>

      <div className="pb-16 text-center">
        <Link to="/collections" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> All Collections
        </Link>
      </div>
    </div>
  )
}

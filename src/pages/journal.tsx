import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { getJournalPosts, getJournalPostBySlug, getTeamMembers, type JournalPost, type TeamMember } from "@/lib/data"

export function JournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    getJournalPosts().then(setPosts)
    getTeamMembers().then(setTeam)
  }, [])

  const getAuthorName = (authorId: string | null) => {
    const member = team.find((m) => m.id === authorId)
    return member?.full_name || "Revamp UG"
  }

  if (posts.length === 0) {
    return (
      <div>
        <PageHero
          title="The Journal"
          subtitle="Thoughts on design, travel, craft, and the spaces that shape us."
          imageUrl="https://images.unsplash.com/photo-1481277542470-6059712c0d16?w=1920&q=80"
        />
        <section className="py-24 text-center">
          <p className="font-serif text-xl text-muted-foreground">Journal articles coming soon.</p>
        </section>
      </div>
    )
  }

  const [featured, ...rest] = posts

  return (
    <div>
      <PageHero
        title="The Journal"
        subtitle="Thoughts on design, travel, craft, and the spaces that shape us."
        imageUrl="https://images.unsplash.com/photo-1481277542470-6059712c0d16?w=1920&q=80"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          {featured && (
            <Link to={`/journal/${featured.slug}`} className="group mb-16 block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {featured.hero_image_url && (
                    <img
                      src={featured.hero_image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div>
                  <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-3">
                    {featured.category} — Featured
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl tracking-luxe mb-4 group-hover:text-accent transition-colors">
                    {featured.title}
                  </h2>
                  <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-sans text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {getAuthorName(featured.author_id)}
                    </span>
                    {featured.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(featured.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post) => (
                <Link key={post.id} to={`/journal/${post.slug}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                    {post.hero_image_url && (
                      <img
                        src={post.hero_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="font-sans text-xs tracking-luxe-wide uppercase text-accent mb-2">
                    {post.category}
                  </p>
                  <h3 className="font-display text-xl tracking-luxe mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-serif text-base text-muted-foreground line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  {post.published_at && (
                    <p className="font-sans text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(post.published_at).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export function JournalPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<JournalPost | null>(null)
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    if (!slug) return
    getJournalPostBySlug(slug).then(setPost)
    getTeamMembers().then(setTeam)
  }, [slug])

  const getAuthorName = (authorId: string | null) => {
    const member = team.find((m) => m.id === authorId)
    return member?.full_name || "Revamp UG"
  }

  if (!post) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="font-serif text-xl text-muted-foreground">Article not found.</p>
        <Link to="/journal" className="text-accent hover:underline mt-4 inline-block">
          Back to Journal
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        title={post.title}
        subtitle={post.excerpt || undefined}
        imageUrl={post.hero_image_url || undefined}
        height="full"
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-4 text-sm font-sans text-muted-foreground mb-12 pb-8 border-b border-border/40">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4 text-accent" /> {getAuthorName(post.author_id)}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-accent" /> {new Date(post.published_at).toLocaleDateString()}
              </span>
            )}
            {post.category && (
              <span className="text-accent">{post.category}</span>
            )}
          </div>

          <div className="font-serif text-xl leading-relaxed text-foreground/80 space-y-6">
            {post.body?.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border/40">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-sans px-3 py-1 border border-border/40 rounded-sm text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl tracking-luxe mb-6">Continue Reading</h2>
          <Link to="/journal" className="inline-flex items-center gap-2 font-sans text-sm tracking-luxe-wide uppercase text-accent hover:gap-3 transition-all">
            All Articles <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

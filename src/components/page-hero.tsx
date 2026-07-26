type Props = {
  title: string
  subtitle?: string
  imageUrl?: string
  align?: "left" | "center"
  height?: "full" | "medium"
}

export function PageHero({ title, subtitle, imageUrl, align = "left", height = "medium" }: Props) {
  const heightClass = height === "full" ? "min-h-[80vh]" : "min-h-[50vh]"
  const alignClass = align === "center" ? "items-center text-center" : "items-end text-left"

  return (
    <section className={`relative ${heightClass} flex ${alignClass} justify-center overflow-hidden`}>
      {imageUrl && (
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
      )}
      <div className={`container mx-auto max-w-7xl px-6 z-10 ${height === "full" ? "pb-20" : "pb-16"} pt-32`}>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-luxe font-medium text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className={`font-serif text-xl md:text-2xl text-white/80 mt-6 max-w-2xl leading-relaxed ${align === "center" ? "mx-auto" : ""}`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

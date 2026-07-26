import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

type Props = {
  to: string
  children: React.ReactNode
  variant?: "primary" | "outline" | "ghost"
  className?: string
}

export function CtaLink({ to, children, variant = "primary", className = "" }: Props) {
  const base = "inline-flex items-center gap-2 font-sans text-sm tracking-luxe-wide uppercase transition-all duration-300 group"
  const variants = {
    primary: "bg-primary text-primary-foreground px-8 py-4 hover:bg-primary/90",
    outline: "border border-foreground/30 px-8 py-4 hover:border-accent hover:text-accent",
    ghost: "text-foreground/70 hover:text-accent px-0 py-0",
  }

  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

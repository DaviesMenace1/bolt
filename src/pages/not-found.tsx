import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6 pt-32">
      <div>
        <p className="font-display text-8xl text-accent mb-4">404</p>
        <h1 className="font-display text-3xl tracking-luxe mb-4">Page Not Found</h1>
        <p className="font-serif text-lg text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="font-sans text-sm tracking-luxe-wide uppercase text-accent hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  )
}

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function PortalAuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (mode === "signin") {
      const { error } = await signIn(email, password)
      if (error) {
        toast.error(error)
      } else {
        toast.success("Welcome back.")
        navigate("/portal/dashboard")
      }
    } else {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        toast.error(error)
      } else {
        toast.success("Account created. Welcome to Revamp UG.")
        navigate("/portal/dashboard")
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-32 pb-20 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="font-display text-2xl tracking-luxe font-semibold">
            Revamp UG
          </Link>
          <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mt-2">
            Client Portal
          </p>
        </div>

        <div className="bg-card border border-border/40 p-8">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 font-sans text-sm tracking-luxe-wide uppercase pb-2 border-b-2 transition-colors ${
                mode === "signin" ? "border-accent text-accent" : "border-border text-muted-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 font-sans text-sm tracking-luxe-wide uppercase pb-2 border-b-2 transition-colors ${
                mode === "signup" ? "border-accent text-accent" : "border-border text-muted-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName" className="font-sans text-sm mb-2">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="font-sans"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="font-sans text-sm mb-2">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-sans"
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-sans text-sm mb-2">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="font-sans"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full font-sans tracking-luxe-wide uppercase py-6">
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 font-serif text-sm text-muted-foreground">
          <Link to="/" className="hover:text-accent transition-colors">Back to website</Link>
        </p>
      </div>
    </div>
  )
}

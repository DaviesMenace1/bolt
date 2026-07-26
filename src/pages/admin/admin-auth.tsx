import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Lock } from "lucide-react"

export function AdminAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAdminAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast.error(error)
    } else {
      toast.success("Welcome to the admin dashboard.")
      navigate("/admin/dashboard")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-accent mb-4">
            <Lock className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-2xl tracking-luxe">Revamp UG</h1>
          <p className="font-sans text-sm tracking-luxe-wide uppercase text-accent mt-2">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="font-sans"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-sans tracking-luxe-wide uppercase py-6">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  )
}

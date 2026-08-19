import { useState } from 'react'
import { User, Lock, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react'
import { LogoEmblem } from '../../../components/Logo'
import { useCMS } from '../../../hooks/useCMS'

export default function AdminLoginModal() {
  const { login, data } = useCMS()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)

    setTimeout(() => {
      const success = login(username, password)
      if (!success) {
        setError(true)
        setIsLoading(false)
      }
    }, 200)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-primary/10 bg-white p-8 shadow-lift sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-softgreen text-primary shadow-soft">
            <LogoEmblem size={36} />
          </div>
          <h1 className="font-heading text-2xl font-black text-primary">Portal Admin CMS</h1>
          <p className="mt-1.5 text-xs text-ink-mute">
            {data.site.name} — Masuk untuk mengelola seluruh data website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* USERNAME */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(false)
                }}
                placeholder="Masukkan username admin"
                className={`w-full rounded-2xl border-2 px-4 py-3.5 pl-11 text-sm font-semibold outline-none transition-all ${
                  error
                    ? 'border-warmred bg-softred/20 text-warmred'
                    : 'border-primary/10 bg-cream text-ink focus:border-primary'
                }`}
                autoFocus
              />
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                placeholder="Masukkan password admin"
                className={`w-full rounded-2xl border-2 px-4 py-3.5 pl-11 pr-11 text-sm font-semibold outline-none transition-all ${
                  error
                    ? 'border-warmred bg-softred/20 text-warmred'
                    : 'border-primary/10 bg-cream text-ink focus:border-primary'
                }`}
              />
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-mute hover:text-primary p-1"
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-warmred">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Username atau password salah. Silakan coba kembali.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-extrabold text-white shadow-soft transition-all hover:bg-primary-light hover:shadow-lift disabled:opacity-50"
          >
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

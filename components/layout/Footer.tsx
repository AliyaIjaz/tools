import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-24 py-10 px-4"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.02))',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-base"
          style={{
            fontFamily: 'var(--font-orbitron)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            background: 'linear-gradient(90deg, var(--color-dev), var(--color-image))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Zenveel
        </span>

        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          <Shield size={14} style={{ color: 'var(--color-web)' }} />
          <span>All tools run in your browser — no data is sent to any server.</span>
        </div>

        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} Zenveel
        </span>
      </div>
    </footer>
  )
}

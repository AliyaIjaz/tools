import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-24 py-8 px-4"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/30">
        <span style={{ fontFamily: 'var(--font-orbitron)', fontWeight: 700, letterSpacing: '0.05em' }} className="text-white/50">Zenveel</span>
        <div className="flex items-center gap-2">
          <Shield size={13} />
          <span>All tools run in your browser — no data is sent to any server.</span>
        </div>
        <span>{new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}

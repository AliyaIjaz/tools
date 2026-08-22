'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type Entity = 'owner' | 'group' | 'other'
type Bit = 'r' | 'w' | 'x'

interface PermSet {
  r: boolean
  w: boolean
  x: boolean
}

type Permissions = Record<Entity, PermSet>

const ENTITIES: { id: Entity; label: string; short: string }[] = [
  { id: 'owner', label: 'Owner (User)', short: 'u' },
  { id: 'group', label: 'Group',        short: 'g' },
  { id: 'other', label: 'Other',        short: 'o' },
]

const BITS: { id: Bit; label: string; octal: number }[] = [
  { id: 'r', label: 'Read',    octal: 4 },
  { id: 'w', label: 'Write',   octal: 2 },
  { id: 'x', label: 'Execute', octal: 1 },
]

const ENTITY_COLOR: Record<Entity, string> = {
  owner: 'var(--color-dev)',
  group: '#34d399',
  other: '#f472b6',
}

const DEFAULT_PERMS: Permissions = {
  owner: { r: true,  w: true,  x: true  },
  group: { r: true,  w: false, x: true  },
  other: { r: true,  w: false, x: true  },
}

function permsToOctal(p: PermSet): number {
  return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0)
}

function octalToPerms(n: number): PermSet {
  return { r: !!(n & 4), w: !!(n & 2), x: !!(n & 1) }
}

function permsToSymbolic(p: PermSet): string {
  return `${p.r ? 'r' : '-'}${p.w ? 'w' : '-'}${p.x ? 'x' : '-'}`
}

function buildNumeric(perms: Permissions): string {
  return `${permsToOctal(perms.owner)}${permsToOctal(perms.group)}${permsToOctal(perms.other)}`
}

function buildSymbolic(perms: Permissions): string {
  return ENTITIES.map(({ id }) => permsToSymbolic(perms[id])).join('')
}

function parseNumeric(raw: string): Permissions | null {
  const digits = raw.trim()
  if (!/^[0-7]{3}$/.test(digits)) return null
  return {
    owner: octalToPerms(parseInt(digits[0])),
    group: octalToPerms(parseInt(digits[1])),
    other: octalToPerms(parseInt(digits[2])),
  }
}

function parseSymbolic(raw: string): Permissions | null {
  const s = raw.trim().replace(/^[-d]/, '')
  if (!/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(s)) return null
  return {
    owner: { r: s[0] === 'r', w: s[1] === 'w', x: s[2] === 'x' },
    group: { r: s[3] === 'r', w: s[4] === 'w', x: s[5] === 'x' },
    other: { r: s[6] === 'r', w: s[7] === 'w', x: s[8] === 'x' },
  }
}

const PRESET_EXAMPLES = [
  { label: '755', desc: 'rwxr-xr-x',  note: 'Executable / directory (typical)' },
  { label: '644', desc: 'rw-r--r--',  note: 'Regular file (read-only for others)' },
  { label: '600', desc: 'rw-------',  note: 'Private file (SSH keys, .env)' },
  { label: '777', desc: 'rwxrwxrwx',  note: 'Full access (avoid in production)' },
  { label: '700', desc: 'rwx------',  note: 'Private executable / directory' },
  { label: '664', desc: 'rw-rw-r--',  note: 'Shared write (same group)' },
]

export default function UnixPermissionsPage() {
  const [perms, setPerms] = useState<Permissions>(DEFAULT_PERMS)
  const [numericInput, setNumericInput] = useState('755')
  const [symbolicInput, setSymbolicInput] = useState('rwxr-xr-x')
  const [numericError, setNumericError] = useState('')
  const [symbolicError, setSymbolicError] = useState('')

  const numeric = buildNumeric(perms)
  const symbolic = buildSymbolic(perms)
  const fullSymbolic = `-${symbolic}`

  const toggleBit = (entity: Entity, bit: Bit) => {
    const next = { ...perms, [entity]: { ...perms[entity], [bit]: !perms[entity][bit] } }
    setPerms(next)
    setNumericInput(buildNumeric(next))
    setSymbolicInput(buildSymbolic(next))
    setNumericError('')
    setSymbolicError('')
  }

  const applyNumeric = (raw: string) => {
    setNumericInput(raw)
    const parsed = parseNumeric(raw)
    if (parsed) {
      setPerms(parsed)
      setSymbolicInput(buildSymbolic(parsed))
      setNumericError('')
    } else {
      setNumericError(raw.length > 0 ? 'Enter a 3-digit octal value (e.g. 755)' : '')
    }
  }

  const applySymbolic = (raw: string) => {
    setSymbolicInput(raw)
    const parsed = parseSymbolic(raw)
    if (parsed) {
      setPerms(parsed)
      setNumericInput(buildNumeric(parsed))
      setSymbolicError('')
    } else {
      setSymbolicError(raw.length > 0 ? 'Enter 9 chars like rwxr-xr-x (or -rwxr-xr-x)' : '')
    }
  }

  const applyPreset = (label: string) => {
    applyNumeric(label)
  }

  const faqs = [
    { q: 'What do Unix file permissions mean?', a: 'Unix/Linux permissions control who can read, write, or execute a file or directory. They are divided into three groups: owner (the user who created the file), group (members of the file\'s group), and other (everyone else). Each group has three bits: read (r = 4), write (w = 2), and execute (x = 1).' },
    { q: 'What does chmod 755 mean?', a: 'chmod 755 sets permissions to rwxr-xr-x. The owner has full read/write/execute access (7 = 4+2+1). The group and others can read and execute but not write (5 = 4+1). This is the standard permission for executables and public directories on Linux and macOS.' },
    { q: 'What does chmod 644 mean?', a: 'chmod 644 sets permissions to rw-r--r--. The owner can read and write (6 = 4+2), but group and others can only read (4). This is the standard permission for regular files served by a web server — the nginx or Apache process can read the file, but no one can accidentally overwrite it.' },
    { q: 'What does chmod 600 mean?', a: 'chmod 600 sets permissions to rw------- — read and write for the owner only, no access for group or others. This is the required permission for private SSH keys (~/.ssh/id_rsa). If the key is group- or world-readable, the ssh client will refuse to use it with a "Permissions are too open" error. The ~/.ssh directory itself should be chmod 700.' },
    { q: 'How do I change file permissions in Linux?', a: 'Use the chmod command: chmod 755 filename sets numeric permissions, chmod u+x filename adds execute for the owner using symbolic notation. To change permissions recursively on a directory: chmod -R 755 /path/to/dir. Use ls -l to view current permissions — the 10-character string at the start (e.g. -rwxr-xr-x) shows the file type and all nine permission bits.' },
    { q: 'What is the difference between numeric and symbolic permissions?', a: 'Numeric (octal) permissions represent each group as a single digit 0–7 where each bit adds its value (r=4, w=2, x=1). Symbolic permissions spell it out as a 9-character string like rwxr-xr-x — easier to read but less compact. Both describe the same permission state. chmod accepts both: chmod 755 and chmod u=rwx,go=rx are equivalent.' },
    { q: 'What does the execute bit mean on a directory?', a: 'On a directory, the execute bit means "search" — the right to enter the directory (cd into it) and access files within it. A directory without execute permission is unenterable even if read is set. chmod 755 on a directory gives the owner full access and lets everyone else list and enter it.' },
    { q: 'What is a setuid, setgid, or sticky bit (4-digit chmod)?', a: 'Beyond the standard 9 bits, Linux supports three special bits expressed as a leading digit: setuid (4) runs an executable as its owner (e.g. chmod 4755 = -rwsr-xr-x), setgid (2) on a directory makes new files inherit the directory\'s group, and sticky (1) on a directory prevents users from deleting files they don\'t own (e.g. chmod 1777 on /tmp). This calculator covers the standard 3-digit octal used in everyday chmod operations.' },
    { q: 'What is umask and how does it relate to permissions?', a: 'umask is a mask that subtracts bits from the default permissions assigned to new files and directories. A common umask of 022 means new files get 644 (666 minus 022) and new directories get 755 (777 minus 022). Run umask in your shell to see the current value. It is the inverse of chmod — instead of setting permissions, it removes them from the default.' },
    { q: 'Why should I avoid chmod 777?', a: 'chmod 777 (rwxrwxrwx) grants all users on the system read, write, and execute access. On a web server this lets any process or user overwrite your files, execute malicious scripts, or read private data. Use the most restrictive permission that still lets your application work.' },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <ToolLayout
      toolId="unix-permissions"
      title="Unix File Permissions & chmod Calculator"
      description="Free chmod calculator — convert between numeric (755) and symbolic (rwxr-xr-x) Linux file permissions instantly. Per-bit breakdown for owner, group, and other."
      category="dev"
      iconName="ShieldCheck"
      showAllCategory
      compactRelated
      seoContent={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <SeoSection
            aboutTitle="Unix & Linux File Permissions & chmod Explained"
            about={<>
              <p className="text-base leading-relaxed"><strong>Unix File Permissions & chmod Calculator</strong> is a free browser-based tool that converts between numeric (octal) and symbolic Unix/Linux file permissions. Toggle the read/write/execute bits for owner, group, and other — and see the <code>chmod</code> value update instantly. Or type a value like <code>755</code> or <code>rwxr-xr-x</code> and the checkboxes update to match.</p>
              <p className="text-base leading-relaxed">Linux/Unix permissions control access at the file system level. Every file and directory has three groups — owner, group, and other — each with independent read (4), write (2), and execute (1) bits. The sum of those bits gives one octal digit per group: <code>chmod 755</code> = owner full access (7), group and other read+execute (5). This calculator makes that arithmetic instant and visual.</p>
              <p className="text-base leading-relaxed">All conversion runs entirely in your browser — nothing is sent to any server.</p>
            </>}
            useCasesTitle="Common chmod Use Cases"
            useCases={[
              'Calculate the correct chmod value before running it on a production Linux server.',
              'Decode what an existing numeric permission like 644 or 700 actually allows.',
              'Set SSH key file permissions (chmod 600) and directory permissions (chmod 700).',
              'Configure web server file permissions for nginx or Apache document roots (755/644).',
              'Understand what rwxr-xr-x means when you see it in ls -l output.',
              'Set correct chmod permissions for cron job scripts that need to be executable.',
              'Harden a server by identifying files that are too permissive (chmod 777, 666).',
              'Learn Linux file permissions interactively by toggling bits and seeing results live.',
            ]}
            faqs={faqs}
          />
        </>
      }
    >
      <div className="space-y-4">

        {/* Numeric + Symbolic inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Numeric */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          >
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Numeric (Octal)
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>chmod</span>
              <input
                type="text"
                value={numericInput}
                onChange={(e) => applyNumeric(e.target.value)}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-dev)' }}
                placeholder="755"
                maxLength={3}
                spellCheck={false}
                className="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-xl font-mono font-bold outline-none transition-all placeholder:text-white/50 text-center"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '2px solid var(--border-dev)',
                  color: 'var(--color-dev)',
                  letterSpacing: '0.25em',
                }}
              />
              <CopyButton text={numeric} />
            </div>
            {numericError && <p className="text-sm" style={{ color: '#f87171' }}>{numericError}</p>}
          </div>

          {/* Symbolic */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          >
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Symbolic
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>-</span>
              <input
                type="text"
                value={symbolicInput}
                onChange={(e) => applySymbolic(e.target.value)}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-dev)' }}
                placeholder="rwxr-xr-x"
                maxLength={9}
                spellCheck={false}
                className="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-xl font-mono font-bold outline-none transition-all placeholder:text-white/50"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '2px solid var(--border-dev)',
                  color: 'rgba(255,255,255,0.92)',
                  letterSpacing: '0.12em',
                }}
              />
              <CopyButton text={fullSymbolic} />
            </div>
            {symbolicError && <p className="text-sm" style={{ color: '#f87171' }}>{symbolicError}</p>}
          </div>
        </div>

        {/* Per-entity bit toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ENTITIES.map(({ id, label, short }) => {
            const color = ENTITY_COLOR[id]
            const octalVal = permsToOctal(perms[id])
            const sym = permsToSymbolic(perms[id])
            return (
              <div
                key={id}
                className="rounded-xl p-4 space-y-3"
                style={{ background: 'var(--surface)', border: `2px solid ${color}22` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded font-mono"
                      style={{ background: `${color}20`, color }}
                    >
                      {short}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-bold" style={{ color }}>{octalVal}</span>
                    <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>{sym}</span>
                  </div>
                </div>

                {/* Bit toggles */}
                <div className="flex flex-col gap-2">
                  {BITS.map(({ id: bit, label: bitLabel, octal }) => {
                    const active = perms[id][bit]
                    return (
                      <button
                        key={bit}
                        onClick={() => toggleBit(id, bit)}
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition-all text-left"
                        style={{
                          background: active ? `${color}15` : 'rgba(0,0,0,0.25)',
                          border: `2px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.borderColor = `${color}55`
                            e.currentTarget.style.background = `${color}08`
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                            e.currentTarget.style.background = 'rgba(0,0,0,0.25)'
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {/* Checkbox indicator */}
                          <span
                            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold"
                            style={{
                              background: active ? color : 'rgba(255,255,255,0.08)',
                              border: `2px solid ${active ? color : 'rgba(255,255,255,0.2)'}`,
                              color: '#000',
                            }}
                          >
                            {active && '✓'}
                          </span>
                          <span className="font-mono text-sm font-semibold" style={{ color: active ? color : 'rgba(255,255,255,0.55)' }}>
                            {bit}
                          </span>
                          <span className="text-sm" style={{ color: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>
                            {bitLabel}
                          </span>
                        </div>
                        <span
                          className="text-xs font-mono font-semibold"
                          style={{ color: active ? color : 'rgba(255,255,255,0.25)' }}
                        >
                          +{octal}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Result summary */}
        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: 'rgba(139,92,246,0.08)', border: '2px solid var(--border-dev-idle)' }}
        >
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>chmod command</p>
            <p className="text-lg font-mono font-semibold" style={{ color: 'var(--color-dev)' }}>
              chmod {numeric} <span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>filename</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.75)' }}>{fullSymbolic}</span>
            <CopyButton text={`chmod ${numeric}`} />
          </div>
        </div>

        {/* Preset examples */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Common Presets</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PRESET_EXAMPLES.map(({ label, desc, note }) => (
              <button
                key={label}
                onClick={() => applyPreset(label)}
                className="rounded-lg px-3 py-2.5 text-left transition-all"
                style={{
                  background: numeric === label ? 'rgba(139,92,246,0.12)' : 'rgba(0,0,0,0.2)',
                  border: `2px solid ${numeric === label ? 'var(--color-dev)' : 'var(--border-dev-idle)'}`,
                }}
                onMouseEnter={(e) => {
                  if (numeric !== label) e.currentTarget.style.borderColor = 'var(--border-dev)'
                }}
                onMouseLeave={(e) => {
                  if (numeric !== label) e.currentTarget.style.borderColor = 'var(--border-dev-idle)'
                }}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono font-bold text-base" style={{ color: 'var(--color-dev)' }}>{label}</span>
                  <span className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</span>
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{note}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Reference table */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Bit Reference — Octal Values</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>Bit</th>
                  <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: ENTITY_COLOR.owner }}>Owner</th>
                  <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: ENTITY_COLOR.group }}>Group</th>
                  <th className="text-left pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: ENTITY_COLOR.other }}>Other</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { bit: 'Read (r)',    vals: ['400', '040', '004'] },
                  { bit: 'Write (w)',   vals: ['200', '020', '002'] },
                  { bit: 'Execute (x)', vals: ['100', '010', '001'] },
                ].map(({ bit, vals }, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <td className="py-1.5 pr-6" style={{ color: 'rgba(255,255,255,0.7)' }}>{bit}</td>
                    {vals.map((v, j) => (
                      <td key={j} className="py-1.5 pr-6" style={{ color: Object.values(ENTITY_COLOR)[j] }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ToolLayout>
  )
}

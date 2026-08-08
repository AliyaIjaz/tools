'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type Base = 2 | 8 | 10 | 16

const BASES: { base: Base; label: string; prefix: string; chars: string }[] = [
  { base: 2,  label: 'Binary',      prefix: '0b', chars: '01' },
  { base: 8,  label: 'Octal',       prefix: '0o', chars: '0-7' },
  { base: 10, label: 'Decimal',     prefix: '',   chars: '0-9' },
  { base: 16, label: 'Hexadecimal', prefix: '0x', chars: '0-9 A-F' },
]

const COLOR: Record<Base, string> = {
  2:  'var(--color-dev)',
  8:  '#34d399',
  10: '#facc15',
  16: '#f472b6',
}

function isValidForBase(value: string, base: Base): boolean {
  if (!value) return true
  const patterns: Record<Base, RegExp> = {
    2:  /^[01]+$/,
    8:  /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  }
  return patterns[base].test(value)
}

function convert(value: string, fromBase: Base): Record<Base, string> | null {
  if (!value.trim()) return null
  if (!isValidForBase(value.trim(), fromBase)) return null
  const decimal = parseInt(value.trim(), fromBase)
  if (isNaN(decimal) || decimal < 0) return null
  return {
    2:  decimal.toString(2),
    8:  decimal.toString(8),
    10: decimal.toString(10),
    16: decimal.toString(16).toUpperCase(),
  }
}

function groupBinary(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, '0')
  return padded.match(/.{1,4}/g)?.join(' ') ?? bin
}

export default function NumberBaseConverterPage() {
  const [inputs, setInputs] = useState<Record<Base, string>>({ 2: '', 8: '', 10: '', 16: '' })
  const [activeBase, setActiveBase] = useState<Base>(10)
  const [error, setError] = useState('')

  const handleChange = (base: Base, raw: string) => {
    const value = base === 16 ? raw.toUpperCase() : raw
    setInputs({ 2: '', 8: '', 10: '', 16: '', [base]: value })
    setActiveBase(base)
    if (value && !isValidForBase(value, base)) {
      setError(`"${value}" contains characters invalid for base ${base}`)
    } else {
      setError('')
    }
  }

  const result = convert(inputs[activeBase], activeBase)

  const clearAll = () => {
    setInputs({ 2: '', 8: '', 10: '', 16: '' })
    setError('')
  }

  const hasInput = BASES.some(({ base }) => inputs[base])

  return (
    <ToolLayout
      toolId="number-base-converter"
      title="Number Base Converter"
      description="Convert numbers between binary, octal, decimal, and hexadecimal instantly"
      category="dev"
      iconName="Binary"
      showAllCategory
      compactRelated
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>Number Base Converter Online</strong> is a free browser-based tool that instantly converts integers between <strong>binary (base 2)</strong>, <strong>octal (base 8)</strong>, <strong>decimal (base 10)</strong>, and <strong>hexadecimal (base 16)</strong>. Type in any field and all other bases update live — no button to press.</p>
            <p className="text-base leading-relaxed">This tool is essential for developers working with bitfields, memory addresses, color codes, file permissions, network masks, and low-level programming. It also shows binary values grouped in 4-bit nibbles for easy reading.</p>
            <p className="text-base leading-relaxed">All conversion runs entirely in your browser — nothing is sent to any server.</p>
          </>}
          useCases={[
            'Convert hexadecimal color codes to decimal RGB channel values.',
            'Check binary representations when working with bitfields or bitmasks.',
            'Verify octal Unix file permission values (e.g. 755 in octal).',
            'Convert decimal port numbers or memory addresses to hex.',
            'Understand CPU register values displayed in hex during debugging.',
            'Cross-check number bases when reading assembly or machine code.',
            'Convert IP address octets between decimal and binary.',
            'Validate values in low-level embedded or systems programming.',
          ]}
          faqs={[
            { q: 'What is binary (base 2)?', a: 'Binary is a number system that uses only two digits: 0 and 1. It is the native language of computers since transistors represent two states — off (0) and on (1). For example, the decimal number 42 is 101010 in binary.' },
            { q: 'What is octal (base 8)?', a: 'Octal uses digits 0–7. It was historically common in computing and is still used today for Unix file permissions (e.g. chmod 755). Each octal digit maps exactly to 3 binary digits.' },
            { q: 'What is hexadecimal (base 16)?', a: 'Hexadecimal uses digits 0–9 and letters A–F to represent values 0–15. It is widely used in programming for memory addresses, color codes (#FF5733), and byte-level data because each hex digit maps to exactly 4 binary bits (one nibble).' },
            { q: 'What is a nibble?', a: 'A nibble is 4 bits, which is half a byte. One hexadecimal digit always represents exactly one nibble. This tool groups binary output in sets of 4 bits for easier reading — e.g. 1010 0101 instead of 10100101.' },
            { q: 'Can this tool handle negative numbers?', a: 'No — this tool converts non-negative integers only. Negative number representation (two\'s complement, sign-magnitude) varies by architecture and word size, which is beyond the scope of a general base converter.' },
            { q: 'What is the maximum number supported?', a: 'The tool uses JavaScript\'s built-in parseInt and toString, which support integers up to 2^53 - 1 (Number.MAX_SAFE_INTEGER = 9007199254740991). For cryptographic or 64-bit register values you may need a big-integer library.' },
          ]}
        />
      }
    >
      <div className="space-y-4">

        {/* Input grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BASES.map(({ base, label, prefix, chars }) => {
            const isActive = activeBase === base && hasInput
            const displayValue = result ? result[base] : inputs[base]
            const color = COLOR[base]
            return (
              <div
                key={base}
                className="rounded-xl p-4 space-y-2 transition-all"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isActive ? `0 0 0 1px ${color}22` : 'none',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded font-mono"
                      style={{ background: `${color}20`, color }}
                    >
                      base {base}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{chars}</span>
                </div>

                <div className="flex items-center gap-2">
                  {prefix && (
                    <span className="text-sm font-mono flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{prefix}</span>
                  )}
                  <input
                    type="text"
                    value={displayValue}
                    onChange={(e) => handleChange(base, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}…`}
                    spellCheck={false}
                    className="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-base font-mono outline-none transition-all placeholder:text-white/25"
                    style={{
                      background: 'rgba(0,0,0,0.35)',
                      border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.12)'}`,
                      color: isActive ? color : 'rgba(255,255,255,0.92)',
                    }}
                    onFocus={(e) => {
                      setActiveBase(base)
                      e.currentTarget.style.borderColor = color
                    }}
                    onBlur={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                    }}
                  />
                  {displayValue && <CopyButton text={displayValue} />}
                </div>

                {/* Binary nibble grouping */}
                {base === 2 && result && result[2].length > 4 && (
                  <p className="text-xs font-mono px-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {groupBinary(result[2])}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm px-1" style={{ color: '#f87171' }}>{error}</p>
        )}

        {/* Clear */}
        {hasInput && (
          <div className="flex justify-end">
            <button
              onClick={clearAll}
              className="text-sm px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Reference table */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Quick Reference — 0 to 15</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr>
                  {BASES.map(({ base, label }) => (
                    <th
                      key={base}
                      className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: COLOR[base] }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 16 }, (_, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <td className="py-1 pr-6" style={{ color: COLOR[2] }}>{i.toString(2).padStart(4, '0')}</td>
                    <td className="py-1 pr-6" style={{ color: COLOR[8] }}>{i.toString(8)}</td>
                    <td className="py-1 pr-6" style={{ color: COLOR[10] }}>{i.toString(10)}</td>
                    <td className="py-1 pr-6" style={{ color: COLOR[16] }}>{i.toString(16).toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty state */}
        {!hasInput && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-2 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Type a number in any field to convert</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Binary, octal, decimal, and hex update simultaneously</p>
          </div>
        )}

      </div>
    </ToolLayout>
  )
}

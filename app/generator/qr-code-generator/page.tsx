'use client'

import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Copy, Check } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import Tabs from '@/components/ui/Tabs'
import { downloadBlob } from '@/lib/utils'

type Mode = 'Text / URL' | 'Wi-Fi' | 'Email' | 'Phone' | 'SMS' | 'Contact'
type Ecc = 'L' | 'M' | 'Q' | 'H'

const MODES: Mode[] = ['Text / URL', 'Wi-Fi', 'Email', 'Phone', 'SMS', 'Contact']
const ECC_LEVELS: { value: Ecc; label: string; hint: string }[] = [
  { value: 'L', label: 'L', hint: '~7% recovery' },
  { value: 'M', label: 'M', hint: '~15% recovery' },
  { value: 'Q', label: 'Q', hint: '~25% recovery' },
  { value: 'H', label: 'H', hint: '~30% recovery' },
]

const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(0,0,0,0.3)',
  border: '2px solid var(--border-generator)',
}

function focusProps() {
  return {
    onFocus: (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = 'var(--color-generator)'),
    onBlur: (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = 'var(--border-generator-idle)'),
  }
}

function escapeWifi(s: string) {
  return s.replace(/([\;,:"])/g, '\\$1')
}

function escapeVCard(s: string) {
  return s.replace(/([\;,])/g, '\\$1').replace(/\n/g, '\\n')
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
      {children}
    </label>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2.5 text-base text-white outline-none placeholder:text-white/50"
      style={INPUT_STYLE}
      {...focusProps()}
    />
  )
}

export default function QrCodeGeneratorPage() {
  const [mode, setMode] = useState<Mode>('Text / URL')

  const [text, setText] = useState('https://zenveel.com')
  const [ssid, setSsid] = useState('')
  const [wifiPass, setWifiPass] = useState('')
  const [wifiSec, setWifiSec] = useState<'WPA' | 'WEP' | 'nopass'>('WPA')
  const [wifiHidden, setWifiHidden] = useState(false)
  const [emailTo, setEmailTo] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [phone, setPhone] = useState('')
  const [smsNumber, setSmsNumber] = useState('')
  const [smsBody, setSmsBody] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [org, setOrg] = useState('')
  const [cPhone, setCPhone] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cUrl, setCUrl] = useState('')

  const [size, setSize] = useState(512)
  const [margin, setMargin] = useState(4)
  const [ecc, setEcc] = useState<Ecc>('M')
  const [fg, setFg] = useState('#000000')
  const [bg, setBg] = useState('#ffffff')

  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const payload = useMemo(() => {
    switch (mode) {
      case 'Text / URL':
        return text
      case 'Wi-Fi':
        if (!ssid) return ''
        return `WIFI:T:${wifiSec};S:${escapeWifi(ssid)};${wifiSec === 'nopass' ? '' : `P:${escapeWifi(wifiPass)};`}${wifiHidden ? 'H:true;' : ''};`
      case 'Email': {
        if (!emailTo) return ''
        const params = [
          emailSubject && `subject=${encodeURIComponent(emailSubject)}`,
          emailBody && `body=${encodeURIComponent(emailBody)}`,
        ].filter(Boolean)
        return `mailto:${emailTo}${params.length ? `?${params.join('&')}` : ''}`
      }
      case 'Phone':
        return phone ? `tel:${phone.replace(/\s/g, '')}` : ''
      case 'SMS':
        if (!smsNumber) return ''
        return `SMSTO:${smsNumber.replace(/\s/g, '')}:${smsBody}`
      case 'Contact': {
        if (!firstName && !lastName && !org) return ''
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
          `FN:${escapeVCard(`${firstName} ${lastName}`.trim() || org)}`,
          org && `ORG:${escapeVCard(org)}`,
          cPhone && `TEL:${cPhone}`,
          cEmail && `EMAIL:${cEmail}`,
          cUrl && `URL:${cUrl}`,
          'END:VCARD',
        ].filter(Boolean).join('\n')
      }
    }
  }, [mode, text, ssid, wifiPass, wifiSec, wifiHidden, emailTo, emailSubject, emailBody, phone, smsNumber, smsBody, firstName, lastName, org, cPhone, cEmail, cUrl])

  useEffect(() => {
    let cancelled = false
    if (!payload) {
      setDataUrl('')
      setError('')
      return
    }
    QRCode.toDataURL(payload, {
      width: size,
      margin,
      errorCorrectionLevel: ecc,
      color: { dark: fg, light: bg },
    })
      .then((url) => {
        if (cancelled) return
        setDataUrl(url)
        setError('')
      })
      .catch(() => {
        if (cancelled) return
        setDataUrl('')
        setError('This content is too long to fit in a QR code. Shorten it or lower the error correction level.')
      })
    return () => {
      cancelled = true
    }
  }, [payload, size, margin, ecc, fg, bg])

  function downloadPng() {
    if (!dataUrl) return
    fetch(dataUrl).then((r) => r.blob()).then((b) => downloadBlob(b, 'qr-code.png'))
  }

  async function downloadSvg() {
    if (!payload) return
    const svg = await QRCode.toString(payload, {
      type: 'svg',
      margin,
      errorCorrectionLevel: ecc,
      color: { dark: fg, light: bg },
    })
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qr-code.svg')
  }

  async function copyImage() {
    if (!dataUrl) return
    try {
      const blob = await (await fetch(dataUrl)).blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Copying images is not supported in this browser. Use Download instead.')
    }
  }

  const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '2px solid var(--border-generator-idle)' }

  return (
    <ToolLayout
      toolId="qr-code-generator"
      title="QR Code Generator"
      description="Create custom QR codes for links, Wi-Fi, contacts, and more — download as PNG or SVG"
      category="generator"
      iconName="QrCode"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-lg leading-relaxed"><strong>QR Code Generator Online</strong> is a free tool that turns links, text, Wi-Fi credentials, email addresses, phone numbers, SMS messages, and contact cards into scannable <strong>QR codes</strong> in real time. Type your content, adjust the colors and size, and download a crisp <strong>PNG or SVG</strong> that works on print and screen.</p>
            <p className="text-lg leading-relaxed">Every code is generated <strong>entirely in your browser</strong>. Nothing you type is uploaded, logged, or stored on a server, so Wi-Fi passwords and contact details stay private. The codes are static, which means they never expire, have no scan limits, and carry no tracking redirect or watermark.</p>
            <p className="text-lg leading-relaxed">Choose an <strong>error correction level</strong> from L to H to balance density against how much damage the code can survive. Use the SVG download for posters, packaging, and business cards where you need a vector that scales to any size without blurring.</p>
          </>}
          useCases={[
            'Link a printed flyer, poster, or menu to a website.',
            'Share Wi-Fi access with guests without spelling out the password.',
            'Put a contact card on a business card or email signature.',
            'Add a scannable link to product packaging or labels.',
            'Let people email or text you with a pre-filled message.',
            'Make a tap-to-call code for a storefront window.',
            'Link slides or handouts to online resources.',
            'Share an app download page or social media profile.',
          ]}
          extraSections={[
            {
              title: 'How to make a QR code',
              intro: 'This free QR code maker takes less than a minute and needs no account.',
              items: [
                'Pick what the code should do: open a link, show text, join Wi-Fi, start an email, call a number, send an SMS, or save a contact.',
                'Fill in the fields. The QR code updates as you type, so you can scan it with your phone straight away.',
                'Choose a size, a margin, and colors. Keep the dark color clearly darker than the background.',
                'Pick an error correction level. M suits most uses; choose Q or H if the code will be printed on a rough surface or may get scuffed.',
                'Download the PNG for web pages and documents, or the SVG for print.',
              ],
            },
            {
              title: 'Static vs dynamic QR codes',
              intro: 'The codes this tool creates are static. The content is written directly into the black-and-white pattern, so there is no server in the middle. That has real consequences:',
              items: [
                'They never expire and have no scan limit, because nothing depends on a service staying online.',
                'They cannot be edited later. If a link changes, you need to generate and reprint a new code.',
                'They collect no scan analytics. If you need to track scans or change the destination after printing, you need a dynamic QR service, which redirects through its own server.',
              ],
              closing: 'For a menu, flyer, business card, or Wi-Fi sign where the destination rarely changes, a static code is usually the safer choice.',
            },
            {
              title: 'Tips for QR codes that scan reliably',
              items: [
                'Leave a blank margin (quiet zone) around the code. The QR standard asks for four modules, which is why the default here is 4.',
                'Print it at least about 2 × 2 cm (0.8 in) for close-range scanning, and larger for posters. As a rule of thumb, allow roughly 10 cm of scanning distance for every 1 cm of code width.',
                'Use dark modules on a light background. Inverted codes (light on dark) fail on some scanners.',
                'Shorter content makes a simpler, bigger-moduled pattern that scans faster. Use a short URL where you can.',
                'Test the printed code with at least two different phones before printing in bulk.',
              ],
            },
          ]}
          faqs={[
            { q: 'Is this QR code generator free?', a: 'Yes. It is completely free, has no signup, and adds no watermark to your downloads.' },
            { q: 'Do the QR codes expire?', a: 'No. These are static QR codes — the content is encoded directly in the pattern, so they work forever and do not depend on any service.' },
            { q: 'Is my data uploaded anywhere?', a: 'No. Your content is encoded locally in your browser. Nothing is sent to a server.' },
            { q: 'Should I download PNG or SVG?', a: 'Use PNG for web pages, documents, and chat. Use SVG for print, since it is a vector format that stays sharp at any size.' },
            { q: 'Which error correction level should I choose?', a: 'M (about 15% recovery) suits most uses. Choose Q or H if the code may get scuffed or printed on a textured surface; higher levels make the pattern denser. Choose L for short content shown on clean screens.' },
            { q: 'Will my custom colors scan?', a: 'Yes, as long as the foreground is clearly darker than the background. Avoid inverted (light-on-dark) codes, since some older scanners cannot read them, and keep strong contrast.' },
            { q: 'Why does my QR code say the content is too long?', a: 'QR codes hold a limited amount of data — roughly 2,900 bytes at the lowest error correction level, and less at higher levels. Shorten your text or lower the error correction level.' },
            { q: 'How do Wi-Fi QR codes work?', a: 'Phones that scan the code can offer to join the network directly using the network name, password, and security type you entered. Most modern iPhone and Android cameras support this.' },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="space-y-5">
          <div className="rounded-xl p-4 space-y-4" style={cardStyle}>
            <div className="overflow-x-auto">
              <Tabs tabs={MODES} value={mode} onChange={(t) => setMode(t as Mode)} />
            </div>

            {mode === 'Text / URL' && (
              <Field label="Text or URL">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="https://example.com"
                  className="w-full rounded-lg px-3 py-2.5 text-base text-white outline-none resize-y placeholder:text-white/50"
                  style={INPUT_STYLE}
                  {...focusProps()}
                />
              </Field>
            )}

            {mode === 'Wi-Fi' && (
              <>
                <Field label="Network name (SSID)"><TextInput value={ssid} onChange={setSsid} placeholder="MyNetwork" /></Field>
                <Field label="Security">
                  <select
                    value={wifiSec}
                    onChange={(e) => setWifiSec(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                    className="w-full rounded-lg px-3 py-2.5 text-base text-white outline-none"
                    style={INPUT_STYLE}
                    {...focusProps()}
                  >
                    <option value="WPA" style={{ background: '#111' }}>WPA / WPA2 / WPA3</option>
                    <option value="WEP" style={{ background: '#111' }}>WEP</option>
                    <option value="nopass" style={{ background: '#111' }}>None</option>
                  </select>
                </Field>
                {wifiSec !== 'nopass' && (
                  <Field label="Password"><TextInput value={wifiPass} onChange={setWifiPass} placeholder="Network password" /></Field>
                )}
                <label className="flex items-center gap-2 text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="w-4 h-4" style={{ accentColor: 'var(--color-generator)' }} />
                  Hidden network
                </label>
              </>
            )}

            {mode === 'Email' && (
              <>
                <Field label="Email address"><TextInput type="email" value={emailTo} onChange={setEmailTo} placeholder="name@example.com" /></Field>
                <Field label="Subject (optional)"><TextInput value={emailSubject} onChange={setEmailSubject} /></Field>
                <Field label="Message (optional)">
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg px-3 py-2.5 text-base text-white outline-none resize-y"
                    style={INPUT_STYLE}
                    {...focusProps()}
                  />
                </Field>
              </>
            )}

            {mode === 'Phone' && (
              <Field label="Phone number"><TextInput type="tel" value={phone} onChange={setPhone} placeholder="+1 555 123 4567" /></Field>
            )}

            {mode === 'SMS' && (
              <>
                <Field label="Phone number"><TextInput type="tel" value={smsNumber} onChange={setSmsNumber} placeholder="+1 555 123 4567" /></Field>
                <Field label="Message (optional)">
                  <textarea
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg px-3 py-2.5 text-base text-white outline-none resize-y"
                    style={INPUT_STYLE}
                    {...focusProps()}
                  />
                </Field>
              </>
            )}

            {mode === 'Contact' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name"><TextInput value={firstName} onChange={setFirstName} /></Field>
                  <Field label="Last name"><TextInput value={lastName} onChange={setLastName} /></Field>
                </div>
                <Field label="Organization"><TextInput value={org} onChange={setOrg} /></Field>
                <Field label="Phone"><TextInput type="tel" value={cPhone} onChange={setCPhone} /></Field>
                <Field label="Email"><TextInput type="email" value={cEmail} onChange={setCEmail} /></Field>
                <Field label="Website"><TextInput value={cUrl} onChange={setCUrl} placeholder="https://" /></Field>
              </>
            )}
          </div>

          {/* Appearance */}
          <div className="rounded-xl p-4 space-y-4" style={cardStyle}>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Size</span>
                <span className="text-base font-mono text-white">{size}px</span>
              </div>
              <input type="range" min={128} max={1024} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" style={{ accentColor: 'var(--color-generator)' }} />
              <div className="flex justify-between text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}><span>128</span><span>1024</span></div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Margin (quiet zone)</span>
                <span className="text-base font-mono text-white">{margin}</span>
              </div>
              <input type="range" min={0} max={8} step={1} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full" style={{ accentColor: 'var(--color-generator)' }} />
            </div>

            <div>
              <span className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Error correction</span>
              <div className="inline-flex items-center gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: '2px solid var(--border-generator-idle)' }}>
                {ECC_LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setEcc(l.value)}
                    title={l.hint}
                    className="px-4 py-1.5 rounded-md text-base font-semibold transition-all"
                    style={{
                      background: ecc === l.value ? 'var(--color-generator)' : 'transparent',
                      color: ecc === l.value ? '#fff' : 'rgba(255,255,255,0.65)',
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {ECC_LEVELS.find((l) => l.value === ecc)?.hint}. Higher levels survive more damage but look denser.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Foreground">
                <div className="flex items-center gap-2">
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} aria-label="Foreground color" className="w-11 h-10 rounded cursor-pointer bg-transparent" />
                  <span className="text-base font-mono text-white">{fg}</span>
                </div>
              </Field>
              <Field label="Background">
                <div className="flex items-center gap-2">
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Background color" className="w-11 h-10 rounded cursor-pointer bg-transparent" />
                  <span className="text-base font-mono text-white">{bg}</span>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl p-4 flex flex-col items-center gap-4 self-start" style={cardStyle}>
          <div
            className="w-full aspect-square max-w-sm rounded-lg flex items-center justify-center overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.3)', border: '2px dashed var(--border-generator-idle)' }}
          >
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dataUrl} alt="Generated QR code" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
            ) : (
              <p className="text-base text-center px-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Your QR code will appear here
              </p>
            )}
          </div>

          {error && <p className="text-base text-center" style={{ color: '#f87171' }}>{error}</p>}

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={downloadPng}
              disabled={!dataUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-generator)', color: '#fff' }}
            >
              <Download size={16} /> PNG
            </button>
            <button
              onClick={downloadSvg}
              disabled={!dataUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-generator)', color: '#fff' }}
            >
              <Download size={16} /> SVG
            </button>
            <button
              onClick={copyImage}
              disabled={!dataUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${copied ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.15)'}`,
                color: copied ? '#34d399' : 'rgba(255,255,255,0.85)',
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}

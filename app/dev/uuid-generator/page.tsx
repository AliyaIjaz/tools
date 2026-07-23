'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import { copyToClipboard } from '@/lib/utils'

const AMOUNTS = [1, 5, 10]

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([crypto.randomUUID()])
  const [amount, setAmount] = useState(1)
  const [justCopiedAll, setJustCopiedAll] = useState(false)

  function generate() {
    setUuids(Array.from({ length: amount }, () => crypto.randomUUID()))
  }

  async function copyAll() {
    await copyToClipboard(uuids.join('\n'))
    setJustCopiedAll(true)
    setTimeout(() => setJustCopiedAll(false), 2000)
  }

  return (
    <ToolLayout
      toolId="uuid-generator"
      title="UUID Generator"
      description="Generate UUID v4 values using the browser's crypto API"
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>UUID Generator Online</strong> is a free browser-based tool that lets you generate <strong>cryptographically secure UUID v4 (Version 4) identifiers</strong> instantly. Whether you need a single UUID or multiple unique identifiers for databases, APIs, cloud applications, or software testing, this tool creates standards-compliant UUIDs with a single click.</p>
            <p className="text-base leading-relaxed">A <strong>UUID (Universally Unique Identifier)</strong>, also known as a <strong>GUID (Globally Unique Identifier)</strong>, is a 128-bit value designed to uniquely identify objects, records, sessions, transactions, and resources across distributed systems. UUID v4 generates identifiers using high-quality random numbers, making collisions extraordinarily unlikely and suitable for virtually all practical applications.</p>
            <p className="text-base leading-relaxed">This generator uses your browser&apos;s built-in <strong><code>crypto.randomUUID()</code></strong> API, which relies on a <strong>cryptographically secure random number generator (CSPRNG)</strong> to produce RFC-compliant Version 4 UUIDs. Because generation happens entirely inside your browser, no UUIDs are transmitted, stored, or processed on a remote server. Your generated identifiers remain completely private.</p>
            <p className="text-base leading-relaxed">Whether you&apos;re a developer, DevOps engineer, database administrator, tester, or student, this UUID Generator helps you quickly create unique IDs for primary keys, REST APIs, distributed systems, cloud infrastructure, microservices, event tracking, request tracing, temporary objects, and automated testing. Generate one or many UUIDs instantly without installing software or writing code.</p>
          </>}
          useCases={[
            'Generate unique primary keys for database records.',
            'Create UUIDs for REST API resources and endpoints.',
            'Generate globally unique identifiers for users, orders, and products.',
            'Produce secure session identifiers during development.',
            'Create unique filenames for cloud storage buckets.',
            'Generate document IDs for NoSQL databases such as Firestore or MongoDB.',
            'Assign request IDs for API logging and debugging.',
            'Create correlation IDs for distributed systems and microservices.',
            'Generate transaction IDs for financial or business applications.',
            'Produce unique event IDs for analytics and event processing.',
            'Generate identifiers for message queues and background jobs.',
            'Create temporary IDs during frontend development and prototyping.',
            'Build test fixtures requiring unique identifiers.',
            'Generate UUIDs for Kubernetes resources and cloud-native applications.',
            'Produce unique object identifiers for caching systems.',
            'Create unique references for automation scripts and CI/CD pipelines.',
            'Generate multiple UUIDs at once for batch operations.',
            'Learn how UUID Version 4 works while studying software development.',
          ]}
          faqs={[
            { q: 'What is a UUID?', a: 'A UUID (Universally Unique Identifier) is a standardized 128-bit identifier designed to uniquely identify objects, records, devices, sessions, and resources without requiring a central authority. UUIDs are widely used in databases, APIs, distributed systems, and cloud applications.' },
            { q: 'What is UUID v4?', a: 'UUID Version 4 generates identifiers using cryptographically secure random numbers. Because nearly all bits are randomly generated, the probability of two independently generated UUIDs being identical is extraordinarily small.' },
            { q: 'What is a GUID?', a: 'GUID stands for Globally Unique Identifier. In practice, GUID and UUID are generally used interchangeably. Microsoft commonly uses the term GUID, while most programming languages and standards use UUID.' },
            { q: 'Are UUID and GUID the same?', a: 'Yes. They represent the same 128-bit identifier format. The difference is mainly terminology used by different platforms and technologies.' },
            { q: 'Are these UUIDs suitable for production?', a: "Yes. This tool uses the browser's crypto.randomUUID() API, which relies on a cryptographically secure random number generator (CSPRNG). The generated UUIDs are suitable for production applications that require Version 4 UUIDs." },
            { q: 'Do the generated UUIDs follow the UUID standard?', a: 'Yes. The generated identifiers conform to the widely adopted UUID Version 4 specification defined by RFC standards for UUID generation.' },
            { q: 'Can two UUIDs ever be the same?', a: 'While collisions are theoretically possible, the probability is so incredibly small that UUID v4 is considered unique for virtually all real-world applications.' },
            { q: 'Why use UUID instead of auto-incrementing IDs?', a: 'UUIDs can be generated independently without a central database, making them ideal for distributed systems, cloud services, microservices, offline applications, and systems where globally unique identifiers are required.' },
            { q: 'Can I generate multiple UUIDs at once?', a: 'Yes. You can generate multiple UUIDs simultaneously, such as 1, 5, or 10 identifiers, making it easy to populate test data or create batches of unique IDs.' },
            { q: 'Are UUIDs sequential?', a: 'No. UUID Version 4 identifiers are randomly generated and do not follow a sequential order.' },
            { q: 'Can UUIDs reveal personal information?', a: 'No. UUID v4 contains randomly generated values and does not include usernames, timestamps, IP addresses, or other personally identifiable information.' },
            { q: 'Which databases support UUIDs?', a: 'Most modern databases support UUIDs, including PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, MongoDB, Firestore, Cassandra, and many other relational and NoSQL databases.' },
            { q: 'Which programming languages support UUIDs?', a: 'UUIDs are supported by JavaScript, TypeScript, Node.js, Python, Java, C#, Go, PHP, Ruby, Rust, Kotlin, Swift, and many other programming languages through built-in libraries or standard packages.' },
            { q: 'Is my data uploaded to a server?', a: "No. All UUID generation happens locally in your browser using the built-in crypto.randomUUID() API. No identifiers are uploaded, stored, logged, or shared with any server." },
            { q: 'Can I use this tool offline?', a: 'Yes. Once the webpage has loaded, UUID generation works locally in your browser without requiring an internet connection.' },
            { q: 'Is there a limit to how many UUIDs I can generate?', a: 'There is no fixed limit imposed by the tool itself. You can generate as many UUIDs as your browser and device can comfortably handle.' },
            { q: 'Why are UUIDs useful?', a: 'UUIDs eliminate the need for a central ID generator, reduce the risk of identifier collisions, simplify data synchronization across multiple systems, and make it easier to build scalable applications, distributed architectures, APIs, cloud services, and microservices that require globally unique identifiers.' },
          ]}
        />
      }
      category="dev"
      iconName="Fingerprint"
      showAllCategory
    >
      <div className="space-y-5">
        {/* Controls */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <label className="block text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
            How many UUIDs?
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {AMOUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setAmount(n)}
                  className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all"
                  style={{
                    background: amount === n ? 'var(--color-dev)' : 'transparent',
                    color: amount === n ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={generate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 active:brightness-90"
              style={{ background: 'var(--color-dev)', color: '#fff' }}
            >
              <RefreshCw size={14} />
              Generate
            </button>

            {uuids.length > 1 && (
              <button
                onClick={copyAll}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 active:brightness-75"
                style={{
                  background: justCopiedAll ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${justCopiedAll ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.15)'}`,
                  color: justCopiedAll ? '#34d399' : 'rgba(255,255,255,0.85)',
                }}
              >
                {justCopiedAll ? 'Copied all!' : 'Copy all'}
              </button>
            )}
          </div>
        </div>

        {/* UUID list */}
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <code
                className="text-sm flex-1 tracking-wide"
                style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                {uuid}
              </code>
              <CopyButton text={uuid} />
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}

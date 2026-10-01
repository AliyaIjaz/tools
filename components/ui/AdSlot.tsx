'use client'

type Props = {
  side: 'left' | 'right'
}

export default function AdSlot({ side }: Props) {
  return (
    <aside
      aria-label={`${side} advertisement`}
      className="hidden xl:flex flex-col items-center pt-8"
      style={{ width: 160, minWidth: 160 }}
    >
      <div
        className="sticky top-20 flex items-center justify-center rounded-xl w-[160px] h-[600px]"
        style={{
          background: 'var(--surface)',
          border: '1px dashed var(--border-hover)',
        }}
      >
        <span
          className="text-sm font-medium uppercase tracking-widest rotate-0 select-none"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          Ad
        </span>
      </div>
    </aside>
  )
}

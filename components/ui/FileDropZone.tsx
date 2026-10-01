'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  onFile: (file: File) => void
  accept?: string
  label?: string
  hint?: string
  className?: string
  color?: string
  dimColor?: string
}

export default function FileDropZone({
  onFile,
  accept = 'image/*',
  label = 'Drop an image or click to upload',
  hint = 'PNG, JPG, WebP, GIF',
  className,
  color = 'var(--color-image)',
  dimColor = 'var(--color-image-dim)',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn('rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all', className)}
      style={{
        border: `2px dashed ${color}`,
        background: dragging ? dimColor : 'var(--surface)',
        aspectRatio: '4 / 3',
        width: '50%',
        margin: '0 auto',
      }}
    >
      <Upload size={28} style={{ color }} />
      <div className="text-center px-6">
        <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{label}</p>
        <p className="text-sm mt-1.5" style={{ color }}>{hint}</p>
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]) }} />
    </div>
  )
}

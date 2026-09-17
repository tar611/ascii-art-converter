import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg']

interface ImageDropzoneProps {
  previewUrl: string | null
  onFileSelected: (file: File) => void
}

export function ImageDropzone({ previewUrl, onFileSelected }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please choose a PNG or JPG image.')
        return
      }
      setError(null)
      onFileSelected(file)
    },
    [onFileSelected],
  )

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files[0])
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0])
  }

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragging ? 'border-emerald-400 bg-emerald-950/30' : 'border-neutral-700 bg-neutral-900'
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected upload preview" className="max-h-40 rounded" />
        ) : (
          <>
            <p className="text-neutral-200">Drop a PNG or JPG here</p>
            <p className="text-sm text-neutral-500">or click to browse</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}

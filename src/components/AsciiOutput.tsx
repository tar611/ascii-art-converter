import { useState } from 'react'
import { asciiGridToText, type AsciiGrid } from '../lib/asciiConverter'

interface AsciiOutputProps {
  grid: AsciiGrid
  colorMode: boolean
}

export function AsciiOutput({ grid, colorMode }: AsciiOutputProps) {
  const [copied, setCopied] = useState(false)
  const text = asciiGridToText(grid)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleDownload = () => {
    // Plain text always downloads uncolored — ANSI color codes would make
    // the .txt file painful to read anywhere except a terminal.
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ascii-art.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-3">
      <pre className="max-w-full overflow-auto rounded-lg border border-neutral-800 bg-black p-4 font-mono text-[6px] leading-[6px] text-neutral-200 sm:text-[8px] sm:leading-[8px]">
        {colorMode
          ? grid.map((row, rowIndex) => (
              <div key={rowIndex} className="whitespace-pre">
                {row.map((cell, colIndex) => (
                  <span key={colIndex} style={{ color: cell.color }}>
                    {cell.char}
                  </span>
                ))}
              </div>
            ))
          : text}
      </pre>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
        >
          {copied ? 'Copied!' : 'Copy text'}
        </button>
        <button
          onClick={handleDownload}
          className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
        >
          Download .txt
        </button>
      </div>
    </div>
  )
}

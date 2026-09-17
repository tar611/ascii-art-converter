import { useState } from 'react'
import { asciiGridToText, type AsciiGrid } from '../lib/asciiConverter'
import { DISCORD_FREE_LIMIT, exceedsDiscordLimit, wrapForDiscord } from '../lib/discordFormat'

interface AsciiOutputProps {
  grid: AsciiGrid
  colorMode: boolean
}

export function AsciiOutput({ grid, colorMode }: AsciiOutputProps) {
  const [copied, setCopied] = useState(false)
  const [copiedForDiscord, setCopiedForDiscord] = useState(false)
  const text = asciiGridToText(grid)
  const discordText = wrapForDiscord(text)
  const tooLongForDiscord = exceedsDiscordLimit(discordText)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleCopyForDiscord = async () => {
    await navigator.clipboard.writeText(discordText)
    setCopiedForDiscord(true)
    setTimeout(() => setCopiedForDiscord(false), 1500)
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

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopyForDiscord}
          className="rounded border border-indigo-500 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-300 hover:bg-indigo-500/20"
        >
          {copiedForDiscord ? 'Copied!' : 'Copy for Discord'}
        </button>
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

      {tooLongForDiscord && (
        <p className="text-sm text-amber-400">
          This is {discordText.length.toLocaleString()} characters — over Discord's {DISCORD_FREE_LIMIT.toLocaleString()}-character
          message limit (4,000 with Nitro). Lower the width slider until it fits, or Discord will turn the paste into a
          file attachment instead of inline text.
        </p>
      )}
    </div>
  )
}

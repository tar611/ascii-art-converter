import { describe, expect, it } from 'vitest'
import type { AsciiGrid } from './asciiConverter'
import { asciiGridToAnsiText, nearestAnsiCode, wrapAnsiForDiscord } from './ansiFormat'

describe('nearestAnsiCode', () => {
  it('maps a red-ish color to ANSI code 31', () => {
    expect(nearestAnsiCode(220, 50, 47)).toBe(31)
  })

  it('maps pure white to ANSI code 37', () => {
    expect(nearestAnsiCode(255, 255, 255)).toBe(37)
  })
})

describe('asciiGridToAnsiText', () => {
  it('ends with a reset code so later Discord content is not tinted', () => {
    const grid: AsciiGrid = [[{ char: 'X', r: 255, g: 255, b: 255 }]]
    expect(asciiGridToAnsiText(grid)).toMatch(/\[0m$/)
  })

  it('emits one escape sequence per color run, not per character', () => {
    const grid: AsciiGrid = [
      [
        { char: 'A', r: 255, g: 255, b: 255 },
        { char: 'B', r: 255, g: 255, b: 255 },
        { char: 'C', r: 220, g: 50, b: 47 },
      ],
    ]
    const text = asciiGridToAnsiText(grid)
    const escapeCount = (text.match(/\[/g) ?? []).length

    // One for the white run, one for the red cell, one for the trailing reset.
    expect(escapeCount).toBe(3)
  })
})

describe('wrapAnsiForDiscord', () => {
  it('wraps text in a ```ansi code fence', () => {
    expect(wrapAnsiForDiscord('hi')).toBe('```ansi\nhi\n```')
  })
})

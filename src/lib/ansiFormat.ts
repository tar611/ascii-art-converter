import type { AsciiGrid } from './asciiConverter'

interface AnsiColor {
  code: number
  rgb: [number, number, number]
}

// The only 8 foreground colors Discord's ```ansi code fences actually
// render — the "bright" 90-97 range and full 24-bit color are silently
// ignored by Discord's client — so every cell gets quantized to the
// nearest of these instead of its true RGB value.
const ANSI_COLORS: AnsiColor[] = [
  { code: 30, rgb: [79, 84, 92] },
  { code: 31, rgb: [220, 50, 47] },
  { code: 32, rgb: [133, 153, 0] },
  { code: 33, rgb: [181, 137, 0] },
  { code: 34, rgb: [38, 139, 210] },
  { code: 35, rgb: [211, 54, 130] },
  { code: 36, rgb: [42, 161, 152] },
  { code: 37, rgb: [255, 255, 255] },
]

export function nearestAnsiCode(r: number, g: number, b: number): number {
  let bestCode = ANSI_COLORS[0].code
  let bestDistance = Infinity

  for (const { code, rgb } of ANSI_COLORS) {
    const distance = (r - rgb[0]) ** 2 + (g - rgb[1]) ** 2 + (b - rgb[2]) ** 2
    if (distance < bestDistance) {
      bestDistance = distance
      bestCode = code
    }
  }

  return bestCode
}

const ESC = ''
const RESET = `${ESC}[0m`

export function asciiGridToAnsiText(grid: AsciiGrid): string {
  let lastCode: number | null = null

  const lines = grid.map((row) => {
    let line = ''
    for (const cell of row) {
      const code = nearestAnsiCode(cell.r, cell.g, cell.b)

      // Only emit an escape sequence when the color actually changes.
      // Quantizing to 8 colors means long same-colored runs are common in
      // real photos, so this keeps output far shorter than one code per
      // character — which matters a lot given Discord's message length cap.
      if (code !== lastCode) {
        line += `${ESC}[${code}m`
        lastCode = code
      }
      line += cell.char
    }
    return line
  })

  return lines.join('\n') + RESET
}

export function wrapAnsiForDiscord(ansiText: string): string {
  return '```ansi\n' + ansiText + '\n```'
}

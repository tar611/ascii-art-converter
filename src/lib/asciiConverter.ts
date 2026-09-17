export interface AsciiCell {
  char: string
  color: string
}

export type AsciiGrid = AsciiCell[][]

export interface AsciiOptions {
  columns: number
  ramp: string
  invert: boolean
}

// Preset character ramps, ordered from "lightest looking" to "darkest
// looking" when rendered on a dark background. A pixel's brightness picks
// an index into one of these.
export const RAMPS = {
  simple: ' .:-=+*#%@',
  detailed: ' .,:;clodxkO0KXNWM',
  blocks: ' ░▒▓█',
  // The classic 70-character ramp (Paul Bourke's) behind most old-school
  // text-mode ASCII art — the kind seen on GameFAQs/BBS-era sites. Its extra
  // brightness levels and jagged punctuation give a grainier, less "smoothed
  // out" look than the shorter ramps above.
  classic:
    ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
} as const

// Standard perceptual-luminance weights (ITU-R BT.601): the human eye is far
// more sensitive to green than to red or blue, so a straight (r+g+b)/3
// average makes yellows/greens look too dark and blues too light.
const LUMINANCE_WEIGHTS = { r: 0.299, g: 0.587, b: 0.114 }

// Terminal/monospace characters are roughly twice as tall as they are wide.
// Sampling one output row per source pixel row would stretch the picture
// vertically, so we take fewer rows than the columns-to-height ratio implies.
const CHAR_ASPECT_RATIO = 0.55

export function convertImageDataToAsciiGrid(imageData: ImageData, options: AsciiOptions): AsciiGrid {
  const { columns, ramp, invert } = options
  const { width: srcWidth, height: srcHeight, data } = imageData

  const rows = Math.max(1, Math.round(((columns * srcHeight) / srcWidth) * CHAR_ASPECT_RATIO))
  const cellWidth = srcWidth / columns
  const cellHeight = srcHeight / rows

  const grid: AsciiGrid = []

  for (let row = 0; row < rows; row++) {
    const cells: AsciiCell[] = []
    const yStart = Math.floor(row * cellHeight)
    const yEnd = Math.max(yStart + 1, Math.floor((row + 1) * cellHeight))

    for (let col = 0; col < columns; col++) {
      const xStart = Math.floor(col * cellWidth)
      const xEnd = Math.max(xStart + 1, Math.floor((col + 1) * cellWidth))

      let rSum = 0
      let gSum = 0
      let bSum = 0
      let count = 0

      // Average every source pixel that falls inside this cell, rather than
      // reading a single pixel per cell. Point-sampling a large photo down
      // to a handful of characters throws away most of the image and looks
      // noisy; averaging acts like a cheap box blur and looks far cleaner.
      for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
          const i = (y * srcWidth + x) * 4
          rSum += data[i]
          gSum += data[i + 1]
          bSum += data[i + 2]
          count++
        }
      }

      const r = rSum / count
      const g = gSum / count
      const b = bSum / count

      const luminance = LUMINANCE_WEIGHTS.r * r + LUMINANCE_WEIGHTS.g * g + LUMINANCE_WEIGHTS.b * b
      const brightness = invert ? 1 - luminance / 255 : luminance / 255

      // Bright pixels get sparse characters (space), dark pixels get dense
      // ones (the last character in the ramp) — so we index from the end.
      const rampIndex = Math.min(ramp.length - 1, Math.floor((1 - brightness) * ramp.length))

      cells.push({
        char: ramp[rampIndex],
        color: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
      })
    }

    grid.push(cells)
  }

  return grid
}

export function asciiGridToText(grid: AsciiGrid): string {
  return grid.map((row) => row.map((cell) => cell.char).join('')).join('\n')
}

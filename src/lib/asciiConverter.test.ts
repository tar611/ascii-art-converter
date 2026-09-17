import { describe, expect, it } from 'vitest'
import { asciiGridToText, convertImageDataToAsciiGrid, RAMPS } from './asciiConverter'

// ImageData isn't available outside a browser/canvas, so tests build the
// same {width, height, data} shape by hand instead of loading real images.
function makeImageData(width: number, height: number, pixels: [number, number, number][]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4)
  pixels.forEach(([r, g, b], index) => {
    data[index * 4] = r
    data[index * 4 + 1] = g
    data[index * 4 + 2] = b
    data[index * 4 + 3] = 255
  })
  return { width, height, data, colorSpace: 'srgb' } as ImageData
}

describe('convertImageDataToAsciiGrid', () => {
  it('maps a pure white pixel to the sparsest character in the ramp', () => {
    const imageData = makeImageData(1, 1, [[255, 255, 255]])
    const grid = convertImageDataToAsciiGrid(imageData, { columns: 1, ramp: RAMPS.simple, invert: false })

    expect(grid[0][0].char).toBe(' ')
  })

  it('maps a pure black pixel to the densest character in the ramp', () => {
    const imageData = makeImageData(1, 1, [[0, 0, 0]])
    const grid = convertImageDataToAsciiGrid(imageData, { columns: 1, ramp: RAMPS.simple, invert: false })

    expect(grid[0][0].char).toBe('@')
  })

  it('flips the mapping when invert is enabled', () => {
    const imageData = makeImageData(1, 1, [[255, 255, 255]])
    const grid = convertImageDataToAsciiGrid(imageData, { columns: 1, ramp: RAMPS.simple, invert: true })

    expect(grid[0][0].char).toBe('@')
  })

  it('produces one output row per grid row, joined by newlines', () => {
    const imageData = makeImageData(2, 2, [
      [0, 0, 0],
      [255, 255, 255],
      [0, 0, 0],
      [255, 255, 255],
    ])
    const grid = convertImageDataToAsciiGrid(imageData, { columns: 2, ramp: RAMPS.simple, invert: false })
    const text = asciiGridToText(grid)

    expect(text.split('\n')).toHaveLength(grid.length)
    expect(grid.every((row) => row.length === 2)).toBe(true)
  })

  it('averages the pixels within a cell rather than sampling only one', () => {
    // Two source pixels squeezed into a single output column: one black,
    // one white. A correct box-average lands on mid-gray, not either extreme.
    const imageData = makeImageData(2, 1, [
      [0, 0, 0],
      [255, 255, 255],
    ])
    const grid = convertImageDataToAsciiGrid(imageData, { columns: 1, ramp: RAMPS.simple, invert: false })

    expect(grid[0][0].char).not.toBe(' ')
    expect(grid[0][0].char).not.toBe('@')
  })
})

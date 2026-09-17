import { useCallback, useState } from 'react'
import { convertImageDataToAsciiGrid, type AsciiGrid, type AsciiOptions } from '../lib/asciiConverter'
import { getImageData, loadImageFromFile } from '../lib/imageLoader'

interface UseAsciiConverterResult {
  grid: AsciiGrid | null
  previewUrl: string | null
  isConverting: boolean
  error: string | null
  convert: (file: File, options: AsciiOptions) => Promise<void>
}

export function useAsciiConverter(): UseAsciiConverterResult {
  const [grid, setGrid] = useState<AsciiGrid | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const convert = useCallback(async (file: File, options: AsciiOptions) => {
    setIsConverting(true)
    setError(null)

    try {
      const image = await loadImageFromFile(file)
      const imageData = getImageData(image)
      setGrid(convertImageDataToAsciiGrid(imageData, options))
      setPreviewUrl(URL.createObjectURL(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert image.')
    } finally {
      setIsConverting(false)
    }
  }, [])

  return { grid, previewUrl, isConverting, error, convert }
}

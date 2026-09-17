export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read that image file.'))
    }
    img.src = objectUrl
  })
}

// Photos straight off a phone can be 4000px+ per side. Averaging pixels for
// every ascii cell over an image that large noticeably stalls the main
// thread, with no visual payoff once it's being reduced to a few thousand
// characters — so downscale first.
const MAX_SOURCE_DIMENSION = 800

export function getImageData(image: HTMLImageElement): ImageData {
  const scale = Math.min(1, MAX_SOURCE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight))

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('This browser does not support 2D canvas rendering.')
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

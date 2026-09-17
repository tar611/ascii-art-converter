import { useState } from 'react'
import { ImageDropzone } from './components/ImageDropzone'
import { Controls, type AsciiControlsState } from './components/Controls'
import { AsciiOutput } from './components/AsciiOutput'
import { useAsciiConverter } from './hooks/useAsciiConverter'
import { RAMPS } from './lib/asciiConverter'

const DEFAULT_CONTROLS: AsciiControlsState = {
  columns: 120,
  rampKey: 'classic',
  invert: false,
  colorMode: false,
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [controls, setControls] = useState<AsciiControlsState>(DEFAULT_CONTROLS)
  const { grid, previewUrl, isConverting, error, convert } = useAsciiConverter()

  const handleConvert = () => {
    if (!file) return
    convert(file, {
      columns: controls.columns,
      ramp: RAMPS[controls.rampKey],
      invert: controls.invert,
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold">Image → ASCII Art</h1>
          <p className="mt-1 text-neutral-400">
            Drop a PNG or JPG, tune the settings, and convert it into text art.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
          <ImageDropzone previewUrl={previewUrl} onFileSelected={setFile} />
          <Controls
            state={controls}
            disabled={!file}
            isConverting={isConverting}
            onChange={setControls}
            onConvert={handleConvert}
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}

        {grid && <AsciiOutput grid={grid} colorMode={controls.colorMode} />}
      </div>
    </div>
  )
}

export default App

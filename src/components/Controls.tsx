import { RAMPS } from '../lib/asciiConverter'

export interface AsciiControlsState {
  columns: number
  rampKey: keyof typeof RAMPS
  invert: boolean
  colorMode: boolean
}

interface ControlsProps {
  state: AsciiControlsState
  disabled: boolean
  isConverting: boolean
  onChange: (state: AsciiControlsState) => void
  onConvert: () => void
}

export function Controls({ state, disabled, isConverting, onChange, onConvert }: ControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <label className="flex flex-col gap-1 text-sm text-neutral-300">
        Width: {state.columns} characters
        <input
          type="range"
          min={40}
          max={220}
          step={10}
          value={state.columns}
          onChange={(event) => onChange({ ...state, columns: Number(event.target.value) })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-300">
        Character set
        <select
          value={state.rampKey}
          onChange={(event) => onChange({ ...state, rampKey: event.target.value as keyof typeof RAMPS })}
          className="rounded border border-neutral-700 bg-neutral-800 p-2 text-neutral-100"
        >
          {Object.keys(RAMPS).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={state.invert}
          onChange={(event) => onChange({ ...state, invert: event.target.checked })}
        />
        Invert brightness
      </label>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={state.colorMode}
          onChange={(event) => onChange({ ...state, colorMode: event.target.checked })}
        />
        Color output
      </label>

      <button
        onClick={onConvert}
        disabled={disabled || isConverting}
        className="rounded bg-emerald-500 px-4 py-2 font-medium text-neutral-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
      >
        {isConverting ? 'Converting…' : 'Convert to ASCII'}
      </button>
    </div>
  )
}

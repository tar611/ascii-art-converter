# Image to ASCII Art Converter

A browser-based tool that turns a PNG or JPG into ASCII (text) art. Drop in
an image, tune a few settings, and get back colored or plain text art you
can copy or download.

**Live demo:** _add your deployed URL here once you deploy (see Deploying below)_

## How it works

Everything happens in the browser — there is no backend or server upload:

1. The chosen image file is drawn onto an off-screen `<canvas>`.
2. The canvas gives back raw pixel data (`ImageData`) — an array of every
   pixel's red/green/blue/alpha values.
3. The image is divided into a grid of cells (one cell per output
   character). Each cell's pixels are averaged together and converted to a
   brightness value using the standard formula for how humans perceive
   luminance: `0.299×R + 0.587×G + 0.114×B`.
4. That brightness picks a character from a "ramp" — a string of characters
   ordered from sparse-looking (space) to dense-looking (`@`). Bright areas
   of the photo become empty space; dark areas become dense characters.
5. The grid of characters is rendered as text — either plain, or colored
   per-character using that cell's average RGB value.

All of this logic lives in `src/lib/asciiConverter.ts` as plain, framework-free
TypeScript functions, so it's unit-tested without needing a real browser
(see `src/lib/asciiConverter.test.ts`).

## Project structure

```
src/
  lib/
    asciiConverter.ts       # Pure conversion logic: pixels -> ASCII grid (unit tested)
    asciiConverter.test.ts  # Tests for the conversion logic above
    imageLoader.ts           # Browser-only helpers: File -> <img> -> canvas ImageData
  hooks/
    useAsciiConverter.ts     # React state/orchestration around the conversion
  components/
    ImageDropzone.tsx        # Drag-and-drop / click-to-browse file picker
    Controls.tsx              # Width, character set, invert, and color settings
    AsciiOutput.tsx           # Renders the result + copy/download buttons
  App.tsx                    # Wires the pieces together
```

The split between `asciiConverter.ts` (pure logic, no DOM) and
`imageLoader.ts` (browser APIs: `Image`, `canvas`, `URL.createObjectURL`) is
deliberate — it's what makes the actual conversion algorithm testable with
plain Vitest instead of needing a real browser or canvas emulation.

## Getting started

**Requirements:** Node.js 18 or later.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`) in your
browser. Drop a PNG or JPG into the box, adjust the settings, and click
"Convert to ASCII."

## Available scripts

| Command             | What it does                                      |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | Starts the local dev server with hot reload         |
| `npm run test`       | Runs the unit tests (Vitest)                        |
| `npm run typecheck`  | Checks TypeScript types with no build output        |
| `npm run lint`       | Lints the code (oxlint)                             |
| `npm run build`      | Type-checks, then builds a production bundle to `dist/` |
| `npm run preview`    | Serves the production build locally to sanity-check it |

## Settings explained

- **Width (characters)** — how many characters wide the output is. Higher
  = more detail, but a much longer wall of text.
- **Character set** — the "ramp" of characters used to represent
  brightness:
  - `classic` (default) — the 70-character ramp behind old-school text-mode
    ASCII art (GameFAQs/BBS-era). More brightness levels and jagged
    punctuation give a grainier, textured look instead of smooth gradients.
  - `simple` — 10 characters, minimal look (`" .:-=+*#%@"`)
  - `detailed` — 18 characters, smoother gradients
  - `blocks` — Unicode block shading characters (`░▒▓█`) for a chunkier look
- **Invert brightness** — flips which end of the ramp maps to
  light/dark. Useful if your source image is meant to be viewed on a dark
  background.
- **Color output** — colors each character by that region's average RGB
  instead of rendering plain white-on-black text. (Plain-text downloads are
  always uncolored, since color only makes sense inside the browser.)

## Deploying

This is a static site (no backend), so any static host works. Vercel is the
simplest given the rest of the stack:

```bash
npm install -g vercel   # if you don't have it already
vercel                  # deploy a preview
vercel --prod           # deploy to production
```

Or connect the GitHub repo directly at vercel.com/new and it will
auto-detect the Vite project.

## Possible next steps

- Export the result as a downloadable PNG (render the ascii text back onto
  a canvas) instead of only `.txt`.
- Support animated GIFs by converting each frame.
- Add a slider for image contrast/brightness before conversion.

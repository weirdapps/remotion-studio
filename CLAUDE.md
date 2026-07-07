# remotion-studio

Programmatic video creation with React + Remotion. Write compositions as React components, preview in browser, render headlessly to MP4. Public scaffold used as the template for new video work.

## Tech Stack

- React 19, TypeScript 6, Remotion 4.x
- Vitest + React Testing Library + happy-dom for tests
- ESLint + Prettier; ffmpeg required at runtime for rendering
- CI: GitHub Actions ci.yml — typecheck, lint, tests on every push/PR

## Prerequisites

```bash
brew install ffmpeg
npm install
```

## Develop

```bash
npm run studio          # Remotion Studio at http://localhost:3000 — hot reload, timeline scrubbing
```

## Render

```bash
npx remotion render src/index.ts <CompositionId> out/video.mp4
npx remotion still src/index.ts <CompositionId> out/frame.png --frame 30
npx tsx render.mts --comp <CompositionId>       # programmatic render script
npx remotion compositions src/index.ts          # list all registered compositions
```

## Test

```bash
npm test                # vitest run (once)
npm run test:watch      # watch mode
```

## Code Organization

```text
src/
  index.ts              — Remotion entry point
  Root.tsx              — composition registry (add <Composition> here)
  compositions/         — one file or folder per video composition
  lib/                  — shared utilities and helpers
render.mts              — programmatic render wrapper with typed props
public/                 — runtime assets (gitignored; populate locally)
out/                    — render output (gitignored)
test/                   — Vitest test files
```

## Key Conventions

- Register every new composition in `src/Root.tsx` as a `<Composition>` with explicit `durationInFrames`, `fps`, `width`, `height`, and `defaultProps`.
- Use `useCurrentFrame()` + `spring()` / `interpolate()` for animation; avoid CSS transitions (they don't render frame-accurately).
- No compositions are registered yet; the registry in `src/Root.tsx` is empty.
- `out/` and `public/` are gitignored — render outputs stay local.
- This is the public scaffold; NBG-specific and personal compositions live in `remotion-private`.

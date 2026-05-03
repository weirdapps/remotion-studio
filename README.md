# remotion-studio

Programmatic video creation with React + [Remotion](https://www.remotion.dev/).

A minimal scaffold for building video compositions in code — title cards, text reveals, data visualizations, animations — and rendering them headlessly to MP4.

## Prerequisites

- Node.js ≥ 20
- ffmpeg (`brew install ffmpeg` on macOS)

## Install

```bash
npm install
```

## Develop

```bash
npm run studio
```

Opens the Remotion Studio at http://localhost:3000 with hot reload — preview compositions, scrub the timeline, tweak props live.

## Render

```bash
# Render a composition by id (registered in src/Root.tsx)
npx remotion render src/index.ts <CompositionId> out/video.mp4 --props '{...}'

# Render a single still frame
npx remotion still src/index.ts <CompositionId> out/frame.png --frame 30 --props '{...}'

# Programmatic render via tsx
npx tsx render.mts --comp <CompositionId> --props '{...}'

# List available compositions
npx remotion compositions src/index.ts
```

Output goes to `out/` (gitignored).

## Adding a composition

1. Create a new `.tsx` file in `src/compositions/`
2. Export a React component that uses `useCurrentFrame()` and `useVideoConfig()`
3. Register it as a `<Composition>` in `src/Root.tsx`
4. Use `spring()` for organic motion, `interpolate()` for linear mappings

## Project layout

- `src/index.ts` — Remotion entry point (registers Root)
- `src/Root.tsx` — composition registry
- `src/compositions/` — individual video compositions
- `render.mts` — programmatic render script
- `public/` — runtime assets (gitignored; populate locally as needed)
- `out/` — render output (gitignored)

## License

MIT — see [LICENSE](LICENSE).

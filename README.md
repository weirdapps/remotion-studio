# remotion-studio

[![CI](https://github.com/weirdapps/remotion-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/weirdapps/remotion-studio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Remotion](https://img.shields.io/badge/Remotion-4.x-6B21A8)](https://www.remotion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Write videos in React. Render them to MP4.

`remotion-studio` is a scaffold for building video compositions entirely in code — title cards, text reveals, data visualisations, animated charts — and rendering them headlessly to production-ready MP4 files. No timeline scrubbing in a GUI editor, no keyframe exports: the video is just a React component.

The built-in Remotion Studio provides a browser-based preview with hot reload, a scrubbable timeline, and live prop editing. Rendering is done via the CLI or a programmatic TypeScript render script included in the repo.

## Features

- **React-first authoring** — compositions are React components; anything you can render in React you can put in a video
- **Headless rendering** — render MP4s from the CLI or from code, no GUI required
- **Hot-reload preview** — Remotion Studio at `localhost:3000` with frame-accurate scrubbing
- **Programmatic render script** — `render.mts` wraps the Remotion renderer with typed props
- **Full TypeScript** — end-to-end types from composition props to render config
- **Tested** — Vitest + React Testing Library; CI runs typecheck, lint, and tests on every push

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

Opens Remotion Studio at http://localhost:3000 with hot reload — preview compositions, scrub the timeline, tweak props live.

## Render

```bash
# Render a composition by id (registered in src/Root.tsx)
npx remotion render src/index.ts <CompositionId> out/video.mp4

# Pass props inline
npx remotion render src/index.ts <CompositionId> out/video.mp4 --props '{}'

# Render a single still frame
npx remotion still src/index.ts <CompositionId> out/frame.png --frame 30

# Programmatic render via the included script
npx tsx render.mts --comp <CompositionId> --props '{}'

# List all registered compositions
npx remotion compositions src/index.ts
```

Output goes to `out/` (gitignored).

## Adding a composition

1. Create a new `.tsx` file in `src/compositions/`
2. Export a React component that uses `useCurrentFrame()` and `useVideoConfig()`
3. Register it as a `<Composition>` in `src/Root.tsx`
4. Use `spring()` for organic motion, `interpolate()` for linear value mappings

## Project layout

```text
src/
  index.ts          — Remotion entry point (registers Root)
  Root.tsx          — composition registry
  compositions/     — individual video compositions
  lib/              — shared utilities and helpers
render.mts          — programmatic render script
public/             — runtime assets (gitignored; populate locally)
out/                — render output (gitignored)
```

## License

MIT — see [LICENSE](LICENSE).

# remotion-studio

Programmatic video creation with React and Remotion.

[![CI](https://github.com/weirdapps/remotion-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/weirdapps/remotion-studio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-24-brightgreen)](https://nodejs.org/)

Compositions are written as React components using the Remotion 4 primitives (`AbsoluteFill`, `Sequence`, `Audio`, `Img`, `useCurrentFrame`, `spring`, `interpolate`). Preview is served by the Remotion Studio browser UI with hot reload; rendering runs headlessly through the Remotion CLI or through the small programmatic wrapper `render.mts` that ships with the repo.

This is the public scaffold. NBG-specific brand assets and internal compositions live in the sibling private repo `remotion-private`.

## Compositions

Compositions are registered in [`src/Root.tsx`](src/Root.tsx). The registry is currently empty; see [Adding a composition](#adding-a-composition) to create your first one.

## Runtime assets

`public/` is gitignored except for `.gitkeep`. Compositions reference static assets (images, audio, and so on) with `staticFile('name.ext')`, and those files must exist under `public/` locally before rendering. A fresh clone does not include them, so populate `public/` before running `npm run studio` or any render command.

## Requirements

- Node.js 22 or newer, enforced by the `engines` field in `package.json`. CI pins Node 24, the version the test suite is verified against. The floor is 22 because `@testing-library/jest-dom` 7 requires Node >= 22 and `jsdom` 30 requires `^22.22.2 || ^24.15.0 || >=26.0.0`.
- ffmpeg on `PATH` for rendering (`brew install ffmpeg`).

## Install

```bash
npm install
```

## Develop

```bash
npm run studio
```

Opens the Remotion Studio preview at `http://localhost:3000` with hot reload, timeline scrubbing, and live prop editing.

## Render

The `npm` scripts wrap `remotion` with the entry point `src/index.ts`:

```bash
# Render the default composition to MP4 (h264)
npm run build

# Render an arbitrary composition by id, positional args go after --
npx remotion render src/index.ts MyComposition out/video.mp4

# Render a single still frame to PNG
npx remotion still src/index.ts MyComposition out/frame.png --frame 30

# List all registered compositions
npx remotion compositions src/index.ts
```

Alternative: the programmatic wrapper in [`render.mts`](render.mts) drives `@remotion/bundler` and `@remotion/renderer` directly and accepts typed args:

```bash
# Video (default)
npx tsx render.mts --comp MyComposition --out out/video.mp4

# Still
npx tsx render.mts --comp MyComposition --still --frame 60 --out out/frame.png

# Custom codec (h264, h265, vp8, vp9)
npx tsx render.mts --comp MyComposition --codec vp9 --out out/video.webm

# Pass input props as JSON
npx tsx render.mts --comp MyComposition --props '{"title":"Hello"}'
```

Output goes to `out/` (gitignored). `.mp4` and `.webm` files are also gitignored globally.

## Adding a composition

1. Create a new `.tsx` file under `src/compositions/` that exports a React component. Use `useCurrentFrame()` for the current frame, `useVideoConfig()` for `fps`, `width`, `height`, `spring()` for organic motion, and `interpolate()` for linear value mapping. Avoid CSS transitions (they do not render frame-accurately).
2. Import the component in [`src/Root.tsx`](src/Root.tsx) and register it as a `<Composition>` with explicit `id`, `component`, `durationInFrames`, `fps`, `width`, `height`, and `defaultProps` if the component takes props.
3. Reference any static asset with `staticFile('name.ext')` and put the file in `public/` (local only, gitignored).

## Configuration

- [`tsconfig.json`](tsconfig.json): ES2022, `moduleResolution: bundler`, `jsx: react-jsx`, strict mode on, output at `dist/` (Remotion bundles do not use this; it exists for type declarations).
- [`vitest.config.ts`](vitest.config.ts): `happy-dom` environment, tests under `test/`.
- [`eslint.config.js`](eslint.config.js): flat config, TypeScript + Prettier compatibility.
- [`package.json`](package.json) `overrides`: pins transitive `postcss` and `brace-expansion` above their advisory ranges so `npm audit` stays clean.
- No `remotion.config.ts` is present; the Remotion CLI uses its defaults.

## Scripts

Full list from [`package.json`](package.json):

| Script                  | What it runs                                            |
| ----------------------- | ------------------------------------------------------- |
| `npm run studio`        | `remotion studio` (browser preview at `:3000`)          |
| `npm run render`        | `remotion render src/index.ts` (positional args follow) |
| `npm run build`         | `remotion render src/index.ts --codec h264`             |
| `npm run still`         | `remotion still src/index.ts`                           |
| `npm run upgrade`       | `remotion upgrade` (bump Remotion packages together)    |
| `npm run lint`          | `eslint`                                                |
| `npm run format`        | `prettier --write .`                                    |
| `npm test`              | `vitest run`                                            |
| `npm run test:watch`    | `vitest` in watch mode                                  |
| `npm run test:coverage` | `vitest run --coverage`                                 |

## Testing

Tests live in `test/` and run under Vitest with `happy-dom` and React Testing Library:

- `test/Root.test.tsx`: smoke-renders `RemotionRoot`.
- `test/render-config.test.ts`: sanity checks on render configuration.
- `test/render-script.test.ts`: covers argument-parsing patterns used by `render.mts` without actually invoking a render.

```bash
npm test
```

## CI

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml): on push and PR to `master`, installs with `npm ci`, then runs `npx tsc --noEmit`, `npm run lint`, `npm test`.
- [`.github/workflows/sonarcloud.yml`](.github/workflows/sonarcloud.yml): SonarCloud scan on push and PR (skips gracefully if `SONAR_TOKEN` is not configured).
- [`.github/workflows/deps-refresh.yml`](.github/workflows/deps-refresh.yml): monthly Dependabot lockfile refresh via the shared `weirdapps/shared-workflows` reusable workflow, gated on `npm test`.
- [`.github/workflows/dependabot-auto-merge.yml`](.github/workflows/dependabot-auto-merge.yml): auto-merges Dependabot patch and minor updates.

## Layout

```text
.
├── src/
│   ├── index.ts               # Remotion entry point, calls registerRoot
│   ├── Root.tsx               # composition registry (add <Composition> here)
│   ├── compositions/          # one file per composition (currently empty)
│   └── lib/                   # shared utilities (currently empty)
├── test/                      # Vitest tests
├── public/                    # runtime assets (gitignored except .gitkeep)
├── render.mts                 # programmatic render wrapper
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── eslint.config.js
```

## Security

See [`SECURITY.md`](SECURITY.md) for the vulnerability-reporting process.

## Remotion license

Remotion has its own license terms in addition to the MIT license of this repo (some usage tiers require a company license from the Remotion team). Consult the Remotion documentation before using this scaffold in a commercial product.

## License

MIT, see [`LICENSE`](LICENSE). Copyright (c) 2026 Dimitrios Plessas.

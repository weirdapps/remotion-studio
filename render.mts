/**
 * Programmatic render script.
 * Usage: npx tsx render.mts --comp TitleCard --props '{"title":"Hello"}' --out ./out/hello.mp4
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, renderStill } from "@remotion/renderer";
import { parseArgs } from "node:util";
import path from "node:path";

const { values } = parseArgs({
  options: {
    comp: { type: "string", default: "TitleCard" },
    props: { type: "string", default: "{}" },
    out: { type: "string" },
    codec: { type: "string", default: "h264" },
    still: { type: "boolean", default: false },
    frame: { type: "string", default: "0" },
  },
});

const compositionId = values.comp!;
const inputProps = JSON.parse(values.props!);
const codec = values.codec as "h264" | "h265" | "vp8" | "vp9";
const isStill = values.still;
const stillFrame = parseInt(values.frame!, 10);

async function main() {
  console.log(`Bundling project...`);
  const bundleLocation = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
    onProgress: (p) => process.stdout.write(`\rBundling: ${(p * 100).toFixed(0)}%`),
  });
  console.log("\nBundle complete.");

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps,
  });

  if (isStill) {
    const outputLocation =
      values.out ?? `./out/${compositionId}_frame${stillFrame}.png`;
    console.log(`Rendering still frame ${stillFrame} → ${outputLocation}`);
    await renderStill({
      serveUrl: bundleLocation,
      composition,
      output: outputLocation,
      inputProps,
      frame: stillFrame,
    });
    console.log(`Done: ${outputLocation}`);
  } else {
    const outputLocation = values.out ?? `./out/${compositionId}.mp4`;
    console.log(`Rendering ${compositionId} → ${outputLocation}`);
    await renderMedia({
      serveUrl: bundleLocation,
      codec,
      composition,
      outputLocation,
      inputProps,
      onProgress: ({ progress }) => {
        process.stdout.write(`\rRendering: ${(progress * 100).toFixed(0)}%`);
      },
    });
    console.log(`\nDone: ${outputLocation}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

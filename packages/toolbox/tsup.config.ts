import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/*.ts", "src/*.tsx"],
    outDir: "dist",
    format: ["cjs", "esm"],
    experimentalDts: true,
    sourcemap: true,
    clean: true,
  },
]);

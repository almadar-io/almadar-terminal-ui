import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx', 'src/demo.tsx'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['react', 'ink', 'ink-spinner', 'ink-text-input', 'ink-select-input'],
});

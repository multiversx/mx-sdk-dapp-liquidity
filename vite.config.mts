import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import nodeResolve from '@rollup/plugin-node-resolve';
import { glob } from 'glob';
import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodeExternals({
      builtinsPrefix: 'strip'
    }),
    dts({
      entryRoot: 'src'
    }),
    tsconfigPaths(),
    svgr()
  ],
  build: {
    minify: false,
    lib: {
      name: 'sdk-dapp-liquidity',
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(['src/**/*.{ts,tsx}'], {
            ignore: ['src/**/*.d.ts', 'src/**/*.d']
          })
          .map((file) => {
            return [
              // The name of the entry point
              // lib/nested/foo.ts becomes nested/foo
              relative(
                'src',
                file.slice(0, file.length - extname(file).length)
              ),
              // The absolute path to the entry file
              // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
              fileURLToPath(new URL(file, import.meta.url))
            ];
          })
      ),
      output: {
        format: 'cjs',
        banner: (chunk) => {
          if (chunk.fileName.includes('.mjs')) {
            return '';
          }
          return '#!/usr/bin/env node';
        },
        inlineDynamicImports: false,
        globals: {
          fetch: 'cross-fetch'
        },
        plugins: [nodeResolve()]
      },
      external: ['cross-fetch', 'cross-fetch/polyfill']
    }
  },
  resolve: {
    alias: {
      src: resolve('src/'),
      replacement: resolve(__dirname, './src')
    }
  }
});

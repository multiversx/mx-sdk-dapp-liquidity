// vite.config.mts
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import nodeResolve from "file:///Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity/node_modules/@rollup/plugin-node-resolve/dist/es/index.js";
import { glob } from "file:///Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity/node_modules/glob/dist/esm/index.js";
import nodeExternals from "file:///Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity/node_modules/rollup-plugin-node-externals/dist/index.js";
import { defineConfig } from "file:///Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity/node_modules/vite-plugin-dts/dist/index.mjs";
import svgr from "file:///Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity/node_modules/vite-plugin-svgr/dist/index.js";
import tsconfigPaths from "file:///Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity";
var __vite_injected_original_import_meta_url = "file:///Users/cipriand/development/multiversx/mx-sdk-dapp-liquidity/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [
    nodeExternals(),
    dts({
      entryRoot: "src"
    }),
    tsconfigPaths(),
    svgr()
  ],
  build: {
    minify: false,
    lib: {
      name: "sdk-dapp-liquidity",
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      fileName: (format, entryName) => `${entryName}.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync(["src/**/*.{ts,tsx}"], {
          ignore: ["src/**/*.d.ts", "src/**/*.d"]
        }).map((file) => {
          return [
            // The name of the entry point
            // lib/nested/foo.ts becomes nested/foo
            relative(
              "src",
              file.slice(0, file.length - extname(file).length)
            ),
            // The absolute path to the entry file
            // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
            fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
          ];
        })
      ),
      output: {
        format: "cjs",
        banner: (chunk) => {
          if (chunk.fileName.includes(".mjs")) {
            return "";
          }
          return "#!/usr/bin/env node";
        },
        inlineDynamicImports: false,
        globals: {
          fetch: "cross-fetch"
        },
        plugins: [nodeResolve()]
      },
      external: ["cross-fetch", "cross-fetch/polyfill"]
    }
  },
  resolve: {
    alias: {
      src: resolve("src/"),
      replacement: resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2NpcHJpYW5kL2RldmVsb3BtZW50L211bHRpdmVyc3gvbXgtc2RrLWRhcHAtbGlxdWlkaXR5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvY2lwcmlhbmQvZGV2ZWxvcG1lbnQvbXVsdGl2ZXJzeC9teC1zZGstZGFwcC1saXF1aWRpdHkvdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jaXByaWFuZC9kZXZlbG9wbWVudC9tdWx0aXZlcnN4L214LXNkay1kYXBwLWxpcXVpZGl0eS92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHsgZXh0bmFtZSwgcmVsYXRpdmUsIHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBub2RlUmVzb2x2ZSBmcm9tICdAcm9sbHVwL3BsdWdpbi1ub2RlLXJlc29sdmUnO1xuaW1wb3J0IHsgZ2xvYiB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IG5vZGVFeHRlcm5hbHMgZnJvbSAncm9sbHVwLXBsdWdpbi1ub2RlLWV4dGVybmFscyc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgbm9kZUV4dGVybmFscygpLFxuICAgIGR0cyh7XG4gICAgICBlbnRyeVJvb3Q6ICdzcmMnXG4gICAgfSksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIHN2Z3IoKVxuICBdLFxuICBidWlsZDoge1xuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBuYW1lOiAnc2RrLWRhcHAtbGlxdWlkaXR5JyxcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQsIGVudHJ5TmFtZSkgPT5cbiAgICAgICAgYCR7ZW50cnlOYW1lfS4ke2Zvcm1hdCA9PT0gJ2VzJyA/ICdtanMnIDogJ2pzJ31gLFxuICAgICAgZm9ybWF0czogWydlcycsICdjanMnXVxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgZ2xvYlxuICAgICAgICAgIC5zeW5jKFsnc3JjLyoqLyoue3RzLHRzeH0nXSwge1xuICAgICAgICAgICAgaWdub3JlOiBbJ3NyYy8qKi8qLmQudHMnLCAnc3JjLyoqLyouZCddXG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKChmaWxlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAvLyBUaGUgbmFtZSBvZiB0aGUgZW50cnkgcG9pbnRcbiAgICAgICAgICAgICAgLy8gbGliL25lc3RlZC9mb28udHMgYmVjb21lcyBuZXN0ZWQvZm9vXG4gICAgICAgICAgICAgIHJlbGF0aXZlKFxuICAgICAgICAgICAgICAgICdzcmMnLFxuICAgICAgICAgICAgICAgIGZpbGUuc2xpY2UoMCwgZmlsZS5sZW5ndGggLSBleHRuYW1lKGZpbGUpLmxlbmd0aClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgLy8gVGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGVudHJ5IGZpbGVcbiAgICAgICAgICAgICAgLy8gbGliL25lc3RlZC9mb28udHMgYmVjb21lcyAvcHJvamVjdC9saWIvbmVzdGVkL2Zvby50c1xuICAgICAgICAgICAgICBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoZmlsZSwgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfSlcbiAgICAgICksXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZm9ybWF0OiAnY2pzJyxcbiAgICAgICAgYmFubmVyOiAoY2h1bmspID0+IHtcbiAgICAgICAgICBpZiAoY2h1bmsuZmlsZU5hbWUuaW5jbHVkZXMoJy5tanMnKSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJyMhL3Vzci9iaW4vZW52IG5vZGUnO1xuICAgICAgICB9LFxuICAgICAgICBpbmxpbmVEeW5hbWljSW1wb3J0czogZmFsc2UsXG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICBmZXRjaDogJ2Nyb3NzLWZldGNoJ1xuICAgICAgICB9LFxuICAgICAgICBwbHVnaW5zOiBbbm9kZVJlc29sdmUoKV1cbiAgICAgIH0sXG4gICAgICBleHRlcm5hbDogWydjcm9zcy1mZXRjaCcsICdjcm9zcy1mZXRjaC9wb2x5ZmlsbCddXG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIHNyYzogcmVzb2x2ZSgnc3JjLycpLFxuICAgICAgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKVxuICAgIH1cbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdXLFNBQVMscUJBQXFCO0FBQ3RZLFNBQVMsU0FBUyxVQUFVLGVBQWU7QUFDM0MsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxZQUFZO0FBQ3JCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFSMUIsSUFBTSxtQ0FBbUM7QUFBd0wsSUFBTSwyQ0FBMkM7QUFXbFIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsSUFBSTtBQUFBLE1BQ0YsV0FBVztBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLElBQ2QsS0FBSztBQUFBLEVBQ1A7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLEtBQUs7QUFBQSxNQUNILE1BQU07QUFBQSxNQUNOLE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsVUFBVSxDQUFDLFFBQVEsY0FDakIsR0FBRyxTQUFTLElBQUksV0FBVyxPQUFPLFFBQVEsSUFBSTtBQUFBLE1BQ2hELFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxJQUN2QjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsT0FBTyxPQUFPO0FBQUEsUUFDWixLQUNHLEtBQUssQ0FBQyxtQkFBbUIsR0FBRztBQUFBLFVBQzNCLFFBQVEsQ0FBQyxpQkFBaUIsWUFBWTtBQUFBLFFBQ3hDLENBQUMsRUFDQSxJQUFJLENBQUMsU0FBUztBQUNiLGlCQUFPO0FBQUE7QUFBQTtBQUFBLFlBR0w7QUFBQSxjQUNFO0FBQUEsY0FDQSxLQUFLLE1BQU0sR0FBRyxLQUFLLFNBQVMsUUFBUSxJQUFJLEVBQUUsTUFBTTtBQUFBLFlBQ2xEO0FBQUE7QUFBQTtBQUFBLFlBR0EsY0FBYyxJQUFJLElBQUksTUFBTSx3Q0FBZSxDQUFDO0FBQUEsVUFDOUM7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNMO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixRQUFRLENBQUMsVUFBVTtBQUNqQixjQUFJLE1BQU0sU0FBUyxTQUFTLE1BQU0sR0FBRztBQUNuQyxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFBQSxRQUNBLHNCQUFzQjtBQUFBLFFBQ3RCLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxTQUFTLENBQUMsWUFBWSxDQUFDO0FBQUEsTUFDekI7QUFBQSxNQUNBLFVBQVUsQ0FBQyxlQUFlLHNCQUFzQjtBQUFBLElBQ2xEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLE1BQU07QUFBQSxNQUNuQixhQUFhLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3pDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

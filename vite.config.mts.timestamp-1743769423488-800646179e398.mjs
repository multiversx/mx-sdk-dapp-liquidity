// vite.config.mts
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "url";
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
    nodeExternals({
      builtinsPrefix: "strip"
    }),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2NpcHJpYW5kL2RldmVsb3BtZW50L211bHRpdmVyc3gvbXgtc2RrLWRhcHAtbGlxdWlkaXR5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvY2lwcmlhbmQvZGV2ZWxvcG1lbnQvbXVsdGl2ZXJzeC9teC1zZGstZGFwcC1saXF1aWRpdHkvdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jaXByaWFuZC9kZXZlbG9wbWVudC9tdWx0aXZlcnN4L214LXNkay1kYXBwLWxpcXVpZGl0eS92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBleHRuYW1lLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgbm9kZVJlc29sdmUgZnJvbSAnQHJvbGx1cC9wbHVnaW4tbm9kZS1yZXNvbHZlJztcbmltcG9ydCB7IGdsb2IgfSBmcm9tICdnbG9iJztcbmltcG9ydCBub2RlRXh0ZXJuYWxzIGZyb20gJ3JvbGx1cC1wbHVnaW4tbm9kZS1leHRlcm5hbHMnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIG5vZGVFeHRlcm5hbHMoe1xuICAgICAgYnVpbHRpbnNQcmVmaXg6ICdzdHJpcCdcbiAgICB9KSxcbiAgICBkdHMoe1xuICAgICAgZW50cnlSb290OiAnc3JjJ1xuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICBzdmdyKClcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBtaW5pZnk6IGZhbHNlLFxuICAgIGxpYjoge1xuICAgICAgbmFtZTogJ3Nkay1kYXBwLWxpcXVpZGl0eScsXG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0LCBlbnRyeU5hbWUpID0+XG4gICAgICAgIGAke2VudHJ5TmFtZX0uJHtmb3JtYXQgPT09ICdlcycgPyAnbWpzJyA6ICdqcyd9YCxcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAnY2pzJ11cbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIGdsb2JcbiAgICAgICAgICAuc3luYyhbJ3NyYy8qKi8qLnt0cyx0c3h9J10sIHtcbiAgICAgICAgICAgIGlnbm9yZTogWydzcmMvKiovKi5kLnRzJywgJ3NyYy8qKi8qLmQnXVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm1hcCgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgLy8gVGhlIG5hbWUgb2YgdGhlIGVudHJ5IHBvaW50XG4gICAgICAgICAgICAgIC8vIGxpYi9uZXN0ZWQvZm9vLnRzIGJlY29tZXMgbmVzdGVkL2Zvb1xuICAgICAgICAgICAgICByZWxhdGl2ZShcbiAgICAgICAgICAgICAgICAnc3JjJyxcbiAgICAgICAgICAgICAgICBmaWxlLnNsaWNlKDAsIGZpbGUubGVuZ3RoIC0gZXh0bmFtZShmaWxlKS5sZW5ndGgpXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIC8vIFRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBlbnRyeSBmaWxlXG4gICAgICAgICAgICAgIC8vIGxpYi9uZXN0ZWQvZm9vLnRzIGJlY29tZXMgL3Byb2plY3QvbGliL25lc3RlZC9mb28udHNcbiAgICAgICAgICAgICAgZmlsZVVSTFRvUGF0aChuZXcgVVJMKGZpbGUsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0pXG4gICAgICApLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGZvcm1hdDogJ2NqcycsXG4gICAgICAgIGJhbm5lcjogKGNodW5rKSA9PiB7XG4gICAgICAgICAgaWYgKGNodW5rLmZpbGVOYW1lLmluY2x1ZGVzKCcubWpzJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICcjIS91c3IvYmluL2VudiBub2RlJztcbiAgICAgICAgfSxcbiAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IGZhbHNlLFxuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgZmV0Y2g6ICdjcm9zcy1mZXRjaCdcbiAgICAgICAgfSxcbiAgICAgICAgcGx1Z2luczogW25vZGVSZXNvbHZlKCldXG4gICAgICB9LFxuICAgICAgZXh0ZXJuYWw6IFsnY3Jvc3MtZmV0Y2gnLCAnY3Jvc3MtZmV0Y2gvcG9seWZpbGwnXVxuICAgIH1cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBzcmM6IHJlc29sdmUoJ3NyYy8nKSxcbiAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcbiAgICB9XG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VyxTQUFTLFNBQVMsVUFBVSxlQUFlO0FBQ25aLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8saUJBQWlCO0FBQ3hCLFNBQVMsWUFBWTtBQUNyQixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sbUJBQW1CO0FBUjFCLElBQU0sbUNBQW1DO0FBQXdMLElBQU0sMkNBQTJDO0FBV2xSLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLGNBQWM7QUFBQSxNQUNaLGdCQUFnQjtBQUFBLElBQ2xCLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGLFdBQVc7QUFBQSxJQUNiLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxJQUNkLEtBQUs7QUFBQSxFQUNQO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixLQUFLO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLFVBQVUsQ0FBQyxRQUFRLGNBQ2pCLEdBQUcsU0FBUyxJQUFJLFdBQVcsT0FBTyxRQUFRLElBQUk7QUFBQSxNQUNoRCxTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsSUFDdkI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLE9BQU8sT0FBTztBQUFBLFFBQ1osS0FDRyxLQUFLLENBQUMsbUJBQW1CLEdBQUc7QUFBQSxVQUMzQixRQUFRLENBQUMsaUJBQWlCLFlBQVk7QUFBQSxRQUN4QyxDQUFDLEVBQ0EsSUFBSSxDQUFDLFNBQVM7QUFDYixpQkFBTztBQUFBO0FBQUE7QUFBQSxZQUdMO0FBQUEsY0FDRTtBQUFBLGNBQ0EsS0FBSyxNQUFNLEdBQUcsS0FBSyxTQUFTLFFBQVEsSUFBSSxFQUFFLE1BQU07QUFBQSxZQUNsRDtBQUFBO0FBQUE7QUFBQSxZQUdBLGNBQWMsSUFBSSxJQUFJLE1BQU0sd0NBQWUsQ0FBQztBQUFBLFVBQzlDO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDTDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsUUFBUSxDQUFDLFVBQVU7QUFDakIsY0FBSSxNQUFNLFNBQVMsU0FBUyxNQUFNLEdBQUc7QUFDbkMsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxzQkFBc0I7QUFBQSxRQUN0QixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsUUFDVDtBQUFBLFFBQ0EsU0FBUyxDQUFDLFlBQVksQ0FBQztBQUFBLE1BQ3pCO0FBQUEsTUFDQSxVQUFVLENBQUMsZUFBZSxzQkFBc0I7QUFBQSxJQUNsRDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxNQUFNO0FBQUEsTUFDbkIsYUFBYSxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN6QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

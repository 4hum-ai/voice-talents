// vite.config.ts
import { defineConfig } from "file:///C:/Code/4hum/voice-actor/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.11_lightningcss@1.30.1/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Code/4hum/voice-actor/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_e209d3d7d1e3bdc158c4f1e1c5fa3c1b/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "node:path";
import Icons from "file:///C:/Code/4hum/voice-actor/node_modules/.pnpm/unplugin-icons@22.2.0_@vue+compiler-sfc@3.5.20/node_modules/unplugin-icons/dist/vite.js";
import tailwindcss from "file:///C:/Code/4hum/voice-actor/node_modules/.pnpm/@tailwindcss+vite@4.1.12_vi_c06b1c7d9b778df2d6b94816a2f4f94f/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Code\\4hum\\voice-actor";
var vite_config_default = defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    Icons({
      autoInstall: true,
      collections: ["mdi"]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    port: 5173,
    host: "localhost"
    // Use localhost instead of 127.0.0.1
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDb2RlXFxcXDRodW1cXFxcdm9pY2UtYWN0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXENvZGVcXFxcNGh1bVxcXFx2b2ljZS1hY3RvclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovQ29kZS80aHVtL3ZvaWNlLWFjdG9yL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB0YWlsd2luZGNzcygpLFxuICAgIHZ1ZSgpLFxuICAgIEljb25zKHtcbiAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxuICAgICAgY29sbGVjdGlvbnM6IFsnbWRpJ10sXG4gICAgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBob3N0OiAnbG9jYWxob3N0JywgLy8gVXNlIGxvY2FsaG9zdCBpbnN0ZWFkIG9mIDEyNy4wLjAuMVxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1EsU0FBUyxvQkFBb0I7QUFDL1IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFKeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLE1BQ2IsYUFBYSxDQUFDLEtBQUs7QUFBQSxJQUNyQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

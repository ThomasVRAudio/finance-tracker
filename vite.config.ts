import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  server: {
    hmr: {
      overlay: false,
    },
  },
  build: {
    sourcemap: true, // Ensure source maps are enabled for the build
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // Set as needed
  },
});

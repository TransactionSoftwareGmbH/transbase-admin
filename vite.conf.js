import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    minify: false,
  },
  server: {
    proxy: {
      // string shorthand
      "/api": "http://localhost:3003/api",
    },
  },
});

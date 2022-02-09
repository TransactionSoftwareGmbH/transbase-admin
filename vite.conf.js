import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    minify: false,
  },
  // TODO: has no effect?
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:3003",
  //   },
  // },
});

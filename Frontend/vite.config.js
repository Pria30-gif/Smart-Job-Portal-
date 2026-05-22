<<<<<<< HEAD
 import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

=======
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
<<<<<<< HEAD
    port: 5174,
    host: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5011",
        changeOrigin: true,
=======
    port: 5173, // frontend port
    proxy: {
      "/api": {
        target: "http://localhost:5011", // backend port
        changeOrigin: true,
        secure: false, // disable SSL verification if needed
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      },
    },
  },
});

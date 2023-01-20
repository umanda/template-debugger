import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ...some configs
  server: {
    host: "0.0.0.0",
    port: 3000
  },
  build: {
    chunkSizeWarningLimit: 1600
  }
})

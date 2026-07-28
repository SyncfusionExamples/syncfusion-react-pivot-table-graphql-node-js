import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy GraphQL requests to the backend server
      '/graphql': {
        target: 'https://localhost:5190',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})

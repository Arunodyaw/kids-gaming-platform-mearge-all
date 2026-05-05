// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       // CHANGE: Proxy anything starting with /api to the backend
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true
//       },
//     }
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    proxy: {
      // Proxy anything starting with /api to the backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    inject({
      modules: { Buffer: ['buffer', 'Buffer'] }
    }),
    nodePolyfills()
  ]
})

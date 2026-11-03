import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { parse } from 'yaml'

function ymlPlugin(): Plugin {
  return {
    name: 'yml',
    transform(code, id) {
      const path = id.split('?')[0]
      if (!path?.endsWith('.yml')) return null
      return {
        code: `export default ${JSON.stringify(parse(code))}`,
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), ymlPlugin()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    // One jsdom per worker. Each file still gets its own VM.
    pool: 'vmThreads',
  },
})

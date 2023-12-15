import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react-swc'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [react(), dts(), cssInjectedByJsPlugin()],
  build: {
    watch: {
      include: './src/**',
    },
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Toast',
      fileName: 'aurora',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})

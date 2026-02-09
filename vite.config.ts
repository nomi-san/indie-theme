import fs from 'node:fs/promises'
import { defineConfig, Plugin } from 'vite'
import bundleCssInJs from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  publicDir: false,
  build: {
    modulePreload: false,
    lib: {
      name: 'indie_theme',
      entry: 'src/main.ts',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'index.js'
      }
    }
  },
  plugins: [
    themePlugin(),
    bundleCssInJs({
      topExecutionPriority: false,
      injectCodeFunction: (css) => {
        document.addEventListener('DOMContentLoaded', () => {
          const style = document.createElement('style')
          style.appendChild(document.createTextNode(css))
          document.head.appendChild(style)
        })
      }
    }),
  ],
})

function themePlugin(): Plugin {
  let port: number
  return {
    name: 'theme-plugin',
    apply: 'serve',
    enforce: 'post',
    async configResolved(config) {
      port = config.server.port
      const code = generateDevLoader(port)
      await fs.writeFile('./index.js', code)
    },
    transform(code, id) {
      if (/\.(ts|tsx)$/i.test(id)) return
      return code.replace(/\/src\//g, `https://localhost:${port}/src/`)
    }
  }
}

// no https needed, riot has removed strict mixed content blocking
function generateDevLoader(port: number) {
  const t = function (port: number) {
    document.addEventListener('DOMContentLoaded', async () => {
      await import(`http://localhost:${port}/@vite/client`)
      await import(`http://localhost:${port}/src/main.ts`)
    })
  }
  return `!(${t.toString()})(${port});`
}
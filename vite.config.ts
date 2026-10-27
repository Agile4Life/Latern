import { readFile } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'
import compression from 'compression'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { manusGameTuning } from './scripts/manus-tuning/vite.mjs'

// Relative base keeps production output portable; the Session owns preview HOST/PORT.

/**
 * The dev server (which also backs the Cloud Preview) sends files uncompressed, and three.js
 * alone is ~6 MB of source. Gzip dev responses; production hosting compresses on its own.
 */
const devCompression = (): Plugin => ({
  name: 'aegis-dev-compression',
  apply: 'serve',
  configureServer(server) {
    // Audio is already compressed; range requests for streamed music must pass through untouched.
    const gzip = compression({ filter: (req, res) => !/\.(mp3|woff2|png|webp|jpg)(\?|$)/.test(req.url ?? '') && compression.filter(req, res) })
    // compression's types are Express-flavoured; at runtime it is a plain connect middleware.
    server.middlewares.use(gzip as unknown as (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => void)
  },
})

/**
 * Vite inlines each pre-bundled dependency's source map as base64, which makes three.js a
 * ~4.9 MB response for ~0.7 MB of code. Serve the cached files directly with an external
 * sourceMappingURL instead: DevTools still gets maps, but only fetches them when it's open.
 * Anything not yet on disk (first optimize run) falls through to Vite.
 */
const lightDeps = (): Plugin => ({
  name: 'aegis-dev-light-deps',
  apply: 'serve',
  configureServer(server) {
    const dir = join(server.config.cacheDir, 'deps')
    server.middlewares.use((req, res, next) => {
      const m = /^\/node_modules\/\.vite\/deps\/([\w.-]+\.js)(\?.*)?$/.exec(req.url ?? '')
      if (!m) return next()
      readFile(join(dir, m[1]), 'utf8', (err, code) => {
        if (err) return next()
        res.setHeader('Content-Type', 'text/javascript')
        res.setHeader('Cache-Control', /[?&]v=/.test(m[2] ?? '') ? 'max-age=31536000,immutable' : 'no-cache')
        res.end(`${code.replace(/\n\/\/# sourceMappingURL=.*\s*$/, '')}\n//# sourceMappingURL=${m[1]}.map\n`)
      })
    })
  },
})
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', ['HOST', 'PORT'])
  const port = Number(env.PORT ?? 3000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT')
  return {
    base: './',
    plugins: [manusGameTuning(), devCompression(), lightDeps()],
    // Minify pre-bundled dependencies in dev (three.js drops from ~5.8 MB to ~0.7 MB).
    optimizeDeps: { rolldownOptions: { output: { minify: true } } },
    server: {
      host: env.HOST ?? '127.0.0.1', port, strictPort: true,
      allowedHosts: ['.manuspre.computer', '.manus.computer', '.manus-asia.computer', '.manuscomputer.ai', '.manusvm.computer', 'localhost', '127.0.0.1'],
    },
    build: { target: 'es2022', assetsInlineLimit: 0, chunkSizeWarningLimit: 4600, sourcemap: false },
    test: { environment: 'node', include: ['tests/**/*.test.{ts,mjs}'] },
  }
})

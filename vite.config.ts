import { createHash } from 'node:crypto'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Content Security Policy, added to the built index.html only. The dev server
// injects its own inline scripts (hot reload), which this policy would block.
// GitHub Pages can't send response headers, so it goes in a <meta> tag instead.
// Browsers ignore frame-ancestors (clickjacking protection) in a meta tag, so
// that one isn't available on this host.
function contentSecurityPolicy(): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Allow each inline <script> (the GitHub Pages redirect shim) by the
        // hash of its exact contents, worked out on every build. Editing the
        // shim just produces a new hash, it can't silently break the site
        const inlineScripts = html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)
        const hashes = [...inlineScripts].map(
          ([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`,
        )

        const policy = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(' ')}`,
          // React and drei's 3D labels set some styles inline
          "style-src 'self' 'unsafe-inline'",
          // Vite inlines small images as data: URLs
          "img-src 'self' data:",
          "font-src 'self'",
          // The visitor map's Worker (same URL as src/components/useVisitorStats.ts)
          "connect-src 'self' https://visitor-map.charlesgoodsirportfolio.workers.dev",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'none'", // the site has no forms
          'upgrade-insecure-requests',
        ].join('; ')

        return html.replace(
          /<meta charset[^>]*>/,
          (charset) =>
            `${charset}\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), contentSecurityPolicy()],
})

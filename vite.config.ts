import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

/** The offline edition must not reach for any outside address, so the web-font link is dropped from index.html. */
function dropExternalLinks(): Plugin {
  return {
    name: 'drop-external-links',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (ctx.server || process.env['VITE_OFFLINE'] !== 'true') return html;
        return html
          .replace(/<link rel="preconnect"[^>]*>\s*/g, '')
          .replace(/<!-- Loaded without blocking[\s\S]*?<\/noscript>\s*/, '');
      },
    },
  };
}

// Static site: relative base so it can be hosted from any path (GitHub Pages, etc.).
// `vite build --mode offline` makes the offline edition (see docs/OFFLINE.md).
/** Fills in the public address of the site (VITE_SITE_URL) where index.html names the share-preview image. */
function siteUrl(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', process.env['VITE_SITE_URL'] ?? './'),
    },
  };
}

export default defineConfig(({ mode }) => {
  if (mode === 'offline') process.env['VITE_OFFLINE'] = 'true';
  return {
    base: './',
    build: {
      target: 'es2022',
      sourcemap: mode !== 'offline',
    },
    plugins: [dropExternalLinks(), siteUrl()],
  };
});

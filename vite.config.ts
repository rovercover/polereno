import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import JavaScriptObfuscator from 'javascript-obfuscator';

const crawlerHeaders = {
  'X-Robots-Tag': 'noindex, nofollow, nosnippet, noimageindex',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { headers: crawlerHeaders },
  preview: { headers: crawlerHeaders },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) { if (id.includes('node_modules')) return 'vendor'; },
        plugins: [{
          name: 'obfuscate-site-code',
          renderChunk(code, chunk) {
            // Keep library licenses and avoid slowing down React with vendor obfuscation.
            if (chunk.name === 'vendor') return null;
            return {
              code: JavaScriptObfuscator.obfuscate(code, {
                target: 'browser-no-eval',
                compact: true,
                seed: 37,
                identifierNamesGenerator: 'hexadecimal',
                stringArray: true,
                stringArrayThreshold: 0.65,
                stringArrayEncoding: [],
                controlFlowFlattening: false,
                deadCodeInjection: false,
                debugProtection: false,
                selfDefending: false,
                renameGlobals: false,
                renameProperties: false,
                sourceMap: false,
              }).getObfuscatedCode(),
              map: null,
            };
          },
        }],
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});

# STILL — pool renovation studio

A complete local website built from `work.prd` and `design.md` in this folder. React 19, strict TypeScript, React Router 7, Vite, and Tailwind CSS 4.

## Run locally

Requires Node.js 22.12+ (verified with Node 24).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. On Windows PowerShell with script restrictions, use `npm.cmd` instead of `npm`.

```sh
npm run build         # TypeScript check and production bundle in dist/
npm run preview       # Serve the production build
npm test              # Vitest + React Testing Library
npm run test:e2e      # Playwright, using installed Google Chrome
```

## Included

- Home, portfolio, process, about, and contact pages.
- Four individual concept project pages, an editorial story, colophon, and 404 page.
- Accessible full-screen menu with native focus containment and Escape handling.
- Working portfolio category filters and linked process disclosures.
- React 19 `useActionState` inquiry form with field validation, pending, failure, and success states.
- Responsive imagery in three WebP sizes; self-hosted Inter 400/500.
- Cinematic camera drift and masked water ripples rendered locally with WebGL. A still-image fallback remains available, and browsers without WebGL get gentle CSS motion.
- A global pause/play control remembers the visitor’s choice. Motion stops off-screen, in hidden tabs, and for reduced-motion preferences.
- The exact supplied `@theme` block, with default Tailwind colors, sizes, weights, radii, and shadows removed before applying the reference.
- Responsive layouts at 320, 768, 1024, and 1440 pixels; reduced-motion support.
- Per-route document titles, descriptions, canonical links, and project Open Graph images, managed by React 19.

## Content and delivery configuration

`STILL` is a provisional identity. All four projects are illustrative studies and all eight images were generated for this website. They are labeled as concepts, not real commissions or documented before-and-after renovations. Replace the identity, project content, and contact details with verified business material before launch. Project data lives in `src/data/projects.ts`; page copy is in `src/pages/`.

The inquiry form works in **local preview mode** by default: it clearly explains that a single draft is saved in the visitor’s browser and no message is sent. The confirmation offers a text download and deletion of the saved draft. Nothing is transmitted externally.

For real delivery, copy `.env.example` to `.env.local` and set:

```dotenv
VITE_CONTACT_ENDPOINT=https://your-service.example/inquiries
VITE_SITE_URL=https://your-site.example
```

The endpoint must accept a JSON `POST` with `name`, `email`, `phone`, `poolType`, and `message`. It must return a successful HTTP status only when the inquiry is accepted, and support your website’s origin if it is cross-origin. Configure server-side validation and delivery in that service. Do not put secret credentials in Vite environment variables; they are public browser configuration. The form switches to “Send inquiry” when an endpoint is supplied, times out after 10 seconds, and preserves input after delivery errors.

Deploy `dist/` with a history fallback to `/index.html` so direct project links work. A Netlify-compatible `public/_redirects` is supplied. Metadata is rendered by React; if your chosen social crawler does not execute JavaScript, enable prerendering on your host before sharing project links. This local build has not been published.

## Verification

- 20 component, interaction, validation, delivery, and motion-preference tests.
- 41 Playwright checks against the obfuscated production build: full-page screenshots of eight page types at four widths, design constraints, broken images, browser errors, desktop WCAG A/AA axe checks, plus menu, project navigation, form, downloads, disclosures, reduced motion, animated-frame changes, pause persistence, WebGL fallback, and crawler headers.
- Screenshots are written to `test-results/`; the test report is in `playwright-report/`.
- For a mobile Lighthouse audit, run the production preview on port 4174, then `node scripts/audit.mjs`. The HTML and JSON reports are written to `reports/`. Set `CHROME_PATH` if Chrome is installed elsewhere.
- To record the real-time water effect as a six-second WebM preview, run `node scripts/capture-motion.mjs` while the production preview is on port 4174. This uses Chrome’s MediaRecorder without a separate video encoder installation.

## Public-site copying deterrents

The site stays public. `npm run build` now obfuscates the application JavaScript, minifies the vendor JavaScript and CSS, explicitly disables source maps, and verifies that source files and maps are absent from `dist/`. Readable development source remains in `src/` for maintenance. Always deploy only `dist/`; do not expose the development server or repository directory.

The requested crawler restrictions are applied through `robots.txt`, a robots meta tag, and `X-Robots-Tag`. **Search indexing is deliberately disabled**, which reduces discovery through search engines. `Cross-Origin-Resource-Policy: same-origin` also discourages browser-based hotlinking. These headers work in the Vite preview; production hosting must honor the supplied `public/_headers` file (as Netlify/Cloudflare Pages do) or configure equivalent response headers.

These are deterrents, not access controls or encryption. Anyone who can view a public page can still download its assets, inspect its runtime, or take screenshots. Crawlers can ignore robots directives. There are no keyboard, right-click, or developer-tools traps, and no passwords or secrets embedded in the browser code. See [Google’s robots.txt guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro) for the limits of crawler directives.

## Images and type

The 24 optimized assets are in `public/images/`. Original generated PNGs are retained locally in `.assets-source/` (ignored by Git); run `node scripts/optimize-images.mjs` to regenerate WebP variants. Generation notes and prompts are in `ASSETS.md`. Inter’s SIL Open Font License is retained at `public/INTER-LICENSE.txt`.

Implementation references: [Tailwind’s Vite integration](https://tailwindcss.com/docs/installation/using-vite) and [React’s useActionState](https://react.dev/reference/react/useActionState).

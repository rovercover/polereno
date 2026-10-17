# Verification — 17 October 2026

Production build: passed (`npm run build`).

Component and form tests: **20 passed** (`npm test`). Covers shared component semantics, menu state, project filters, form validation, value preservation, local saving/deletion, configured endpoint success/failure handling, and motion preferences.

Browser checks: **41 passed** across the full existing suite (37) and the motion suite (4), against the obfuscated production build in installed Google Chrome. Eight page types checked at **320, 768, 1024, and 1440 px**. No horizontal overflow, broken images, JavaScript exceptions, typography over 40 px, font weights over 500, image corner rounding, gradients, or shadows. Desktop axe WCAG A/AA checks found no violations. Additional checks cover keyboard menu containment and Escape, portfolio navigation, disclosures, form validation and saving, inquiry downloads/deletion, reduced motion, and the missing-page route. Motion checks confirm changing rendered frames, exact frame freezing on pause, saved preferences, off-screen pausing, reduced-motion behavior, graceful WebGL fallback, and crawler/resource headers.

Production artifact checks passed: application JavaScript is obfuscated, source maps and source files are absent from `dist/`, and crawler directives and host-header configuration are present. The original development code remains readable locally.

Mobile Lighthouse, local production homepage with default simulated mobile throttling:

| Category | Score |
| --- | ---: |
| Performance | 95 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 69 |

The SEO score is intentionally lower because the user chose a public site with crawler restrictions: `noindex` and crawl blocking now deliberately prevent search discovery. Other audit scores remain unchanged after motion and obfuscation.

First Contentful Paint: 1.8 s. Largest Contentful Paint: 2.7 s. Local lab results are not a guarantee of performance on a production host. Automated accessibility checks do not replace assistive-technology testing.

Reports: [Lighthouse HTML](lighthouse-mobile.html), [Lighthouse JSON](lighthouse-mobile.json), [motion preview](pool-motion.webm), [desktop with motion controls](motion-desktop.png), [mobile with motion controls](motion-mobile.png). The earlier full-page home screenshots remain as design references.

Desktop home, portfolio, and contact screenshots and mobile home/contact screenshots were visually inspected. The in-app browser handoff was unavailable; Playwright browser verification completed successfully.

Known configuration boundaries: provisional STILL identity; generated concept portfolio; local draft form mode until `VITE_CONTACT_ENDPOINT` is supplied. No hosting publication or real message delivery was performed. React updates metadata at runtime; use host prerendering for social crawlers that do not execute JavaScript.

Copying deterrents do not make the public site impossible to scrape. Production hosting must apply the supplied response headers. No sign-in requirement was added, in accordance with the user’s preference.

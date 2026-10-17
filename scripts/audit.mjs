import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('reports', { recursive: true });
const chrome = await launch({
  chromePath: process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined),
  chromeFlags: ['--headless', '--disable-gpu'],
});

try {
  const result = await lighthouse(process.argv[2] || 'http://127.0.0.1:4174/', {
    port: chrome.port,
    output: ['html', 'json'],
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  if (!result) throw new Error('Lighthouse did not return a report.');
  const [html, json] = result.report;
  await writeFile('reports/lighthouse-mobile.html', html);
  await writeFile('reports/lighthouse-mobile.json', json);
  console.log(JSON.stringify(Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)])), null, 2));
  for (const audit of Object.values(result.lhr.audits)) {
    if (audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== 'informative') console.log(`${audit.id}: ${audit.displayValue || audit.title}`);
  }
} finally {
  await chrome.kill();
}

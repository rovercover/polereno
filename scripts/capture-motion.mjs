import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('reports', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(process.argv[2] || 'http://127.0.0.1:4174/');
  await page.locator('.hero-image[data-renderer="water"]').waitFor();
  await page.screenshot({ path: 'reports/motion-desktop.png' });
  const video = await page.locator('.hero-image canvas').evaluate(async canvas => {
    const stream = canvas.captureStream(24);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 2500000 });
    const chunks = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    const stopped = new Promise(resolve => { recorder.onstop = resolve; });
    recorder.start();
    await new Promise(resolve => setTimeout(resolve, 6000));
    recorder.stop();
    await stopped;
    stream.getTracks().forEach(track => track.stop());
    return Array.from(new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer()));
  });
  await writeFile('reports/pool-motion.webm', new Uint8Array(video));
  await page.setViewportSize({ width: 320, height: 800 });
  await page.screenshot({ path: 'reports/motion-mobile.png' });
  console.log(`Saved six-second motion preview (${Math.round(video.length / 1024)} KB) and desktop/mobile screenshots in reports/.`);
} finally {
  await browser.close();
}

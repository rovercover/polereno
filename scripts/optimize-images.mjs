import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve('.assets-source');
const destination = path.resolve('public/images');
await mkdir(destination, { recursive: true });
const sources = (await readdir(source)).filter(file => file.endsWith('.png'));
for (const file of sources) {
  for (const width of [640, 1000, 1600]) {
    const output = path.join(destination, `${path.parse(file).name}-${width}.webp`);
    await sharp(path.join(source, file)).resize({ width }).webp({ quality: 79, effort: 5 }).toFile(output);
    console.log(`${path.basename(output)}: ${Math.round((await stat(output)).size / 1024)} KB`);
  }
}

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dirs = [
  join(root, 'public/IMG/galeria'),
  join(root, 'public/IMG'),
  join(root, 'public/IMG/Tetimonios'),
  join(root, 'public/IMG/clientes'),
];

for (const dir of dirs) {
  if (!existsSync(dir)) continue;
  const files = await readdir(dir);
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
    const inputPath = join(dir, file);
    const stats = await stat(inputPath);
    if (!stats.isFile()) continue;
    const webpName = file.replace(/\.(png|jpe?g)$/i, '.webp');
    const outputPath = join(dir, webpName);
    if (existsSync(outputPath)) {
      console.log(`⏭ Ya existe: ${webpName}`);
      continue;
    }
    await sharp(inputPath)
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);
    const inSize = (stats.size / 1024 / 1024).toFixed(1);
    const outStats = await stat(outputPath);
    const outSize = (outStats.size / 1024 / 1024).toFixed(1);
    console.log(`✅ ${file} (${inSize}MB) → ${webpName} (${outSize}MB)`);
  }
}

console.log('🎉 Optimización completada');

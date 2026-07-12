import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, '..');
const repoRoot = join(projectRoot, '../..');
const distDir = join(projectRoot, 'dist');
const assetsDir = join(repoRoot, 'assets');

if (!existsSync(distDir)) {
  console.error('dist/ 不存在，请先运行 npm run build');
  process.exit(1);
}

// 同步 index.html
cpSync(join(distDir, 'index.html'), join(repoRoot, 'index.html'));

// 替换 assets 目录
if (existsSync(assetsDir)) rmSync(assetsDir, { recursive: true, force: true });
mkdirSync(assetsDir, { recursive: true });

const distAssets = join(distDir, 'assets');
if (existsSync(distAssets)) {
  for (const name of readdirSync(distAssets)) {
    cpSync(join(distAssets, name), join(assetsDir, name));
  }
}

console.log('已部署到仓库根目录：index.html + assets/');

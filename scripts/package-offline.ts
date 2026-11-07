// Builds the offline edition and zips it for sharing: npm run package:offline
// Output: share/PalestineLivingMap-offline.zip (and the unzipped folder beside it). See docs/OFFLINE.md.

import { execFileSync } from 'node:child_process';
import { chmodSync, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const share = resolve(root, 'share');
const folder = resolve(share, 'PalestineLivingMap-offline');
const site = resolve(folder, 'site');
const zip = resolve(share, 'PalestineLivingMap-offline.zip');

rmSync(folder, { recursive: true, force: true });
rmSync(zip, { force: true });
mkdirSync(folder, { recursive: true });

// The offline mode drops the online basemap and the web-font link; see vite.config.ts.
execFileSync('npx', ['vite', 'build', '--mode', 'offline', '--outDir', 'share/PalestineLivingMap-offline/site', '--emptyOutDir'], { cwd: root, stdio: 'inherit', shell: true });

// The local copy of the basemap (npm run fetch:basemap-tiles): roads, borders, lakes and modern names without internet.
const basemap = resolve(root, 'offline-assets/basemap');
if (existsSync(resolve(basemap, 'style.json')) && existsSync(resolve(basemap, 'tiles'))) {
  cpSync(basemap, resolve(site, 'basemap'), { recursive: true });
} else {
  console.warn('offline-assets/basemap is missing; run npm run fetch:basemap-tiles first. The package will draw the land from elevation only.');
}

for (const name of ['serve.ps1', 'open-map.bat', 'open-map.command', 'README.txt']) {
  cpSync(resolve(root, 'scripts/offline', name), resolve(folder, name));
}
try {
  chmodSync(resolve(folder, 'open-map.command'), 0o755);
} catch {
  // Not supported on every file system; Mac users can still right-click, Open.
}

if (process.platform === 'win32') {
  execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${folder}' -DestinationPath '${zip}' -Force`], { stdio: 'inherit' });
} else {
  execFileSync('zip', ['-r', '-q', zip, 'PalestineLivingMap-offline'], { cwd: share, stdio: 'inherit' });
}
console.log(existsSync(zip) ? `\nWrote ${zip}` : '\nThe zip could not be made; the folder is ready to zip by hand.');

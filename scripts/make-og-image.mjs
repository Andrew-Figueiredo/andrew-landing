import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const template = path.join(here, 'og-template.html');
const output = path.join(here, '..', 'public', 'og-image.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`file://${template}`);
// Sem isto a captura pode sair com a fonte de fallback.
await page.waitForLoadState('networkidle');
await page.screenshot({ path: output });
await browser.close();

console.log(`OG image gerada em ${output}`);

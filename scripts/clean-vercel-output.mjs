import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const generatedOutput = new URL('../.vercel/output/', import.meta.url);
const generatedPath = fileURLToPath(generatedOutput);

if (!generatedPath.replaceAll('\\', '/').endsWith('/.vercel/output/')) {
  throw new Error(`Refusing to clean an unexpected path: ${generatedPath}`);
}

rmSync(generatedOutput, { recursive: true, force: true });

import { build } from 'esbuild';
import { glob } from 'glob';

const functionFiles = await glob('functions/**/*.ts');

await build({
  entryPoints: functionFiles,
  bundle: true,
  format: 'esm',
  platform: 'neutral',  // Cloudflare Workers runtime (not browser or node)
  target: 'esnext',
  outdir: 'dist',
  outbase: '.',
  conditions: ['workerd', 'worker', 'browser'],  // Cloudflare's runtime conditions
});

console.log('✓ Functions compiled to dist/functions/');

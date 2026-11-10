import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('servidor entrega site, saúde e simulação', async () => {
  const child = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, HOST: '127.0.0.1', PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    const url = await new Promise((resolve, reject) => {
      let output = '';
      const timer = setTimeout(() => reject(new Error('Servidor não iniciou em 5 segundos.')), 5000);
      child.stdout.on('data', chunk => {
        output += chunk;
        const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
        if (match) { clearTimeout(timer); resolve(match[0]); }
      });
      child.on('exit', code => { clearTimeout(timer); reject(new Error(`Servidor saiu com código ${code}.`)); });
      child.on('error', error => { clearTimeout(timer); reject(error); });
    });
    const health = await fetch(`${url}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: 'ok' });
    const page = await fetch(url);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Como funciona o PageRank/);
    const result = await fetch(`${url}/api/simulate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pages: [{ id: 'A' }, { id: 'B' }], links: [{ from: 'A', to: 'B' }], damping: .85 }) });
    assert.equal(result.status, 200);
    assert.deepEqual((await result.json()).order, [1, 0]);
  } finally {
    child.kill('SIGTERM');
  }
});

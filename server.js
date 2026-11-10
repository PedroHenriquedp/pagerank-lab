import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { simulate } from './pagerank.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.svg': 'image/svg+xml' };
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT deve ser um número entre 1 e 65535.');

const server = http.createServer(async (req, res) => {
  const send = (status, data, type = 'application/json; charset=utf-8') => {
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data));
  };
  try {
    if (req.method === 'GET' && req.url === '/health') return send(200, { status: 'ok' });
    if (req.method === 'POST' && req.url === '/api/simulate') {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 40000) return send(413, { error: 'A rede enviada é grande demais.' });
      }
      const input = JSON.parse(body);
      return send(200, simulate(input.pages, input.links, input.damping));
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, { error: 'Método não permitido.' });
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const name = pathname === '/' ? 'index.html' : pathname.slice(1);
    const full = path.resolve(root, name);
    if (full !== root && !full.startsWith(root + path.sep)) return send(403, { error: 'Acesso negado.' });
    const data = await readFile(full);
    send(200, req.method === 'HEAD' ? '' : data, types[path.extname(full)] || 'application/octet-stream');
  } catch (error) {
    if (error.code === 'ENOENT') return send(404, { error: 'Página não encontrada.' });
    send(error instanceof SyntaxError || error.message?.includes('página') || error.message?.includes('link') || error.message?.includes('chance') ? 400 : 500, { error: error.message || 'Erro interno.' });
  }
});
server.listen(port, host, () => console.log(`Laboratório PageRank: http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));

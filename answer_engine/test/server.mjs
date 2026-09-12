// Local test server for the answer engine — NOT part of the deployed site
// (the site uses the same createAsker via src/app/api/ask/route.ts).
//   node answer_engine/test/server.mjs   → http://localhost:4321
// Real voices only: this server finds clips; it never generates an answer.
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadEnv } from '../lib.mjs';
import { createAsker } from '../ask.mjs';

loadEnv();
const PORT = 4321;
const asker = createAsker({ instance: 'techcrew', company: 'TECH CREW' });
const html = () => readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'index.html'));

const json = (res, body) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    try {
      if (url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html());
      }
      if (url.pathname === '/api/chips') return json(res, await asker.chips());
      if (url.pathname === '/api/chip') {
        await asker.logChip(url.searchParams.get('unit'), url.searchParams.get('q'));
        return res.writeHead(204).end();
      }
      if (url.pathname === '/api/ask') {
        const q = (url.searchParams.get('q') || '').trim().slice(0, 300);
        if (!q) throw new Error('empty question');
        return json(res, await asker.ask(q));
      }
      res.writeHead(404).end();
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  })
  .listen(PORT, () => console.log(`answer engine test → http://localhost:${PORT}`));

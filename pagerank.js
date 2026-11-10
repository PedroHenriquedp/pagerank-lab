export function validateGraph(pages, links, damping) {
  if (!Array.isArray(pages) || pages.length < 2 || pages.length > 12) throw new Error('Use entre 2 e 12 páginas.');
  if (!Array.isArray(links) || links.length > 120) throw new Error('Há links demais nesta rede.');
  if (typeof damping !== 'number' || !Number.isFinite(damping) || damping < 0 || damping > 1) throw new Error('A chance de seguir links deve ficar entre 0% e 100%.');
  const ids = new Set();
  for (const p of pages) {
    if (!p || typeof p.id !== 'string' || !/^[a-zA-Z0-9_-]{1,24}$/.test(p.id) || ids.has(p.id)) throw new Error('As páginas precisam ter identificadores únicos.');
    ids.add(p.id);
  }
  const pairs = new Set();
  for (const e of links) {
    if (!e || !ids.has(e.from) || !ids.has(e.to) || e.from === e.to) throw new Error('Há um link inválido.');
    const pair = `${e.from}>${e.to}`;
    if (pairs.has(pair)) throw new Error('Há um link repetido.');
    pairs.add(pair);
  }
}

export function simulate(pages, links, damping = 0.85) {
  validateGraph(pages, links, damping);
  const n = pages.length;
  const index = new Map(pages.map((p, i) => [p.id, i]));
  const outgoing = pages.map(() => []);
  for (const e of links) outgoing[index.get(e.from)].push(index.get(e.to));
  let current = Array(n).fill(1 / n);
  const history = [{ scores: current, delta: 0 }];
  for (let round = 1; round <= 100; round++) {
    const next = Array(n).fill((1 - damping) / n);
    for (let i = 0; i < n; i++) {
      if (!outgoing[i].length) {
        for (let j = 0; j < n; j++) next[j] += damping * current[i] / n;
      } else {
        for (const j of outgoing[i]) next[j] += damping * current[i] / outgoing[i].length;
      }
    }
    const delta = next.reduce((sum, v, i) => sum + Math.abs(v - current[i]), 0);
    history.push({ scores: next, delta });
    current = next;
    if (delta < 1e-10) break;
  }
  return { history, order: [...pages.keys()].sort((a, b) => current[b] - current[a]), converged: history.at(-1).delta < 1e-10 };
}

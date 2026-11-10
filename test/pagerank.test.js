import test from 'node:test';
import assert from 'node:assert/strict';
import { simulate } from '../pagerank.js';

const pages = ['A', 'B', 'C', 'D'].map(id => ({ id }));
const links = [['A','B'],['A','C'],['B','C'],['C','A'],['D','C']].map(([from,to]) => ({ from, to }));

test('a rede dos slides converge na ordem esperada e preserva a soma', () => {
  const result = simulate(pages, links);
  assert.deepEqual(result.order.map(i => pages[i].id), ['C','A','B','D']);
  assert.ok(result.converged);
  for (const round of result.history) assert.ok(Math.abs(round.scores.reduce((a,b) => a+b,0)-1)<1e-12);
});

test('página sem saída redistribui sua importância sem perdê-la', () => {
  const result = simulate(pages, links.filter(e => e.from !== 'D'));
  assert.ok(result.converged);
  assert.ok(result.history.at(-1).scores.every(v => v > 0));
  assert.ok(Math.abs(result.history.at(-1).scores.reduce((a,b) => a+b,0)-1)<1e-12);
});

test('rejeita links repetidos e páginas duplicadas', () => {
  assert.throws(() => simulate(pages, [...links, links[0]]));
  assert.throws(() => simulate([...pages, pages[0]], links));
});

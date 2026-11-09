// Exercício 1: explora a API. Rode com: node exercicio1.mjs
const B = 'http://localhost:3001';
const H = { 'Content-Type': 'application/json' };
const mostrar = async (nome, r) => {
  const t = await r.text();
  console.log(`${nome}\n   -> ${r.status} ${t}`);
};

const g = await (await fetch(B + '/genres', { method: 'POST', headers: H, body: JSON.stringify({ name: 'Ficção' }) })).json();
const l = await (await fetch(B + '/books', { method: 'POST', headers: H, body: JSON.stringify({ title: 'Livro teste', author: 'Autor', genreId: g.id }) })).json();
console.log('criados:', g, l, '\n');

const post = (p, b, h = H) => fetch(B + p, { method: 'POST', headers: h, body: b === undefined ? undefined : JSON.stringify(b) });
await mostrar('POST /genres sem name', await post('/genres', {}));
await mostrar('POST /books sem title', await post('/books', { author: 'x' }));
await mostrar('POST /books sem author', await post('/books', { title: 'x' }));
await mostrar('POST /books pages -5', await post('/books', { title: 'x', author: 'y', pages: -5 }));
await mostrar('POST /books genreId 999', await post('/books', { title: 'x', author: 'y', genreId: 999 }));
await mostrar('GET /books/abc', await fetch(B + '/books/abc'));
await mostrar('DELETE /books/' + l.id + ' (1ª)', await fetch(`${B}/books/${l.id}`, { method: 'DELETE' }));
await mostrar('DELETE /books/' + l.id + ' (2ª)', await fetch(`${B}/books/${l.id}`, { method: 'DELETE' }));
await mostrar('POST /books sem Content-Type', await fetch(B + '/books', { method: 'POST', body: JSON.stringify({ title: 'x', author: 'y' }) }));
await fetch(`${B}/genres/${g.id}`, { method: 'DELETE' });

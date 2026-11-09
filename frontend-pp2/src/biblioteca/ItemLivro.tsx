import { useState } from 'react';
import type { AtualizaLivro, Book, Genre } from './types';

interface Props {
  livro: Book;
  generos: Genre[];
  onAtualizar: (id: number, dados: AtualizaLivro) => Promise<boolean>;
  onRemover: (id: number) => Promise<boolean>;
}

export default function ItemLivro({ livro, generos, onAtualizar, onRemover }: Props) {
  const [editando, setEditando] = useState(false);
  const [title, setTitle] = useState(livro.title);
  const [author, setAuthor] = useState(livro.author);
  const [pages, setPages] = useState(livro.pages === null ? '' : String(livro.pages));
  const [genreId, setGenreId] = useState(livro.genreId === null ? '' : String(livro.genreId));

  async function salvar() {
    const ok = await onAtualizar(livro.id, {
      title,
      author,
      pages: pages === '' ? null : Number(pages),
      genreId: genreId === '' ? null : Number(genreId),
    });
    if (ok) setEditando(false);
  }

  function cancelar() {
    setTitle(livro.title);
    setAuthor(livro.author);
    setPages(livro.pages === null ? '' : String(livro.pages));
    setGenreId(livro.genreId === null ? '' : String(livro.genreId));
    setEditando(false);
  }

  async function remover() {
    if (!window.confirm(`Remover "${livro.title}"?`)) return;
    await onRemover(livro.id);
  }

  if (editando) {
    return (
      <li className="card card--edit">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
        <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Autor" />
        <input
          className="input"
          type="number"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          placeholder="Páginas"
        />
        <select className="select" value={genreId} onChange={(e) => setGenreId(e.target.value)}>
          <option value="">Sem gênero</option>
          {generos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn--primary" onClick={salvar}>
          Salvar
        </button>
        <button type="button" className="btn btn--ghost" onClick={cancelar}>
          Cancelar
        </button>
      </li>
    );
  }

  return (
    <li className={`card${livro.read ? ' card--read' : ''}`}>
      <div className="book">
        <input
          className="book__check"
          type="checkbox"
          checked={livro.read}
          aria-label={`Marcar ${livro.title} como lido`}
          onChange={() => onAtualizar(livro.id, { read: !livro.read })}
        />
        <div className="book__body">
          <p className="book__title">{livro.title}</p>
          <p className="book__meta">{livro.author}</p>
          <div className="book__tags">
            {livro.pages !== null && <span className="tag">{livro.pages} págs.</span>}
            {livro.genre && <span className="tag">{livro.genre.name}</span>}
            {livro.read && <span className="tag">Lido</span>}
          </div>
        </div>
        <div className="book__actions">
          <button type="button" className="btn btn--secondary" onClick={() => setEditando(true)}>
            Editar
          </button>
          <button type="button" className="btn btn--danger" onClick={remover}>
            Remover
          </button>
        </div>
      </div>
    </li>
  );
}

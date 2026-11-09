import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Genre, NovoLivro } from './types';

interface Props {
  generos: Genre[];
  onCriar: (dados: NovoLivro) => Promise<void>;
}

export default function FormLivro({ generos, onCriar }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [genreId, setGenreId] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    const dados: NovoLivro = { title, author };
    if (pages !== '') dados.pages = Number(pages);
    if (genreId !== '') dados.genreId = Number(genreId);

    try {
      await onCriar(dados);
      setTitle('');
      setAuthor('');
      setPages('');
      setGenreId('');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="form-stack">
      <h2 className="section-title">Novo livro</h2>
      <div className="form-grid">
        <input
          className="input"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={enviando}
        />
        <input
          className="input"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={enviando}
        />
        <input
          className="input"
          type="number"
          placeholder="Páginas"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          disabled={enviando}
        />
        <select
          className="select"
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
          disabled={enviando}
        >
          <option value="">Sem gênero</option>
          {generos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn--primary btn--block" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Adicionar livro'}
      </button>
      {erro && <p className="alert alert--error">{erro}</p>}
    </form>
  );
}

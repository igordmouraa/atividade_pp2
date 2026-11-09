import { useEffect, useState } from 'react';
import type { Book } from './types';

// Exercício 4: fetch escrito direto no componente (sem api.ts).
export default function ListaLivros() {
  const [livros, setLivros] = useState<Book[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await fetch('http://localhost:3001/books');
        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
        setLivros(await resposta.json());
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro desconhecido');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) return <p className="state state--loading">Carregando</p>;
  if (erro) return <p className="alert alert--error">Erro: {erro}</p>;
  if (livros.length === 0) return <p className="empty">Nenhum livro.</p>;

  return (
    <ul className="list">
      {livros.map((livro) => (
        <li key={livro.id} className={`card${livro.read ? ' card--read' : ''}`}>
          <div className="book">
            <span className="book__check" aria-hidden>
              {livro.read ? '✓' : '○'}
            </span>
            <div className="book__body">
              <p className="book__title">{livro.title}</p>
              <p className="book__meta">{livro.author}</p>
              {livro.genre && (
                <div className="book__tags">
                  <span className="tag">{livro.genre.name}</span>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

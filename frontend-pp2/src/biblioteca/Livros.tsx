import { useEffect, useState } from 'react';
import type { AtualizaLivro, Book, Genre, NovoLivro } from './types';
import {
  atualizarLivro,
  criarLivro,
  listarGeneros,
  listarLivros,
  removerLivro,
} from './api';
import FormLivro from './FormLivro';
import ItemLivro from './ItemLivro';

type Ordem = 'id' | 'title' | 'author' | 'pages';

export default function Livros() {
  const [livros, setLivros] = useState<Book[]>([]);
  const [generos, setGeneros] = useState<Genre[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const [filtroGenero, setFiltroGenero] = useState('');
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState<Ordem>('id');

  useEffect(() => {
    async function carregar() {
      try {
        const [l, g] = await Promise.all([listarLivros(), listarGeneros()]);
        setLivros(l);
        setGeneros(g);
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro desconhecido');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function comGenero(livro: Book): Book {
    const genre = generos.find((g) => g.id === livro.genreId) ?? null;
    return { ...livro, genre };
  }

  async function executar(acao: () => Promise<void>): Promise<boolean> {
    setErro(null);
    try {
      await acao();
      return true;
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro desconhecido');
      return false;
    }
  }

  function mostrarAviso(texto: string) {
    setAviso(texto);
    setTimeout(() => setAviso(null), 3000);
  }

  function criar(dados: NovoLivro) {
    return criarLivro(dados).then((novo) => {
      setLivros((atual) => [...atual, comGenero(novo)]);
    });
  }

  function atualizar(id: number, dados: AtualizaLivro) {
    return executar(async () => {
      const atualizado = await atualizarLivro(id, dados);
      setLivros((atual) => atual.map((l) => (l.id === id ? comGenero(atualizado) : l)));
    });
  }

  function remover(id: number) {
    return executar(async () => {
      await removerLivro(id);
      setLivros((atual) => atual.filter((l) => l.id !== id));
      mostrarAviso('Livro removido');
    });
  }

  if (carregando) {
    return <p className="state state--loading">Carregando</p>;
  }

  const termo = busca.trim().toLowerCase();
  const visiveis = livros
    .filter((l) => filtroGenero === '' || l.genreId === Number(filtroGenero))
    .filter((l) => termo === '' || l.title.toLowerCase().includes(termo));

  const ordenados = [...visiveis].sort((a, b) => {
    if (ordem === 'title') return a.title.localeCompare(b.title);
    if (ordem === 'author') return a.author.localeCompare(b.author);
    if (ordem === 'pages') return (a.pages ?? 0) - (b.pages ?? 0);
    return a.id - b.id;
  });

  const lidos = livros.filter((l) => l.read).length;
  const percentual = livros.length === 0 ? 0 : Math.round((lidos / livros.length) * 100);

  return (
    <section>
      <FormLivro generos={generos} onCriar={criar} />

      {erro && <p className="alert alert--error">Erro: {erro}</p>}
      {aviso && <p className="alert alert--success">{aviso}</p>}

      <div className="toolbar">
        <select
          className="select"
          value={filtroGenero}
          onChange={(e) => setFiltroGenero(e.target.value)}
          aria-label="Filtrar por gênero"
        >
          <option value="">Todos os gêneros</option>
          {generos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder="Buscar por título"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className="select"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value as Ordem)}
          aria-label="Ordenar"
        >
          <option value="id">Ordem de cadastro</option>
          <option value="title">Título</option>
          <option value="author">Autor</option>
          <option value="pages">Páginas</option>
        </select>
      </div>

      <div className="stats">
        <p className="stats__label">
          {lidos} lidos de {livros.length}
        </p>
        <div className="progress" role="progressbar" aria-valuenow={percentual} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress__bar" style={{ width: `${percentual}%` }} />
        </div>
        <p className="count">
          {visiveis.length} de {livros.length} livros
        </p>
      </div>

      {livros.length === 0 ? (
        <p className="empty">Nenhum livro na estante.</p>
      ) : ordenados.length === 0 ? (
        <p className="empty">Nenhum livro encontrado.</p>
      ) : (
        <ul className="list">
          {ordenados.map((livro) => (
            <ItemLivro
              key={livro.id}
              livro={livro}
              generos={generos}
              onAtualizar={atualizar}
              onRemover={remover}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

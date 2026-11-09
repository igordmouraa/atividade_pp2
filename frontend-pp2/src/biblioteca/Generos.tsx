import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Genre } from './types';
import { atualizarGenero, criarGenero, listarGeneros, removerGenero } from './api';
import ItemGenero from './ItemGenero';

export default function Generos() {
  const [generos, setGeneros] = useState<Genre[]>([]);
  const [nome, setNome] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setGeneros(await listarGeneros());
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro desconhecido');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

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

  async function criar(e: FormEvent) {
    e.preventDefault();
    const ok = await executar(async () => {
      const novo = await criarGenero(nome);
      setGeneros((atual) => [...atual, novo]);
    });
    if (ok) setNome('');
  }

  const renomear = (id: number, name: string) =>
    executar(async () => {
      const atualizado = await atualizarGenero(id, name);
      setGeneros((atual) => atual.map((g) => (g.id === id ? atualizado : g)));
    });

  const remover = (id: number) =>
    executar(async () => {
      await removerGenero(id);
      setGeneros((atual) => atual.filter((g) => g.id !== id));
    });

  if (carregando) {
    return <p className="state state--loading">Carregando</p>;
  }

  return (
    <section>
      <h2 className="section-title">Novo gênero</h2>
      <form onSubmit={criar} className="form-row form-row--inline">
        <input
          className="input"
          placeholder="Nome do gênero"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button type="submit" className="btn btn--primary">
          Adicionar
        </button>
      </form>

      {erro && <p className="alert alert--error">Erro: {erro}</p>}

      {generos.length === 0 ? (
        <p className="empty">Nenhum gênero cadastrado.</p>
      ) : (
        <ul className="list">
          {generos.map((g) => (
            <ItemGenero key={g.id} genero={g} onRenomear={renomear} onRemover={remover} />
          ))}
        </ul>
      )}
    </section>
  );
}

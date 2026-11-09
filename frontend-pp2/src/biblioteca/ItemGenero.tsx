import { useState } from 'react';
import type { Genre } from './types';

interface Props {
  genero: Genre;
  onRenomear: (id: number, name: string) => Promise<boolean>;
  onRemover: (id: number) => Promise<boolean>;
}

export default function ItemGenero({ genero, onRenomear, onRemover }: Props) {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(genero.name);

  async function salvar() {
    if (await onRenomear(genero.id, nome)) setEditando(false);
  }

  function cancelar() {
    setNome(genero.name);
    setEditando(false);
  }

  if (editando) {
    return (
      <li className="card card--edit">
        <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} />
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
    <li className="card genre-item">
      <span className="genre-item__name">{genero.name}</span>
      <div className="genre-item__actions">
        <button type="button" className="btn btn--secondary" onClick={() => setEditando(true)}>
          Renomear
        </button>
        <button type="button" className="btn btn--danger" onClick={() => onRemover(genero.id)}>
          Remover
        </button>
      </div>
    </li>
  );
}

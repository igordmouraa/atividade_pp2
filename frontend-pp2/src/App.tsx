import { useState } from 'react';
import Livros from './biblioteca/Livros';
import Generos from './biblioteca/Generos';

type Aba = 'livros' | 'generos';

export default function App() {
  const [aba, setAba] = useState<Aba>('livros');

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Biblioteca</h1>
        <p className="app__subtitle">Livros, gêneros e progresso de leitura</p>
      </header>

      <nav className="tabs" aria-label="Seções">
        <button
          type="button"
          className={`tabs__btn${aba === 'livros' ? ' tabs__btn--active' : ''}`}
          onClick={() => setAba('livros')}
          aria-current={aba === 'livros' ? 'page' : undefined}
        >
          Livros
        </button>
        <button
          type="button"
          className={`tabs__btn${aba === 'generos' ? ' tabs__btn--active' : ''}`}
          onClick={() => setAba('generos')}
          aria-current={aba === 'generos' ? 'page' : undefined}
        >
          Gêneros
        </button>
      </nav>

      {/* Ao trocar de aba o componente desmonta e remonta: os dados são buscados de novo. */}
      <div className="panel">{aba === 'livros' ? <Livros /> : <Generos />}</div>
    </div>
  );
}

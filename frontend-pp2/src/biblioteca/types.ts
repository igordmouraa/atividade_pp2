export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number | null;
  read: boolean;
  createdAt: string;
  genreId: number | null;
  genre?: Genre | null; // só vem no GET
}

export interface NovoLivro {
  title: string;
  author: string;
  pages?: number;
  genreId?: number;
}

export interface AtualizaLivro {
  title?: string;
  author?: string;
  pages?: number | null;
  read?: boolean;
  genreId?: number | null;
}

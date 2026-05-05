export interface Article {
  _id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiListResponse {
  status: string;
  articles: Article[];
}

export interface ApiSingleResponse {
  status: string;
  article: Article;
  message?: string;
}

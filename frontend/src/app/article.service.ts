import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiListResponse, ApiSingleResponse } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  getArticles(): Observable<ApiListResponse> {
    return this.http.get<ApiListResponse>(`${this.baseUrl}/articles`);
  }

  createArticle(payload: object): Observable<ApiSingleResponse> {
    return this.http.post<ApiSingleResponse>(`${this.baseUrl}/createArticle`, payload);
  }

  updateArticle(id: string, payload: object): Observable<ApiSingleResponse> {
    return this.http.put<ApiSingleResponse>(`${this.baseUrl}/article/${id}`, payload);
  }

  uploadImage(id: string, imageFile: File): Observable<ApiSingleResponse> {
    const formData = new FormData();
    formData.append('imagen', imageFile);
    return this.http.post<ApiSingleResponse>(`${this.baseUrl}/upload-image/${id}`, formData);
  }

  deleteArticle(id: string): Observable<ApiSingleResponse> {
    return this.http.delete<ApiSingleResponse>(`${this.baseUrl}/article/${id}`);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Article } from './article.model';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  articles: Article[] = [];
  loading = false;
  editingId: string | null = null;
  errorMessage = '';
  successMessage = '';
  readonly articleForm;
  selectedImage: File | null = null;

  readonly categories = ['tecnologia', 'ropa', 'otros'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly articleService: ArticleService
  ) {
    this.articleForm = this.fb.nonNullable.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['tecnologia', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.loading = true;
    this.errorMessage = '';

    this.articleService.getArticles().subscribe({
      next: (response) => {
        this.articles = response.articles;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.articles = [];
        this.loading = false;

        if (error.status === 404) {
          return;
        }

        this.errorMessage = error.error?.message ?? 'No se pudieron cargar los articulos.';
      }
    });
  }

  submitForm(): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }

    this.clearMessages();
    const formValue = this.articleForm.getRawValue();
    const payload = {
      titulo: formValue.titulo.trim(),
      descripcion: formValue.descripcion.trim(),
      // El backend usa validator.isEmpty(), que espera strings.
      precio: String(formValue.precio),
      categoria: formValue.categoria
    };

    if (this.editingId) {
      this.articleService.updateArticle(this.editingId, payload).subscribe({
        next: (response) => {
          if (this.selectedImage) {
            this.uploadImage(response.article._id, 'actualizado');
            return;
          }
          this.successMessage = 'Articulo actualizado correctamente.';
          this.resetForm();
          this.fetchArticles();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message ?? 'No se pudo actualizar el articulo.';
        }
      });
      return;
    }

    this.articleService.createArticle(payload).subscribe({
      next: (response) => {
        if (this.selectedImage) {
          this.uploadImage(response.article._id, 'creado');
          return;
        }
        this.successMessage = 'Articulo creado correctamente.';
        this.resetForm();
        this.fetchArticles();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'No se pudo crear el articulo.';
      }
    });
  }

  startEdit(article: Article): void {
    this.editingId = article._id;
    this.clearMessages();

    this.articleForm.patchValue({
      titulo: article.titulo,
      descripcion: article.descripcion,
      precio: article.precio,
      categoria: article.categoria
    });
  }

  deleteArticle(id: string): void {
    this.clearMessages();

    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        this.successMessage = 'Articulo eliminado correctamente.';
        if (this.editingId === id) {
          this.resetForm();
        }
        this.fetchArticles();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'No se pudo eliminar el articulo.';
      }
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedImage = file;
  }

  getImageUrl(imageName?: string | null): string {
    if (!imageName) {
      return '';
    }
    return `/uploads/${imageName}`;
  }

  private uploadImage(articleId: string, action: 'creado' | 'actualizado'): void {
    if (!this.selectedImage) {
      return;
    }

    this.articleService
      .uploadImage(articleId, this.selectedImage)
      .subscribe({
        next: () => {
          this.successMessage = `Articulo ${action} y la imagen fue subida correctamente.`;
          this.resetForm();
          this.fetchArticles();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message ?? 'Se guardo el articulo, pero fallo la subida de imagen.';
          this.fetchArticles();
        }
      });
  }

  private resetForm(): void {
    this.editingId = null;
    this.selectedImage = null;
    this.articleForm.reset({
      titulo: '',
      descripcion: '',
      precio: 0,
      categoria: 'tecnologia'
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}

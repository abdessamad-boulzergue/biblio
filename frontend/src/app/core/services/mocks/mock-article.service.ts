import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockArticleService {
  private mockArticles = [
    { id: 1, title: 'Mock Article 1', content: 'Content 1', categoryId: 1, price: 10.99, imageUrl: 'assets/mock1.jpg' },
    { id: 2, title: 'Mock Article 2', content: 'Content 2', categoryId: 2, price: 15.50, imageUrl: 'assets/mock2.jpg' },
    { id: 3, title: 'Mock Article 3', content: 'Content 3', categoryId: 1, price: 8.00, imageUrl: 'assets/mock3.jpg' }
  ];

  constructor() { }

  getAll(page: number = 0, size: number = 20, keyword?: string, categoryId?: number | null, sort: string = 'id,desc'): Observable<any> {
    console.log('MockArticleService: getAll', { page, size, keyword, categoryId, sort });
    let filtered = this.mockArticles;
    
    if (keyword) {
      filtered = filtered.filter(a => a.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    if (categoryId) {
      filtered = filtered.filter(a => a.categoryId === categoryId);
    }
    
    return of({
      content: filtered,
      totalElements: filtered.length,
      totalPages: 1,
      number: page,
      size: size
    }).pipe(delay(500));
  }

  search(query: string, page: number = 0, size: number = 20): Observable<any> {
    return this.getAll(page, size, query);
  }

  getByCategory(categoryId: number, page: number = 0, size: number = 20): Observable<any> {
    return this.getAll(page, size, undefined, categoryId);
  }

  getById(id: number): Observable<any> {
    const article = this.mockArticles.find(a => a.id == id);
    return of(article).pipe(delay(500));
  }

  create(data: any): Observable<any> {
    const newArticle = { ...data, id: Date.now() };
    this.mockArticles.push(newArticle);
    return of(newArticle).pipe(delay(500));
  }

  update(id: number, data: any): Observable<any> {
    const index = this.mockArticles.findIndex(a => a.id == id);
    if (index !== -1) {
      this.mockArticles[index] = { ...this.mockArticles[index], ...data };
      return of(this.mockArticles[index]).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }

  delete(id: number): Observable<any> {
    this.mockArticles = this.mockArticles.filter(a => a.id != id);
    return of({ success: true }).pipe(delay(500));
  }
}

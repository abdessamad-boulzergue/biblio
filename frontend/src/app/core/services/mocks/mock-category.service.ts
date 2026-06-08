import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockCategoryService {
  private mockCategories = [
    { id: 1, name: 'Fiction', parentId: null },
    { id: 2, name: 'Science Fiction', parentId: 1 },
    { id: 3, name: 'Non-Fiction', parentId: null }
  ];

  constructor() { }

  getAll(): Observable<any[]> {
    console.log('MockCategoryService: getAll');
    return of(this.mockCategories).pipe(delay(500));
  }

  getTree(): Observable<any[]> {
    // For simplicity, just returning the flat list, or we could build a tree
    return of(this.mockCategories).pipe(delay(500));
  }

  getById(id: number): Observable<any> {
    const category = this.mockCategories.find(c => c.id == id);
    return of(category).pipe(delay(500));
  }

  create(data: any): Observable<any> {
    const newCategory = { ...data, id: Date.now() };
    this.mockCategories.push(newCategory);
    return of(newCategory).pipe(delay(500));
  }

  update(id: number, data: any): Observable<any> {
    const index = this.mockCategories.findIndex(c => c.id == id);
    if (index !== -1) {
      this.mockCategories[index] = { ...this.mockCategories[index], ...data };
      return of(this.mockCategories[index]).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }

  delete(id: number): Observable<any> {
    this.mockCategories = this.mockCategories.filter(c => c.id != id);
    return of({ success: true }).pipe(delay(500));
  }
}

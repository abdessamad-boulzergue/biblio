import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/v1/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${API_URL}/${id}/status?status=${status}`, {});
  }

  createOrder(orderRequest: any): Observable<any> {
    return this.http.post<any>(API_URL, orderRequest);
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/my-orders`);
  }

  requestReturn(id: number): Observable<any> {
    return this.http.post<any>(`${API_URL}/${id}/return`, {});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/v1/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createPaymentIntent(orderId: number): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/v1/cmi/generate-request/${orderId}`, {});
  }
}

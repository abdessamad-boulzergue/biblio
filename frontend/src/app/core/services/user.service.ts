import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/v1/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }

  updateStatus(id: number, enabled: boolean): Observable<any> {
    return this.http.put(`${API_URL}/${id}/status?enabled=${enabled}`, {});
  }

  updateRole(id: number, role: string): Observable<any> {
    return this.http.put(`${API_URL}/${id}/role?role=${role}`, {});
  }
}

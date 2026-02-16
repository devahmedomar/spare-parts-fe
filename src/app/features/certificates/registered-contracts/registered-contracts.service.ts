import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegisteredContract } from './registered-contract.model';

@Injectable({ providedIn: 'root' })
export class RegisteredContractsService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/registered-contracts`;

  getAll(): Observable<RegisteredContract[]> { return this.http.get<RegisteredContract[]>(this.api); }
  getById(id: string): Observable<RegisteredContract> { return this.http.get<RegisteredContract>(`${this.api}/${id}`); }
  create(formData: FormData): Observable<RegisteredContract> { return this.http.post<RegisteredContract>(this.api, formData); }
  update(id: string, formData: FormData): Observable<RegisteredContract> { return this.http.put<RegisteredContract>(`${this.api}/${id}`, formData); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}

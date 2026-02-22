import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SparePart } from './spare-part.model';

@Injectable({ providedIn: 'root' })
export class SparePartsService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/spare-parts`;

  getAll(search = ''): Observable<SparePart[]> {
    const params: Record<string, string> = search ? { search } : {};
    return this.http.get<SparePart[]>(this.api, { params, responseType: 'json' });
  }

  getShortages(): Observable<SparePart[]> {
    return this.http.get<SparePart[]>(`${this.api}?shortages=true`);
  }

  getById(id: string): Observable<SparePart> {
    return this.http.get<SparePart>(`${this.api}/${id}`);
  }

  create(data: { name: string; quantity: number; price: number }): Observable<SparePart> {
    return this.http.post<SparePart>(this.api, data);
  }

  update(
    id: string,
    data: { name: string; quantity: number; price: number },
  ): Observable<SparePart> {
    return this.http.put<SparePart>(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}

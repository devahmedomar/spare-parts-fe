import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sale } from './sale.model';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/sales`;

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.api);
  }

  create(data: { sparePartId: string; quantitySold: number }): Observable<Sale> {
    return this.http.post<Sale>(this.api, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}

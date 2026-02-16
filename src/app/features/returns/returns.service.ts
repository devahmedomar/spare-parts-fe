import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Return } from './return.model';

@Injectable({ providedIn: 'root' })
export class ReturnsService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/returns`;

  getAll(): Observable<Return[]> {
    return this.http.get<Return[]>(this.api);
  }

  create(data: { sparePartId: string; quantityReturned: number; reason?: string }): Observable<Return> {
    return this.http.post<Return>(this.api, data);
  }
}

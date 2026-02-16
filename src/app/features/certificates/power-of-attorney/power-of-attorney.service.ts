import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PowerOfAttorney } from './power-of-attorney.model';

@Injectable({ providedIn: 'root' })
export class PowerOfAttorneyService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/general-power-of-attorneys`;

  getAll(): Observable<PowerOfAttorney[]> { return this.http.get<PowerOfAttorney[]>(this.api); }
  getById(id: string): Observable<PowerOfAttorney> { return this.http.get<PowerOfAttorney>(`${this.api}/${id}`); }
  create(formData: FormData): Observable<PowerOfAttorney> { return this.http.post<PowerOfAttorney>(this.api, formData); }
  update(id: string, formData: FormData): Observable<PowerOfAttorney> { return this.http.put<PowerOfAttorney>(`${this.api}/${id}`, formData); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}

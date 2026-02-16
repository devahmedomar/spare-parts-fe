import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MotorCertificate } from './motor-certificate.model';

@Injectable({ providedIn: 'root' })
export class MotorCertificatesService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/motor-certificates`;

  getAll(): Observable<MotorCertificate[]> {
    return this.http.get<MotorCertificate[]>(this.api);
  }

  getById(id: string): Observable<MotorCertificate> {
    return this.http.get<MotorCertificate>(`${this.api}/${id}`);
  }

  create(formData: FormData): Observable<MotorCertificate> {
    return this.http.post<MotorCertificate>(this.api, formData);
  }

  update(id: string, formData: FormData): Observable<MotorCertificate> {
    return this.http.put<MotorCertificate>(`${this.api}/${id}`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}

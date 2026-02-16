import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardSummary {
  spareParts: number;
  sales: number;
  returns: number;
  motorCerts: number;
  powerOfAttorneys: number;
  contracts: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getSummary() {
    return forkJoin({
      spareParts: this.http.get<unknown[]>(`${this.api}/spare-parts`),
      sales: this.http.get<unknown[]>(`${this.api}/sales`),
      returns: this.http.get<unknown[]>(`${this.api}/returns`),
      motorCerts: this.http.get<unknown[]>(`${this.api}/motor-certificates`),
      powerOfAttorneys: this.http.get<unknown[]>(`${this.api}/general-power-of-attorneys`),
      contracts: this.http.get<unknown[]>(`${this.api}/registered-contracts`),
    }).pipe(
      map(data => ({
        spareParts: data.spareParts.length,
        sales: data.sales.length,
        returns: data.returns.length,
        motorCerts: data.motorCerts.length,
        powerOfAttorneys: data.powerOfAttorneys.length,
        contracts: data.contracts.length,
      }))
    );
  }
}

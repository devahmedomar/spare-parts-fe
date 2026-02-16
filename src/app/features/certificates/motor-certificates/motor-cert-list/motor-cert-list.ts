import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MotorCertificatesService } from '../motor-certificates.service';
import { MotorCertificate } from '../motor-certificate.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-motor-cert-list',
  imports: [DatePipe, PageHeaderComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './motor-cert-list.html',
})
export class MotorCertListComponent implements OnInit {
  private service = inject(MotorCertificatesService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  certs = signal<MotorCertificate[]>([]);
  loading = signal(true);
  deleteTarget = signal<MotorCertificate | null>(null);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: certs => { this.certs.set(certs); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  goToNew(): void { this.router.navigate(['/certificates/motor/new']); }
  goToEdit(id: string): void { this.router.navigate(['/certificates/motor', id, 'edit']); }
  confirmDelete(cert: MotorCertificate): void { this.deleteTarget.set(cert); }
  cancelDelete(): void { this.deleteTarget.set(null); }

  doDelete(): void {
    const cert = this.deleteTarget();
    if (!cert) return;
    this.deleteTarget.set(null);
    this.service.delete(cert._id).subscribe({
      next: () => {
        this.certs.update(list => list.filter(c => c._id !== cert._id));
        this.notification.show('تم حذف الشهادة بنجاح', 'success');
      },
    });
  }

  openImage(url: string): void { window.open(url, '_blank'); }
}

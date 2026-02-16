import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PowerOfAttorneyService } from '../power-of-attorney.service';
import { PowerOfAttorney } from '../power-of-attorney.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-poa-list',
  imports: [DatePipe, PageHeaderComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './poa-list.html',
})
export class PoaListComponent implements OnInit {
  private service = inject(PowerOfAttorneyService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  items = signal<PowerOfAttorney[]>([]);
  loading = signal(true);
  deleteTarget = signal<PowerOfAttorney | null>(null);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: items => { this.items.set(items); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  goToNew(): void { this.router.navigate(['/certificates/power-of-attorney/new']); }
  goToEdit(id: string): void { this.router.navigate(['/certificates/power-of-attorney', id, 'edit']); }
  confirmDelete(item: PowerOfAttorney): void { this.deleteTarget.set(item); }
  cancelDelete(): void { this.deleteTarget.set(null); }

  doDelete(): void {
    const item = this.deleteTarget();
    if (!item) return;
    this.deleteTarget.set(null);
    this.service.delete(item._id).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i._id !== item._id));
        this.notification.show('تم حذف التوكيل بنجاح', 'success');
      },
    });
  }

  openImage(url: string): void { window.open(url, '_blank'); }
}

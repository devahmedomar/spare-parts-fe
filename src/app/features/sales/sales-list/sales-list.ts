import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { SalesService } from '../sales.service';
import { Sale } from '../sale.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-sales-list',
  imports: [DecimalPipe, DatePipe, PageHeaderComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './sales-list.html',
})
export class SalesListComponent implements OnInit {
  private service = inject(SalesService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  sales = signal<Sale[]>([]);
  loading = signal(true);
  deleteTarget = signal<Sale | null>(null);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: sales => { this.sales.set(sales); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  goToNew(): void { this.router.navigate(['/sales/new']); }
  confirmDelete(sale: Sale): void { this.deleteTarget.set(sale); }
  cancelDelete(): void { this.deleteTarget.set(null); }

  doDelete(): void {
    const sale = this.deleteTarget();
    if (!sale) return;
    this.deleteTarget.set(null);
    this.service.delete(sale._id).subscribe({
      next: () => {
        this.sales.update(list => list.filter(s => s._id !== sale._id));
        this.notification.show('تم حذف عملية البيع وتمت استعادة الكمية', 'success');
      },
    });
  }
}

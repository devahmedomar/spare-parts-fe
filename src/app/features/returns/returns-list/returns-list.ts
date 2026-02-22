import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReturnsService } from '../returns.service';
import { Return } from '../return.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-returns-list',
  imports: [DatePipe, PageHeaderComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './returns-list.html',
})
export class ReturnsListComponent implements OnInit {
  private service = inject(ReturnsService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  returns = signal<Return[]>([]);
  loading = signal(true);
  deleteTarget = signal<Return | null>(null);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: returns => { this.returns.set(returns); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  goToNew(): void { this.router.navigate(['/returns/new']); }
  goToEdit(id: string): void { this.router.navigate(['/returns', id, 'edit']); }
  confirmDelete(ret: Return): void { this.deleteTarget.set(ret); }
  cancelDelete(): void { this.deleteTarget.set(null); }

  doDelete(): void {
    const ret = this.deleteTarget();
    if (!ret) return;
    this.deleteTarget.set(null);
    this.service.delete(ret._id).subscribe({
      next: () => {
        this.returns.update(list => list.filter(r => r._id !== ret._id));
        this.notification.show('تم حذف المرتجع بنجاح', 'success');
      },
    });
  }
}

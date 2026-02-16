import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { SparePartsService } from '../spare-parts.service';
import { SparePart } from '../spare-part.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-spare-parts-list',
  imports: [ReactiveFormsModule, DecimalPipe, PageHeaderComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './spare-parts-list.html',
})
export class SparePartsListComponent implements OnInit, OnDestroy {
  private service = inject(SparePartsService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private destroy$ = new Subject<void>();

  parts = signal<SparePart[]>([]);
  loading = signal(true);
  deleteTarget = signal<SparePart | null>(null);

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading.set(true);
        return this.service.getAll(term || '');
      }),
      takeUntil(this.destroy$),
    ).subscribe(parts => {
      this.parts.set(parts);
      this.loading.set(false);
    });

    this.service.getAll().subscribe({
      next: parts => { this.parts.set(parts); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToNew(): void { this.router.navigate(['/spare-parts/new']); }
  goToEdit(id: string): void { this.router.navigate(['/spare-parts', id, 'edit']); }

  confirmDelete(part: SparePart): void { this.deleteTarget.set(part); }
  cancelDelete(): void { this.deleteTarget.set(null); }

  doDelete(): void {
    const part = this.deleteTarget();
    if (!part) return;
    this.deleteTarget.set(null);
    this.service.delete(part._id).subscribe({
      next: () => {
        this.parts.update(list => list.filter(p => p._id !== part._id));
        this.notification.show('تم حذف القطعة بنجاح', 'success');
      },
    });
  }
}

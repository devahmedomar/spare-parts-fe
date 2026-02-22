import { Component, inject, signal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SalesService } from '../sales.service';
import { SparePartsService } from '../../spare-parts/spare-parts.service';
import { SparePart } from '../../spare-parts/spare-part.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { NotificationService } from '../../../core/services/notification.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-sale-form',
  imports: [ReactiveFormsModule, PageHeaderComponent, DecimalPipe],
  templateUrl: './sale-form.html',
})
export class SaleFormComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private salesService = inject(SalesService);
  private sparePartsService = inject(SparePartsService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  searchResults = signal<SparePart[]>([]);
  selectedPart = signal<SparePart | null>(null);
  showDropdown = signal(false);
  searching = signal(false);
  loading = signal(false);

  form = new FormGroup({
    sparePartId: new FormControl('', [Validators.required]),
    quantitySold: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
  });

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        const q = (query || '').trim();
        this.searching.set(true);
        return this.sparePartsService.getAll(q || undefined);
      }),
      takeUntil(this.destroy$),
    ).subscribe({
      next: results => {
        this.searchResults.set(results);
        this.showDropdown.set(results.length > 0);
        this.searching.set(false);
      },
      error: () => this.searching.set(false),
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  selectPart(part: SparePart): void {
    this.selectedPart.set(part);
    this.form.controls.sparePartId.setValue(part._id);
    this.searchControl.setValue(part.name, { emitEvent: false });
    this.showDropdown.set(false);
    this.searchResults.set([]);
  }

  clearPart(): void {
    this.selectedPart.set(null);
    this.form.controls.sparePartId.setValue('');
    this.searchControl.setValue('', { emitEvent: false });
    this.showDropdown.set(false);
    setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
  }

  onSearchFocus(): void {
    if (this.searchResults().length > 0) {
      this.showDropdown.set(true);
    } else {
      // First focus — load all products immediately without waiting for typing
      this.searching.set(true);
      this.sparePartsService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
        next: results => {
          this.searchResults.set(results);
          this.showDropdown.set(results.length > 0);
          this.searching.set(false);
        },
        error: () => this.searching.set(false),
      });
    }
  }

  onSearchBlur(): void {
    setTimeout(() => this.showDropdown.set(false), 200);
  }

  get expectedTotal(): number {
    const part = this.selectedPart();
    const qty = this.form.value.quantitySold;
    if (!part || !qty || qty <= 0) return 0;
    return part.price * qty;
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    this.salesService.create({
      sparePartId: this.form.value.sparePartId!,
      quantitySold: this.form.value.quantitySold!,
    }).pipe(
      switchMap(() => this.sparePartsService.getAll()),
    ).subscribe({
      next: () => {
        this.notification.show('تم تسجيل عملية البيع بنجاح', 'success');
        this.router.navigate(['/sales']);
      },
      error: () => this.loading.set(false),
    });
  }

  goBack(): void { this.router.navigate(['/sales']); }
}

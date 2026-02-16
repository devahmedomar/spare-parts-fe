import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
export class SaleFormComponent implements OnInit {
  private salesService = inject(SalesService);
  private sparePartsService = inject(SparePartsService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  parts = signal<SparePart[]>([]);
  loading = signal(false);
  loadingParts = signal(true);

  form = new FormGroup({
    sparePartId: new FormControl('', [Validators.required]),
    quantitySold: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
  });

  get selectedPart(): SparePart | undefined {
    return this.parts().find((p) => p._id === this.form.value.sparePartId);
  }

  ngOnInit(): void {
    this.sparePartsService.getAll().subscribe({
      next: (parts) => {
        this.parts.set(parts);
        this.loadingParts.set(false);
      },
      error: () => this.loadingParts.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    this.salesService
      .create({
        sparePartId: this.form.value.sparePartId!,
        quantitySold: this.form.value.quantitySold!,
      })
      .subscribe({
        next: () => {
          this.notification.show('تم تسجيل عملية البيع بنجاح', 'success');
          this.router.navigate(['/sales']);
        },
        error: () => this.loading.set(false),
      });
  }

  goBack(): void {
    this.router.navigate(['/sales']);
  }
}

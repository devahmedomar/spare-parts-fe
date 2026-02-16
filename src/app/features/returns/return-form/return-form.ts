import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReturnsService } from '../returns.service';
import { SparePartsService } from '../../spare-parts/spare-parts.service';
import { SparePart } from '../../spare-parts/spare-part.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-return-form',
  imports: [ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './return-form.html',
})
export class ReturnFormComponent implements OnInit {
  private returnsService = inject(ReturnsService);
  private sparePartsService = inject(SparePartsService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  parts = signal<SparePart[]>([]);
  loading = signal(false);
  loadingParts = signal(true);

  form = new FormGroup({
    sparePartId: new FormControl('', [Validators.required]),
    quantityReturned: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    reason: new FormControl(''),
  });

  ngOnInit(): void {
    this.sparePartsService.getAll().subscribe({
      next: parts => { this.parts.set(parts); this.loadingParts.set(false); },
      error: () => this.loadingParts.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    const val = this.form.value;
    this.returnsService.create({
      sparePartId: val.sparePartId!,
      quantityReturned: val.quantityReturned!,
      reason: val.reason || undefined,
    }).subscribe({
      next: () => {
        this.notification.show('تم تسجيل المرتجع بنجاح', 'success');
        this.router.navigate(['/returns']);
      },
      error: () => this.loading.set(false),
    });
  }

  goBack(): void { this.router.navigate(['/returns']); }
}

import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
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
  @Input() id?: string;

  private returnsService = inject(ReturnsService);
  private sparePartsService = inject(SparePartsService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  parts = signal<SparePart[]>([]);
  loading = signal(false);
  loadingParts = signal(true);
  isEdit = signal(false);

  form = new FormGroup({
    sparePartId: new FormControl('', [Validators.required]),
    quantityReturned: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    reason: new FormControl(''),
  });

  ngOnInit(): void {
    this.sparePartsService.getAll().subscribe({
      next: parts => {
        this.parts.set(parts);
        this.loadingParts.set(false);
        if (this.id) {
          this.isEdit.set(true);
          this.returnsService.getById(this.id).subscribe({
            next: ret => {
              this.form.setValue({
                sparePartId: ret.sparePartId._id,
                quantityReturned: ret.quantityReturned,
                reason: ret.reason || '',
              });
            },
            error: () => this.router.navigate(['/returns']),
          });
        }
      },
      error: () => this.loadingParts.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    const val = this.form.value;
    const data = {
      sparePartId: val.sparePartId!,
      quantityReturned: val.quantityReturned!,
      reason: val.reason || undefined,
    };

    const req = this.isEdit()
      ? this.returnsService.update(this.id!, data)
      : this.returnsService.create(data);

    req.pipe(
      switchMap(() => this.sparePartsService.getAll()),
    ).subscribe({
      next: () => {
        this.notification.show(
          this.isEdit() ? 'تم تحديث المرتجع بنجاح' : 'تم تسجيل المرتجع بنجاح',
          'success',
        );
        this.router.navigate(['/returns']);
      },
      error: () => this.loading.set(false),
    });
  }

  goBack(): void { this.router.navigate(['/returns']); }
}

import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SparePartsService } from '../spare-parts.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-spare-part-form',
  imports: [ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './spare-part-form.html',
})
export class SparePartFormComponent implements OnInit {
  @Input() id?: string;

  private service = inject(SparePartsService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  loading = signal(false);
  loadingData = signal(false);
  isEdit = signal(false);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
  });

  ngOnInit(): void {
    if (this.id) {
      this.isEdit.set(true);
      this.loadingData.set(true);
      this.service.getById(this.id).subscribe({
        next: part => {
          this.form.setValue({ name: part.name, quantity: part.quantity, price: part.price });
          this.loadingData.set(false);
        },
        error: () => this.router.navigate(['/spare-parts']),
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    const data = {
      name: this.form.value.name!,
      quantity: this.form.value.quantity!,
      price: this.form.value.price!,
    };

    const req = this.isEdit()
      ? this.service.update(this.id!, data)
      : this.service.create(data);

    req.subscribe({
      next: () => {
        this.notification.show(
          this.isEdit() ? 'تم تحديث القطعة بنجاح' : 'تمت إضافة القطعة بنجاح',
          'success'
        );
        this.router.navigate(['/spare-parts']);
      },
      error: () => this.loading.set(false),
    });
  }

  goBack(): void { this.router.navigate(['/spare-parts']); }
}

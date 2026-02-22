import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PowerOfAttorneyService } from '../power-of-attorney.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-poa-form',
  imports: [ReactiveFormsModule, PageHeaderComponent, FileUploadComponent],
  templateUrl: './poa-form.html',
})
export class PoaFormComponent implements OnInit {
  @Input() id?: string;

  private service = inject(PowerOfAttorneyService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  loading = signal(false);
  loadingData = signal(false);
  isEdit = signal(false);
  selectedFile = signal<File | null>(null);
  existingImage = signal('');

  form = new FormGroup({
    ownerName: new FormControl('', [Validators.required]),
    nationalId: new FormControl(''),
  });

  ngOnInit(): void {
    if (this.id) {
      this.isEdit.set(true);
      this.loadingData.set(true);
      this.service.getById(this.id).subscribe({
        next: item => {
          this.form.setValue({ ownerName: item.ownerName, nationalId: item.nationalId || '' });
          const imgUrl = item.image || item.imageUrl || '';
          this.existingImage.set(imgUrl.startsWith('/') ? 'http://localhost:5000' + imgUrl : imgUrl);
          this.loadingData.set(false);
        },
        error: () => this.router.navigate(['/certificates/power-of-attorney']),
      });
    }
  }

  onFileSelected(file: File | null): void { this.selectedFile.set(file); }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    if (!this.isEdit() && !this.selectedFile()) {
      this.notification.show('يجب رفع صورة التوكيل', 'error');
      return;
    }
    this.loading.set(true);

    const fd = new FormData();
    fd.append('ownerName', this.form.value.ownerName!);
    if (this.form.value.nationalId) fd.append('nationalId', this.form.value.nationalId);
    if (this.selectedFile()) fd.append('image', this.selectedFile()!);

    const req = this.isEdit()
      ? this.service.update(this.id!, fd)
      : this.service.create(fd);

    req.subscribe({
      next: () => {
        this.notification.show(
          this.isEdit() ? 'تم تحديث التوكيل بنجاح' : 'تمت إضافة التوكيل بنجاح',
          'success'
        );
        this.router.navigate(['/certificates/power-of-attorney']);
      },
      error: () => this.loading.set(false),
    });
  }

  goBack(): void { this.router.navigate(['/certificates/power-of-attorney']); }
}

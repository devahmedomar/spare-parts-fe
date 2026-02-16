import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MotorCertificatesService } from '../motor-certificates.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-motor-cert-form',
  imports: [ReactiveFormsModule, PageHeaderComponent, FileUploadComponent],
  templateUrl: './motor-cert-form.html',
})
export class MotorCertFormComponent implements OnInit {
  @Input() id?: string;

  private service = inject(MotorCertificatesService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  loading = signal(false);
  loadingData = signal(false);
  isEdit = signal(false);
  selectedFile = signal<File | null>(null);
  existingImage = signal('');

  form = new FormGroup({
    motorNumber: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if (this.id) {
      this.isEdit.set(true);
      this.loadingData.set(true);
      this.service.getById(this.id).subscribe({
        next: cert => {
          this.form.setValue({
            motorNumber: cert.motorNumber,
            ownerName: cert.ownerName,
            address: cert.address,
          });
          this.existingImage.set(cert.image || '');
          this.loadingData.set(false);
        },
        error: () => this.router.navigate(['/certificates/motor']),
      });
    }
  }

  onFileSelected(file: File | null): void { this.selectedFile.set(file); }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    if (!this.isEdit() && !this.selectedFile()) {
      this.notification.show('يجب رفع صورة للشهادة', 'error');
      return;
    }
    this.loading.set(true);

    const fd = new FormData();
    fd.append('motorNumber', this.form.value.motorNumber!);
    fd.append('ownerName', this.form.value.ownerName!);
    fd.append('address', this.form.value.address!);
    if (this.selectedFile()) fd.append('image', this.selectedFile()!);

    const req = this.isEdit()
      ? this.service.update(this.id!, fd)
      : this.service.create(fd);

    req.subscribe({
      next: () => {
        this.notification.show(
          this.isEdit() ? 'تم تحديث الشهادة بنجاح' : 'تمت إضافة الشهادة بنجاح',
          'success'
        );
        this.router.navigate(['/certificates/motor']);
      },
      error: () => this.loading.set(false),
    });
  }

  goBack(): void { this.router.navigate(['/certificates/motor']); }
}

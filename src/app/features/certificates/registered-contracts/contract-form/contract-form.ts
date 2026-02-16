import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisteredContractsService } from '../registered-contracts.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-contract-form',
  imports: [ReactiveFormsModule, PageHeaderComponent, FileUploadComponent],
  templateUrl: './contract-form.html',
})
export class ContractFormComponent implements OnInit {
  @Input() id?: string;

  private service = inject(RegisteredContractsService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  loading = signal(false);
  loadingData = signal(false);
  isEdit = signal(false);
  selectedFile = signal<File | null>(null);
  existingImage = signal('');

  form = new FormGroup({
    contractNumber: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if (this.id) {
      this.isEdit.set(true);
      this.loadingData.set(true);
      this.service.getById(this.id).subscribe({
        next: contract => {
          this.form.setValue({ contractNumber: contract.contractNumber, ownerName: contract.ownerName });
          this.existingImage.set(contract.image || '');
          this.loadingData.set(false);
        },
        error: () => this.router.navigate(['/certificates/contracts']),
      });
    }
  }

  onFileSelected(file: File | null): void { this.selectedFile.set(file); }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    if (!this.isEdit() && !this.selectedFile()) {
      this.notification.show('يجب رفع صورة للعقد', 'error');
      return;
    }
    this.loading.set(true);

    const fd = new FormData();
    fd.append('contractNumber', this.form.value.contractNumber!);
    fd.append('ownerName', this.form.value.ownerName!);
    if (this.selectedFile()) fd.append('image', this.selectedFile()!);

    const req = this.isEdit()
      ? this.service.update(this.id!, fd)
      : this.service.create(fd);

    req.subscribe({
      next: () => {
        this.notification.show(
          this.isEdit() ? 'تم تحديث العقد بنجاح' : 'تمت إضافة العقد بنجاح',
          'success'
        );
        this.router.navigate(['/certificates/contracts']);
      },
      error: () => this.loading.set(false),
    });
  }

  goBack(): void { this.router.navigate(['/certificates/contracts']); }
}

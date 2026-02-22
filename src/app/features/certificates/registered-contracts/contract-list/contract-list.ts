import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RegisteredContractsService } from '../registered-contracts.service';
import { RegisteredContract } from '../registered-contract.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-contract-list',
  imports: [DatePipe, PageHeaderComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './contract-list.html',
})
export class ContractListComponent implements OnInit {
  private service = inject(RegisteredContractsService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  contracts = signal<RegisteredContract[]>([]);
  loading = signal(true);
  deleteTarget = signal<RegisteredContract | null>(null);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: contracts => { this.contracts.set(contracts); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  goToNew(): void { this.router.navigate(['/certificates/contracts/new']); }
  goToEdit(id: string): void { this.router.navigate(['/certificates/contracts', id, 'edit']); }
  confirmDelete(contract: RegisteredContract): void { this.deleteTarget.set(contract); }
  cancelDelete(): void { this.deleteTarget.set(null); }

  doDelete(): void {
    const contract = this.deleteTarget();
    if (!contract) return;
    this.deleteTarget.set(null);
    this.service.delete(contract._id).subscribe({
      next: () => {
        this.contracts.update(list => list.filter(c => c._id !== contract._id));
        this.notification.show('تم حذف العقد بنجاح', 'success');
      },
    });
  }

  getImageUrl(contract: RegisteredContract): string {
    const url = contract.image || contract.imageUrl || '';
    return url.startsWith('/') ? 'http://localhost:5000' + url : url;
  }

  openImage(url: string): void { window.open(url, '_blank'); }

  downloadImage(url: string, name: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.target = '_blank';
    a.click();
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReturnsService } from '../returns.service';
import { Return } from '../return.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-returns-list',
  imports: [DatePipe, PageHeaderComponent, LoadingSpinnerComponent],
  templateUrl: './returns-list.html',
})
export class ReturnsListComponent implements OnInit {
  private service = inject(ReturnsService);
  private router = inject(Router);

  returns = signal<Return[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: returns => { this.returns.set(returns); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  goToNew(): void { this.router.navigate(['/returns/new']); }
}

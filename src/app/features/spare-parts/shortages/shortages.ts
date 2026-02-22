import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SparePartsService } from '../spare-parts.service';
import { SparePart } from '../spare-part.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-shortages',
  imports: [DecimalPipe, PageHeaderComponent, LoadingSpinnerComponent],
  templateUrl: './shortages.html',
})
export class ShortagesComponent implements OnInit {
  private service = inject(SparePartsService);
  private router  = inject(Router);

  parts   = signal<SparePart[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.service.getShortages().subscribe({
      next: parts => { this.parts.set(parts); this.loading.set(false); },
      error: ()    => this.loading.set(false),
    });
  }

  goToEdit(id: string): void { this.router.navigate(['/spare-parts', id, 'edit']); }
}

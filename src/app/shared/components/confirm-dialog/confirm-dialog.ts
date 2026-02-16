import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span style="font-size:1.3rem">⚠️</span>
          <h3 class="modal-title">{{ title }}</h3>
        </div>
        <p class="modal-body">{{ message }}</p>
        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="onCancel()">إلغاء</button>
          <button class="btn btn-danger" (click)="onConfirm()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  @Input() title = 'تأكيد الحذف';
  @Input() message = 'هل أنت متأكد من رغبتك في الحذف؟ لا يمكن التراجع عن هذا الإجراء.';
  @Input() confirmText = 'حذف';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void { this.confirmed.emit(); }
  onCancel(): void  { this.cancelled.emit(); }
}

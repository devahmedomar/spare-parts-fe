import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container">
      @for (n of notificationService.notifications(); track n.id) {
        <div class="notification-toast {{ n.type }}" (click)="notificationService.remove(n.id)">
          @if (n.type === 'success') { <span>✔</span> }
          @else if (n.type === 'error') { <span>✖</span> }
          @else { <span>ℹ</span> }
          <span>{{ n.message }}</span>
        </div>
      }
    </div>
  `,
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}

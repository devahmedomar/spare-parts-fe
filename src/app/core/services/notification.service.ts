import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal<Notification[]>([]);
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const id = ++this.counter;
    this.notifications.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }
}

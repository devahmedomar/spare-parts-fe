import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  auth = inject(AuthService);

  navItems = [
    { label: 'لوحة التحكم',  icon: '🏠', route: '/dashboard' },
    { label: 'قطع الغيار',   icon: '🔧', route: '/spare-parts' },
    { label: 'المبيعات',     icon: '🛒', route: '/sales' },
    { label: 'المرتجعات',    icon: '↩️', route: '/returns' },
  ];

  certItems = [
    { label: 'شهادات الموتور',  icon: '📄', route: '/certificates/motor' },
    { label: 'توكيل عام',       icon: '📋', route: '/certificates/power-of-attorney' },
    { label: 'عقود مسجلة',      icon: '📝', route: '/certificates/contracts' },
  ];

  logout(): void {
    this.auth.logout();
  }
}

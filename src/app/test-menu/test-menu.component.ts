import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-test-menu',
  imports: [CommonModule, AvatarModule, AvatarGroupModule, BadgeModule, OverlayBadgeModule, MenuModule],
  templateUrl: './test-menu.component.html',
  styleUrl: './test-menu.component.css'
})
export class TestMenuComponent {
  items: any[] = [
    {label: 'Utama', icon: 'bi-house', shortcut: "lorem-ipsum"},
  ];
}

import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type MenuItem = { name: string; icon: string; route: string; badge?: number };

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  menuOpen = false;

  menuItems: MenuItem[] = [
    { name: 'Laman Utama', icon: 'bi-house', route: '/laman-utama' },
    { name: 'Login', icon: 'bi-box-arrow-in-right', route: '/log-masuk' },
    { name: 'Settings', icon: 'bi-gear', route: '/settings' },
  ];

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeMenu();
  }
}

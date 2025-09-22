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
    { name: 'Settings', icon: 'bi-gear', route: '/settings' },
    { name: 'Daftar Anggota', icon: 'bi-plus-circle', route: '/daftar-anggota'},
    { name: 'Sasaran Kerja', icon: 'bi-bullseye', route: '/senarai-sasaran'},
    { name: 'Maklumat Sasaran', icon: 'bi-bullseye', route: '/maklumat-sasaran'},
    { name: 'Penilaian', icon: 'bi bi-graph-up', route: '/senarai-penilaian'},
    { name: 'Senarai Pegawai', icon: 'bi bi-people', route: '/senarai-pegawai'},
    { name: 'Maklumat Pegawai', icon: 'bi bi-person-circle', route: '/maklumat-pegawai'},
    { name: 'Senarai Peranan', icon: 'bi bi-person-vcard', route: '/senarai-peranan'}
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

import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { userDTO } from '../model/userDTO.model';
import { PerananService } from '../services/peranan.service';
import { pegawaiDinilai } from '../model/pegawai.model';
import { forkJoin } from 'rxjs';
import { RoleStateService } from '../services/role-state.service';

type MenuItem = { name: string; icon: string; route: string; badge?: number; roles?: number[]; order?: number };

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  menuOpen = false;
  user: userDTO = {} as userDTO;
  userRoles: number[] = [];

  menuItems: MenuItem[] = [
    { name: 'Utama', icon: 'bi-house', route: '/', order: 1 },

    // PYD
    { name: 'Sasaran Kerja', icon: 'bi-bullseye', route: '/senarai-sasaran', roles: [2], order: 2 },
    { name: 'Penilaian', icon: 'bi bi-graph-up', route: '/senarai-penilaian', roles: [2], order: 3 },

    // PPP/PPK

    // PPSM
    { name: 'Daftar Anggota', icon: 'bi-plus-circle', route: '/daftar-anggota', roles: [5], order: 5 },
    { name: 'Senarai Pegawai', icon: 'bi bi-people', route: '/senarai-pegawai', roles: [5], order: 6 },
    // { name: 'Laporan', icon: 'bi bi-file-text', route: '/', roles: [5], order: 7 }, // cari icon
    { name: 'Penilaian', icon: 'bi bi-person-vcard', route: '/senarai-penilaian', roles: [3, 4, 5], order: 10 },

    // PA
    // { name: 'Penetapan Penilai', icon: 'bi bi-person-vcard', route: '/penetapan-penilai', roles: [6, 7], order: 8 },
  ];

  constructor(private authService: AuthService, private roleService: PerananService, private roleStateService: RoleStateService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      if (res?.id && res?.noKP) {
        this.user = res;

        forkJoin({
          byId: this.roleService.getRolesById(res.id),       // guna id
          byNoKP: this.roleService.getRoleInPeranan(res.noKP), // guna noKP
          isPyd: this.roleService.getAsPyd(res.noKP)           // check PYD
        }).subscribe(result => {
          const rolesFromId = result.byId ?? [];
          const rolesFromNoKP = result.byNoKP ?? [];

          let combined: number[] = [...rolesFromId, ...rolesFromNoKP];

          // 🔥 Admin override dulu
          if (combined.includes(7)) {
            combined = this.menuItems
              .flatMap(item => item.roles ?? [])
              .concat(7);
          }
          // Kalau PYD dan bukan admin → lock jadi 2
          else if (result.isPyd) {
            combined = [2];
          }

          this.userRoles = Array.from(new Set(combined));
          this.roleStateService.setRoles(this.userRoles);
        });

      } else {
        console.warn("ID atau noKP tiada");
        this.userRoles = [];
      }
    });
  }

  get filteredMenuItems(): MenuItem[] {
    // if user has admin role (7), show everything
    if (this.userRoles.includes(7)) {
      return this.menuItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    // normal role filtering
    return this.menuItems
      .filter(item =>
        !item.roles || item.roles.some(r => this.userRoles.includes(r))
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

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

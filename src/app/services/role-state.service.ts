import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleStateService {

  constructor() { }

  private rolesSource = new BehaviorSubject<number[]>([]);
  roles$ = this.rolesSource.asObservable();

  private idPydSource = new BehaviorSubject<number | null>(null);
  idPyd$ = this.idPydSource.asObservable();

  // update roles (lepas login atau fetch dari API)
  setRoles(roles: number[]): void {
    this.rolesSource.next(roles);
  }

  // clear roles (contoh masa logout)
  clearRoles(): void {
    this.rolesSource.next([]);
  }

  // dapat roles terkini (tanpa subscribe)
  getCurrentRoles(): number[] {
    return this.rolesSource.value;
  }

  // helper: check satu role
  hasRole(role: number): boolean {
    return this.rolesSource.value.includes(role);
  }

  // helper: check ada salah satu role
  hasAnyRole(roles: number[]): boolean {
    return roles.some(r => this.rolesSource.value.includes(r));
  }

  setIdPyd(id: number) {
    this.idPydSource.next(id);
  }

  getCurrentIdPyd(): number | null {
    return this.idPydSource.value;
  }

}

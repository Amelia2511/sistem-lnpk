import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _pydId: number | null = null;

  constructor() {
    // For now, hard-code the pydId (replace with auth logic later)
    this._pydId = 3;  // You can replace this with logic to get it from localStorage or a hard-coded value for now
  }

  getPydId(): number {
    // This can be dynamically populated when auth is set up (from JWT token or session)
    return this._pydId!;
  }

  setPydId(id: number) {
    this._pydId = id;
  }
}

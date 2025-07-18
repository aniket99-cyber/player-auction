import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeamAssignGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const teams = localStorage.getItem('teams');

    if (teams && JSON.parse(teams).length > 0) {
      // Redirect to another route (e.g., /teams) if teams already exist
      this.router.navigate(['/teams']);
      return false;
    }
    return true;
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUser: any = null;
  showDropdown = false;

  constructor(private router: Router) {
    // Load session data if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  toggleProfileDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    // Remove user from local storage and refresh page to reset state
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}

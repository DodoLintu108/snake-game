import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  showDropdown = false;
  isLoggedIn = false;

  constructor(
    public router: Router, // Changed from private to public
    private authService: AuthService
  ) {
    // Initial check for logged in user
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.isLoggedIn = true;
    }
  }

  ngOnInit() {
    // Subscribe to auth status changes
    this.authService.getAuthStatus().subscribe(
      status => {
        this.isLoggedIn = status;
        if (status) {
          this.currentUser = this.authService.getCurrentUser();
        } else {
          this.currentUser = null;
        }
      }
    );
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.showDropdown = false; // Close dropdown when navigating
  }

  toggleProfileDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.showDropdown = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }

  // Helper method to check login status
  checkLoginStatus(): boolean {
    return this.isLoggedIn && this.currentUser !== null;
  }
}
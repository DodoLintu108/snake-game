import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showRules = false;
  isLoggedIn = false;
  currentUser: any = null;

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    if (this.isBrowser()) {
      // Check if there's a current user session from session storage
      const currentUserData = sessionStorage.getItem('currentUser');
      if (currentUserData) {
        this.isLoggedIn = true;
        this.currentUser = JSON.parse(currentUserData);
      } else {
        // Fallback: Check if userToken cookie exists
        const userToken = this.cookieService.get('userToken');
        if (userToken) {
          // If a userToken is found, try restoring the user session
          this.restoreUserSession(userToken);
        }
      }
    }
  }

  openRulesModal() {
    this.showRules = true;
  }

  closeRulesModal() {
    this.showRules = false;
  }

  logout(): void {
    if (this.isBrowser()) {
      // Remove user session from session storage and cookies
      sessionStorage.removeItem('currentUser');
      this.cookieService.delete('userToken');
      this.isLoggedIn = false;
      this.currentUser = null;
      this.router.navigate(['/']);
    }
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }



  // Helper method to check if code is running in browser context
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Restore user session using userToken from cookies
  private restoreUserSession(userToken: string): void {
    // Simulating the restoration of a user session
    const users = localStorage.getItem('users');
    if (users) {
      const usersArray = JSON.parse(users);
      const user = usersArray.find((user: any) => btoa(user.email) === userToken);
      if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.isLoggedIn = true;
        this.currentUser = user;
      }
    }
  }
}

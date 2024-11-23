import { Component } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router, private cookieService: CookieService) {}

  // Methods to capture form input values
  onEmailInput(event: Event): void {
    this.email = (event.target as HTMLInputElement).value;
  }

  onPasswordInput(event: Event): void {
    this.password = (event.target as HTMLInputElement).value;
  }

  // Login function to handle authentication
  login(event: Event): void {
    event.preventDefault(); // Prevent default form submission

    // Retrieve users from local storage
    const users = localStorage.getItem('users');
    const usersArray = users ? JSON.parse(users) : [];

    // Find user and validate password
    const user = usersArray.find((user: any) => user.email === this.email);

    if (user && bcrypt.compareSync(this.password, user.password)) {
      // Store user session in sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(user));

      // Store username in a cookie
      this.cookieService.set('username', user.username, 1); // Store for 1 day

      alert('Login successful');
      this.router.navigate(['/']); // Redirect to the home or game page
    } else {
      alert('Invalid credentials');
    }
  }

  // Method to navigate to the registration page
  navigateToRegister(): void {
    this.router.navigate(['/signup']);
  }
}

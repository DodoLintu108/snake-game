import { Component } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'] // Ensure the CSS file exists here
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';

  constructor(private router: Router) {}

  // Capture form input values
  onUsernameInput(event: Event): void {
    this.username = (event.target as HTMLInputElement).value;
  }

  onEmailInput(event: Event): void {
    this.email = (event.target as HTMLInputElement).value;
  }

  onPasswordInput(event: Event): void {
    this.password = (event.target as HTMLInputElement).value;
  }

  // Register function to handle user registration
  register(event: Event): void {
    event.preventDefault(); // Prevent default form submission

    // Hash the password
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    const newUser = {
      username: this.username,
      email: this.email,
      password: hashedPassword,
    };

    // Retrieve users from local storage
    const users = localStorage.getItem('users');
    const usersArray = users ? JSON.parse(users) : [];

    // Check if email is already registered
    if (usersArray.some((user: any) => user.email === this.email)) {
      alert('Email is already registered');
      return;
    }

    // Add new user to users array
    usersArray.push(newUser);
    // Save the updated users array back to local storage
    localStorage.setItem('users', JSON.stringify(usersArray));

    alert('Registered successfully');
    // Redirect to login page after successful registration
    this.router.navigate(['/login']);
  }

  // Method to navigate to the login page
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}

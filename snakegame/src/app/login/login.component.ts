import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;

  constructor() { }

  ngOnInit(): void {
    // Initial state logic (no token checks)
  }

  onSubmit(): void {
    // Simple login simulation without AuthService
    this.isLoggedIn = true;
    this.isLoginFailed = false;
  }
}

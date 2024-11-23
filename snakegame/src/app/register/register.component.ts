import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // Simulate successful registration
    this.isSuccessful = true;
    this.isSignUpFailed = false;
  }
}

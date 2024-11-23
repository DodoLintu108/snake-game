import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content: string = "Welcome to the homepage!";

  constructor() { }

  ngOnInit(): void {
    // Set static content since UserService is removed
    this.content = "Welcome to the homepage!";
  }
}

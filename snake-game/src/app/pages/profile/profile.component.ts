import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  highestScore: number = 0;
  isUserLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.isUserLoggedIn = true;
      this.loadHighestScore();
    } else {
      this.isUserLoggedIn = false;
    }
  }

  loadHighestScore(): void {
    if (this.currentUser) {
      // Retrieve highest score from local storage or any available storage mechanism
      const scoreData = localStorage.getItem('highestScore');
      if (scoreData) {
        const scores = JSON.parse(scoreData);
        const userScore = scores[this.currentUser.email];
        if (userScore) {
          this.highestScore = userScore;
        }
      }
    }
  }

  logout(): void {
    // Log out the user by removing session data
    sessionStorage.removeItem('currentUser');
    this.isUserLoggedIn = false;
    this.router.navigate(['/']);
  }
}

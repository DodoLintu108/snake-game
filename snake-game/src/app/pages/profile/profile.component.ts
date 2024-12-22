import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  highScores: any[] = [];
  highestScore: number = 0;
  isUserLoggedIn: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private scoreService: ScoreService
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.authService.isLoggedIn();
    if (this.isUserLoggedIn) {
      this.currentUser = this.authService.getCurrentUser();
      this.loadHighScores();
      this.loadLocalHighScore(); // Load both database and local scores
    }
  }

  loadHighScores(): void {
    this.scoreService.getUserHighScores().subscribe({
      next: (response) => {
        this.highScores = response.scores;
        // Update highest score if database score is higher
        if (this.highScores.length > 0) {
          const maxDatabaseScore = Math.max(...this.highScores.map(score => score.score));
          this.highestScore = Math.max(this.highestScore, maxDatabaseScore);
        }
      },
      error: (error) => {
        console.error('Error loading high scores:', error);
      }
    });
  }

  loadLocalHighScore(): void {
    if (this.currentUser) {
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
    this.authService.logout().subscribe({
      next: () => {
        // Clear all storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('paymentStatus');
        localStorage.removeItem('highestScore');
        sessionStorage.clear();
        
        // Reset component state
        this.isUserLoggedIn = false;
        this.currentUser = null;
        this.highScores = [];
        this.highestScore = 0;
        
        // Navigate to home page
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still clear everything and redirect even if the API call fails
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }
}
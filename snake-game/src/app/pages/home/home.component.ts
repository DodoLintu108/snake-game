import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PaymentService } from '../payment/payment.service';
import { AuthService } from '../../services/auth.service';
import { ScoreService } from '../../services/score.service';
import { TopScores, Score } from '../../interfaces/score.interfaces';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showRules = false;
  showLeaderboard = false;
  isLoggedIn = false;
  paymentStatus = false;
  currentUser: any = null;
  topScores: TopScores = {
    easy: [],
    medium: [],
    hard: []
  };  
  constructor(
    public router: Router,
    private cookieService: CookieService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private scoreService: ScoreService
  ) {}

  ngOnInit(): void {
    // Subscribe to auth status changes
    this.authService.getAuthStatus().subscribe(
      status => {
        this.isLoggedIn = status;
        if (status) {
          this.currentUser = this.authService.getCurrentUser();
          this.checkPaymentStatus();
          this.loadLeaderboard(); // Load leaderboard when user is logged in
        } else {
          this.currentUser = null;
          this.paymentStatus = false;
        }
      }
    );

    // Initial check
    if (this.isBrowser()) {
      this.isLoggedIn = this.authService.isLoggedIn();
      if (this.isLoggedIn) {
        this.currentUser = this.authService.getCurrentUser();
        this.checkPaymentStatus();
        this.loadLeaderboard(); // Load initial leaderboard
      }
    }
  }

  checkPaymentStatus(): void {
    // First check localStorage
    const storedStatus = localStorage.getItem('paymentStatus');
    if (storedStatus) {
      this.paymentStatus = JSON.parse(storedStatus);
    }

    // Then verify with server
    this.authService.checkPaymentStatus().subscribe({
      next: (response) => {
        this.paymentStatus = response.has_paid;
        localStorage.setItem('paymentStatus', response.has_paid.toString());
      },
      error: (error) => {
        console.error('Error checking payment status:', error);
      }
    });
  }

  openRulesModal(): void {
    this.showRules = true;
  }

  closeRulesModal(): void {
    this.showRules = false;
  }

  toggleLeaderboard(): void {
    this.showLeaderboard = !this.showLeaderboard;
    if (this.showLeaderboard) {
      this.loadLeaderboard();
    }
  }

  loadLeaderboard(): void {
    this.scoreService.getTopScores().subscribe({
      next: (response) => {
        this.topScores = response;
        console.log('Leaderboard loaded:', this.topScores); // Debug log
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
      }
    });
  }

  startGame(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.paymentStatus) {
      this.router.navigate(['/payment']);
      return;
    }

    // Add your game start logic here
    console.log('Starting game...');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.paymentStatus = false;
        this.currentUser = null;
        this.topScores = { easy: [], medium: [], hard: [] }; // Clear leaderboard
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToPayment(): void {
    this.router.navigate(['/payment']);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Helper method to format score (optional)
  formatScore(score: number): string {
    return score.toLocaleString();
  }

  // Helper method to get rank class (optional)
  getRankClass(index: number): string {
    switch(index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return 'bronze';
      default: return '';
    }
  }
}
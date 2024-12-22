// src/app/pages/game/game.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    // Add message listener for scores from Vue app
    window.addEventListener('message', this.handleGameMessage.bind(this));
  }

  ngOnDestroy() {
    // Remove listener when component is destroyed
    window.removeEventListener('message', this.handleGameMessage.bind(this));
  }

  private handleGameMessage(event: MessageEvent) {
    // Only accept messages from your Vue app
    if (event.origin !== 'http://localhost:8081') return;

    console.log('Received message from game:', event.data); // Debug log

    if (event.data.type === 'GAME_SCORE') {
      this.handleScore(event.data);
    }
  }

  private handleScore(data: { score: number; difficulty: string; status: string }) {
    console.log('Processing score:', data); // Debug log

    this.scoreService.submitScore(data.score, data.difficulty).subscribe({
      next: (response) => {
        console.log('Score submitted successfully:', response);
      },
      error: (error) => {
        console.error('Error submitting score:', error);
      }
    });
  }
}
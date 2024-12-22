// src/app/services/game-analytics.service.ts
import { Injectable } from '@angular/core';
import LogRocket from 'logrocket';

interface GamePerformanceData {
  fps: number;
  moveCount: number;
  snakeLength: number;
  score: number;
  timestamp: string;
}

interface PlayerBehaviorData {
  difficulty: string;
  duration: number;
  moves: number;
  applesCollected: number;
  collisions: number;
}

interface GameErrorData {
  errorMessage: string;
  errorStack: string;
  gameScore: number;
  gameStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameAnalyticsService {
  constructor() {}

  trackGamePerformance(data: GamePerformanceData) {
    LogRocket.track('Game_Performance', {
      fps: Number(data.fps),
      moveCount: Number(data.moveCount),
      snakeLength: Number(data.snakeLength),
      score: Number(data.score),
      timestamp: String(data.timestamp)
    });
  }

  trackPlayerBehavior(data: PlayerBehaviorData) {
    LogRocket.track('Player_Behavior', {
      difficulty: String(data.difficulty),
      duration: Number(data.duration),
      moves: Number(data.moves),
      applesCollected: Number(data.applesCollected),
      collisions: Number(data.collisions)
    });
  }

  trackErrors(data: any) {
    LogRocket.track('Game_Errors', {
      errorMessage: String(data.message),
      errorStack: String(data.stack),
      gameScore: Number(data.gameState?.score || 0),
      gameStatus: String(data.gameState?.isGameOver ? 'game_over' : 'active')
    });
  }
}
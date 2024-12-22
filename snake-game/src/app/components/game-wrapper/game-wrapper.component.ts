// src/app/components/game-wrapper/game-wrapper.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import LogRocket from 'logrocket';

@Component({
  selector: 'app-game-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container">
      <iframe
        [src]="gameUrl"
        width="100%"
        height="600px"
        frameBorder="0"
        (load)="onIframeLoad()"
      ></iframe>
    </div>
  `,
  styles: [`
    .game-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
  `]
})
export class GameWrapperComponent implements OnInit, OnDestroy {
  gameUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8081');
  }

  ngOnInit() {
    LogRocket.init('ombkxd/snake-game');
    window.addEventListener('message', this.handleGameMessage);
    
    LogRocket.track('Game_Component_Initialized', {
      timestamp: new Date().toISOString()
    });
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.handleGameMessage);
  }

  handleGameMessage = (event: MessageEvent) => {
    if (event.origin !== 'http://localhost:8080') return;

    console.log('Received message:', event.data); // Debug log

    if (event.data.type === 'GAME_SCORE') {
      LogRocket.track('Game_Score', {
        score: event.data.score,
        difficulty: event.data.difficulty,
        status: event.data.status,
        timestamp: new Date().toISOString()
      });
    }

    if (event.data.type === 'GAME_ANALYTICS') {
      LogRocket.track(event.data.eventType, {
        ...event.data.data,
        timestamp: new Date().toISOString()
      });
    }
  }

  onIframeLoad() {
    LogRocket.track('Game_Iframe_Loaded', {
      timestamp: new Date().toISOString()
    });
  }
}
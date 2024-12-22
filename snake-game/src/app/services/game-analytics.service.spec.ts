// src/app/services/game-analytics.service.ts
import { Injectable } from '@angular/core';
import LogRocket from 'logrocket';

@Injectable({
  providedIn: 'root'
})
export class GameAnalyticsService {
  trackGameEvent(eventType: string, data: any) {
    LogRocket.track(eventType, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}
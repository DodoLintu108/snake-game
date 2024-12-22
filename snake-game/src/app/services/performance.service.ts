// src/app/services/performance.service.ts
import { Injectable } from '@angular/core';
import LogRocket from 'logrocket';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  // Track main application metrics
  trackMainAppMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    LogRocket.track('Main_App_Performance', {
      totalLoadTime: navigation.loadEventEnd - navigation.startTime,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      timestamp: new Date().toISOString()
    });
  }

  // Method to receive and track Vue game metrics
  trackGameMetrics(gameData: any) {
    LogRocket.track('Game_Performance', {
      ...gameData,
      source: 'vue_game',
      timestamp: new Date().toISOString()
    });
  }
}
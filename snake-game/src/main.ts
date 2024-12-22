import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ErrorHandler } from '@angular/core';
import LogRocket from 'logrocket';

// Initialize LogRocket
LogRocket.init('ombkxd/snake-game');

// Custom Error Handler for LogRocket
class LogRocketErrorHandler implements ErrorHandler {
  handleError(error: any) {
    // Send error to LogRocket
    LogRocket.captureException(error);
    
    // Track error as an event
    LogRocket.track('Application_Error', {
      errorMessage: error.message,
      errorStack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    // Console log for development
    console.error('An error occurred:', error);
  }
}

// Update appConfig to include the error handler
const updatedConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    {
      provide: ErrorHandler,
      useClass: LogRocketErrorHandler
    }
  ]
};

// Bootstrap application with updated config
bootstrapApplication(AppComponent, updatedConfig)
  .catch((err) => {
    console.error('Application bootstrap error:', err);
    LogRocket.captureException(err);
  });

// Optional: Track application initialization
LogRocket.track('Application_Initialized', {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  screenResolution: `${window.screen.width}x${window.screen.height}`
});
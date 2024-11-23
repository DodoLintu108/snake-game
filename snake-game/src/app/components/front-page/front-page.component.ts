import { Component } from '@angular/core';

@Component({
  selector: 'app-front-page',
  standalone: true,
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css'],
})
export class FrontPageComponent {
  // Method to handle the "Show Rules" button click
  showRules(): void {
    alert('Game Rules:\n1. Use arrow keys to move.\n2. Eat the food to grow.\n3. Don’t collide with yourself or the walls!');
  }

  // Method to handle the "Start Game" button click
  startGame(): void {
    alert('Starting the game... (To be implemented)');
  }
}

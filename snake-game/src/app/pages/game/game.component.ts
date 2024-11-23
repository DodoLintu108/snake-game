import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allows Angular to recognize custom elements like <snake-game>
})
export class GameComponent {
  // Any additional logic or hooks for Angular's side can be added here
}

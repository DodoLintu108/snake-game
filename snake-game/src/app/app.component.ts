import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameWrapperComponent } from './components/game-wrapper/game-wrapper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameWrapperComponent],
  template: `
  <main>
    <router-outlet></router-outlet>
  </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'snake-game';
}

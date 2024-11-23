import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import SnakeGame from './app/pages/game/SnakeGame.vue';

// Wrap the Vue component as a custom element
const CustomElement = wrap(Vue, SnakeGame);

// Define the custom element, making it available globally
window.customElements.define('snake-game', CustomElement);

// Debugging Logs
console.log('snake-game.js has been loaded successfully');

// Debugging Tools - Vue Lifecycle Monitoring
CustomElement.prototype.connectedCallback = function() {
  console.log('snake-game custom element added to the page.');
  if (typeof this.mounted === 'function') {
    console.log('Mounted lifecycle detected and starting Vue component mount.');
  }
};

CustomElement.prototype.disconnectedCallback = function() {
  console.log('snake-game custom element removed from the page.');
};

CustomElement.prototype.attributeChangedCallback = function(name, oldValue, newValue) {
  console.log(`snake-game attribute ${name} changed from ${oldValue} to ${newValue}`);
};

// Catch any errors that may occur during the lifecycle of the custom element
window.addEventListener('error', (event) => {
  if (event.target && event.target.tagName === 'SNAKE-GAME') {
    console.error('An error occurred in the snake-game component:', event.message);
  }
});

// Test Log to Confirm the Element is Created
const testSnakeGameElement = document.createElement('snake-game');
document.body.appendChild(testSnakeGameElement);
console.log('Test snake-game element added to document body for debugging.');

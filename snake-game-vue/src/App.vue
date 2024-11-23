<template>
  <div id="app">  
    <div v-if="!gameStarted" class="controls">
      <label for="difficulty">Select Difficulty:</label>
      <select id="difficulty" v-model="difficulty">
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button @click="startGame" class="start-button">Start Game</button>
    </div>
    <div v-if="gameStarted" class="game-container">
      <SnakeGame :difficulty="difficulty" :gameStarted="gameStarted" />
    </div>
  </div>
</template>

<script>
import SnakeGame from './components/SnakeGame.vue';
import { ref } from 'vue';

export default {
  name: 'App',
  components: {
    SnakeGame,
  },
  setup() {
    const difficulty = ref('Medium');
    const gameStarted = ref(false);

    const startGame = () => {
      gameStarted.value = true;
    };

    return {
      difficulty,
      gameStarted,
      startGame,
    };
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.controls {
  margin-bottom: 20px;
}

label {
  font-size: 1.2em;
  margin-right: 10px;
}

select {
  font-size: 1em;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.start-button {
  font-size: 1.2em;
  margin-left: 15px;
  padding: 5px 15px;
  border: none;
  border-radius: 10px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:hover {
  background-color: #2980b9;
}

.game-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

h2 {
  font-size: 1.8em;
  color: #34495e;
  margin-bottom: 20px;
}
</style>

<template>
  <div>
    <div v-if="gameOver" class="game-over shake">
      <div class="game-over-content">
        <h2>Game Over!</h2>
        <p>Your score: {{ score }}</p>
        <button @click="restartGame" class="restart-button">Restart Game</button>
      </div>
    </div>

    <div v-else-if="win" class="win-modal">
      <div class="win-content bounce">
        <h2>You Win! 🎉</h2>
        <p>Your score: {{ score }}</p>
        <button @click="restartGame" class="restart-button">Restart Game</button>
      </div>
    </div>

    <div v-else-if="gameStarted" ref="gameArea" class="game-area">
      <div v-for="(segment, index) in snake" :key="index" class="snake-segment" :style="getSegmentStyle(segment)"></div>
      <div class="apple" :style="getAppleStyle(apple)"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

export default {
  name: 'SnakeGame',
  props: {
    difficulty: {
      type: String,
      default: 'Medium',
    },
    gameStarted: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const gridSize = 20;
    const snake = ref([{ x: 10, y: 10 }]);
    const direction = ref(null); // No direction set until user presses a key
    const apple = ref({ x: 5, y: 5 });
    const gameInterval = ref(null);
    const gameOver = ref(false);
    const win = ref(false);
    const score = ref(0);
    const maxScore = 500; 

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
      clearInterval(gameInterval.value);
      window.removeEventListener('keydown', handleKeydown);
    });

    watch(() => props.gameStarted, (newValue) => {
      if (newValue) {
        startGame();
      }
    });

    const getGameSpeed = () => {
      switch (props.difficulty) {
        case 'Easy':
          return 300;
        case 'Medium':
          return 200;
        case 'Hard':
          return 100;
        default:
          return 200;
      }
    };

    const startGame = () => {
      if (gameInterval.value) {
        clearInterval(gameInterval.value);
      }
      snake.value = [{ x: 10, y: 10 }]; // Reset snake
      direction.value = null; // Reset direction
      score.value = 0; // Reset score
      gameOver.value = false; // Reset game status
      win.value = false; // Reset win status
    };

    const moveSnake = () => {
      if (gameOver.value || direction.value === null) {
        return; // Don't move if game is over or no direction is set
      }

      const newHead = {
        x: snake.value[0].x + direction.value.x,
        y: snake.value[0].y + direction.value.y,
      };

      if (isCollision(newHead)) {
        endGame();
        return;
      }

      snake.value.unshift(newHead);

      if (newHead.x === apple.value.x && newHead.y === apple.value.y) {
        score.value += 10;
        generateApple();
      } else {
        snake.value.pop();
      }

      if (score.value >= maxScore) {
        winGame();
      }
    };

    const isCollision = (head) => {
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        return true;
      }

      for (let i = 1; i < snake.value.length; i++) {
        if (snake.value[i].x === head.x && snake.value[i].y === head.y) {
          return true;
        }
      }
      return false;
    };

    const generateApple = () => {
      let newApple;
      do {
        newApple = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };
      } while (snake.value.some((segment) => segment.x === newApple.x && segment.y === newApple.y));
      apple.value = newApple;
    };

    const handleKeydown = (event) => {
      event.preventDefault(); // Prevent default scrolling behavior on arrow keys
      if (!gameInterval.value) {
        gameInterval.value = setInterval(moveSnake, getGameSpeed());
      }
      switch (event.key) {
        case 'ArrowUp':
          if (direction.value === null || direction.value.y === 0) {
            direction.value = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
          if (direction.value === null || direction.value.y === 0) {
            direction.value = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
          if (direction.value === null || direction.value.x === 0) {
            direction.value = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
          if (direction.value === null || direction.value.x === 0) {
            direction.value = { x: 1, y: 0 };
          }
          break;
      }
    };

    const endGame = () => {
      gameOver.value = true;
      clearInterval(gameInterval.value);
    };

    const winGame = () => {
      win.value = true;
      clearInterval(gameInterval.value);
    };

    const restartGame = () => {
      window.location.reload(); // Refresh the page to restart the game
    };

    const getSegmentStyle = (segment) => {
      return {
        left: `${segment.x * 25}px`,
        top: `${segment.y * 25}px`,
        width: '25px',
        height: '25px',
      };
    };

    const getAppleStyle = (apple) => {
      return {
        left: `${apple.x * 25}px`,
        top: `${apple.y * 25}px`,
        width: '25px',
        height: '25px',
        backgroundColor: 'red',
      };
    };

    return {
      snake,
      apple,
      score,
      gameOver,
      win,
      restartGame,
      getSegmentStyle,
      getAppleStyle,
    };
  },
};
</script>

<style scoped>
.game-area {
  width: 500px;
  height: 500px;
  background-color: #000;
  position: relative;
  border: 5px solid #fff;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(255, 255, 0, 0.4);
}

.snake-segment {
  position: absolute;
  background: linear-gradient(to bottom right, #00ff00, #006400);
  border-radius: 25%;
  box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
}

.apple {
  position: absolute;
  background: radial-gradient(circle, red, darkred);
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(255, 0, 0, 0.4);
}

.game-over, .win-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  width: 500px;
  background-color: rgba(0, 0, 0, 0.9);
  position: relative;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
}

.game-over-content, .win-content {
  color: yellow;
  text-align: center;
  font-family: 'Press Start 2P', cursive;
}

/* Winning animation (bounce effect) */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.bounce {
  animation: bounce 1.5s ease-in-out;
}

/* Shake animation for losing */
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s ease-in-out;
}

.restart-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1em;
  background-color: #ff5733;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.restart-button:hover {
  background-color: #c70039;
  transform: scale(1.1);
}
</style>

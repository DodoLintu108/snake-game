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
/* eslint-disable no-unused-vars */
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
  emits: ['gameOver', 'gameWin'],
  setup(props, { emit }) {
    // Game state variables
    const gridSize = 20;
    const snake = ref([{ x: 10, y: 10 }]);
    const direction = ref(null);
    const apple = ref({ x: 5, y: 5 });
    const gameInterval = ref(null);
    const gameOver = ref(false);
    const win = ref(false);
    const score = ref(0);
    const maxScore = 500;

    // Analytics variables
    const gameStartTime = ref(performance.now());
    const moveCount = ref(0);
    const collisionCount = ref(0);
    const appleCollections = ref(0);
    const lastFrameTime = ref(performance.now());
    const fps = ref(0);

  // Modify the sendGameAnalytics function
  const sendGameAnalytics = (eventType, data) => {
  // Ensure data is serializable by converting it to a simple object
  const sanitizedData = JSON.parse(JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
    difficulty: props.difficulty
  }));

  window.parent.postMessage({
    type: 'GAME_ANALYTICS',
    eventType,
    data: sanitizedData
  }, 'http://localhost:4200');
};

    const sendScoreToParent = (finalScore, gameStatus) => {
      window.parent.postMessage({
        type: 'GAME_SCORE',
        score: finalScore,
        difficulty: props.difficulty,
        status: gameStatus
      }, 'http://localhost:4200');
    };

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown);
      sendGameAnalytics('GAME_LOADED', {
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    });

    onBeforeUnmount(() => {
      clearInterval(gameInterval.value);
      window.removeEventListener('keydown', handleKeydown);
      sendGameAnalytics('GAME_UNLOADED', {
        finalScore: score.value,
        totalMoves: moveCount.value
      });
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
      snake.value = [{ x: 10, y: 10 }];
      direction.value = null;
      score.value = 0;
      gameOver.value = false;
      win.value = false;

      // Reset analytics metrics
      gameStartTime.value = performance.now();
      moveCount.value = 0;
      collisionCount.value = 0;
      appleCollections.value = 0;

      sendGameAnalytics('GAME_START', {
        difficulty: props.difficulty,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    };

    const moveSnake = () => {
  if (gameOver.value || direction.value === null) {
    return;
  }

      // Update FPS and move count
      const currentTime = performance.now();
  fps.value = Math.round(1000 / (currentTime - lastFrameTime.value));
  lastFrameTime.value = currentTime;
  moveCount.value++;


      const newHead = {
        x: snake.value[0].x + direction.value.x,
        y: snake.value[0].y + direction.value.y,
      };

      if (isCollision(newHead)) {
        collisionCount.value++;
        endGame();
        return;
      }

      snake.value.unshift(newHead);

      if (newHead.x === apple.value.x && newHead.y === apple.value.y) {
        appleCollections.value++;
        score.value += 10;
        
        sendGameAnalytics('APPLE_COLLECTED', {
          score: score.value,
          position: apple.value,
          snakeLength: snake.value.length
        });
        
        generateApple();
      } else {
        snake.value.pop();
      }

      // Track performance periodically
      if (moveCount.value % 50 === 0) {
        sendGameAnalytics('PERFORMANCE_UPDATE', {
          fps: fps.value,
          moveCount: moveCount.value,
          snakeLength: snake.value.length,
          score: score.value
        });
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
  event.preventDefault();
  if (!gameInterval.value) {
    gameInterval.value = setInterval(moveSnake, getGameSpeed());
    sendGameAnalytics('FIRST_MOVE', {
      direction: event.key,
      timeToStart: Math.round(performance.now() - gameStartTime.value)
    });
  }

  const previousDirection = direction.value ? { ...direction.value } : null;

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

     // Track direction changes with serializable data
  if (direction.value !== previousDirection) {
    sendGameAnalytics('DIRECTION_CHANGE', {
      from: previousDirection ? { x: previousDirection.x, y: previousDirection.y } : null,
      to: { x: direction.value.x, y: direction.value.y },
      moveCount: moveCount.value,
      position: { x: snake.value[0].x, y: snake.value[0].y }
    });
  }
};

// Modify other analytics calls to ensure serializable data
const endGame = () => {
  const gameDuration = Math.round(performance.now() - gameStartTime.value);
  gameOver.value = true;
  clearInterval(gameInterval.value);

  sendGameAnalytics('GAME_OVER', {
    finalScore: score.value,
    duration: gameDuration,
    moves: moveCount.value,
    collisions: collisionCount.value,
    applesCollected: appleCollections.value,
    finalLength: snake.value.length,
    averageFPS: Math.round(fps.value)
  });

  emit('gameOver', score.value);
  sendScoreToParent(score.value, 'gameover');
};

const winGame = () => {
  const gameDuration = Math.round(performance.now() - gameStartTime.value);
  win.value = true;
  clearInterval(gameInterval.value);

  sendGameAnalytics('GAME_WIN', {
    finalScore: score.value,
    duration: gameDuration,
    moves: moveCount.value,
    collisions: collisionCount.value,
    applesCollected: appleCollections.value,
    finalLength: snake.value.length,
    averageFPS: Math.round(fps.value)
  });

  emit('gameWin', score.value);
  sendScoreToParent(score.value, 'win');
};
window.onerror = (message, source, lineno, colno, error) => {
  sendGameAnalytics('ERROR', {
    message: String(message),
    source: String(source),
    lineno: Number(lineno),
    colno: Number(colno),
    stack: error?.stack ? String(error.stack) : undefined,
    gameState: {
      score: Number(score.value),
      snakeLength: snake.value.length,
      isGameOver: Boolean(gameOver.value),
      isWin: Boolean(win.value)
    }
  });
};

    const restartGame = () => {
      sendGameAnalytics('GAME_RESTART', {
        finalScore: score.value,
        totalMoves: moveCount.value
      });
      sendScoreToParent(score.value, 'restart');
      window.location.reload();
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
    
    if (moveCount.value % 50 === 0) {
    sendGameAnalytics('PERFORMANCE_UPDATE', {
      fps: Math.round(fps.value),
      moveCount: Number(moveCount.value),
      snakeLength: snake.value.length,
      score: Number(score.value)
    });
  }
    // Error tracking
    window.onerror = (message, source, lineno, colno, error) => {
      sendGameAnalytics('ERROR', {
        message,
        source,
        lineno,
        colno,
        stack: error?.stack,
        gameState: {
          score: score.value,
          snakeLength: snake.value.length,
          isGameOver: gameOver.value,
          isWin: win.value
        }
      });
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
      endGame,
      isCollision,
      moveSnake,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.game-area {
  width: 500px;
  height: 500px;
  background: rgba(10, 10, 46, 0.95);
  position: relative;
  border: 2px solid rgba(0, 255, 255, 0.3);
  margin: 0 auto;
  box-shadow: 
    0 0 40px rgba(0, 255, 255, 0.3),
    inset 0 0 20px rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

/* Grid Overlay for Game Area */
.game-area::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px),
    linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px);
  background-size: 25px 25px;
  pointer-events: none;
}

.snake-segment {
  position: absolute;
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  border-radius: 5px;
  box-shadow: 
    0 0 10px rgba(0, 242, 254, 0.5),
    0 0 20px rgba(79, 172, 254, 0.3);
  transition: all 0.1s ease;
  z-index: 2;
}

.apple {
  position: absolute;
  background: linear-gradient(45deg, #ff0055, #ff6b6b);
  border-radius: 50%;
  box-shadow: 
    0 0 15px rgba(255, 0, 85, 0.5),
    0 0 30px rgba(255, 107, 107, 0.3);
  animation: pulseApple 1.5s ease-in-out infinite;
  z-index: 1;
}

.game-over, .win-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  width: 500px;
  background: rgba(10, 10, 46, 0.98);
  position: relative;
  border-radius: 10px;
  margin: 0 auto;
  border: 2px solid rgba(0, 255, 255, 0.3);
  box-shadow: 
    0 0 40px rgba(0, 255, 255, 0.3),
    inset 0 0 20px rgba(0, 255, 255, 0.2);
  overflow: hidden;
}

.game-over::before, .win-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(transparent 0%, rgba(10, 10, 46, 0.5) 75%),
    linear-gradient(90deg, rgba(0,255,255,.07) 0%, transparent 100%);
  background-size: 100% 3px, 3px 100%;
  animation: scanlines 1s linear infinite;
  pointer-events: none;
}

.game-over-content, .win-content {
  color: #0ff;
  text-align: center;
  font-family: 'Press Start 2P', cursive;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.5),
    0 0 20px rgba(0, 255, 255, 0.3),
    0 0 30px rgba(0, 255, 255, 0.1);
  z-index: 2;
}

.game-over-content h2, .win-content h2 {
  font-size: 24px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.game-over-content p, .win-content p {
  font-size: 16px;
  margin-bottom: 30px;
  color: #fff;
}

.restart-button {
  padding: 15px 30px;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.restart-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: rotate(45deg);
  animation: buttonShine 3s infinite;
}

.restart-button:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.2),
    0 0 30px rgba(0, 255, 255, 0.5);
}

/* Animations */
@keyframes scanlines {
  0% { background-position: 0 0; }
  100% { background-position: 0 3px; }
}

@keyframes buttonShine {
  0% { transform: translate(-100%, -100%) rotate(45deg); }
  100% { transform: translate(100%, 100%) rotate(45deg); }
}

@keyframes pulseApple {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px) scale(1.1);
  }
  60% {
    transform: translateY(-15px) scale(1.05);
  }
}

@keyframes shake {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-10px, 0) rotate(-5deg); }
  50% { transform: translate(10px, 0) rotate(5deg); }
  75% { transform: translate(-10px, 0) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.bounce {
  animation: bounce 1.5s ease-in-out;
}

.shake {
  animation: shake 0.5s ease-in-out;
}

/* Responsive Design */
@media (max-width: 600px) {
  .game-area, .game-over, .win-modal {
    width: 100%;
    max-width: 400px;
    height: 400px;
  }

  .game-over-content h2, .win-content h2 {
    font-size: 20px;
  }

  .game-over-content p, .win-content p {
    font-size: 14px;
  }

  .restart-button {
    padding: 12px 24px;
    font-size: 12px;
  }
}
</style>

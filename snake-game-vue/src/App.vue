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
      <SnakeGame 
        :difficulty="difficulty" 
        :gameStarted="gameStarted"
        @gameOver="handleGameOver"
        @gameWin="handleGameWin"
      />
    </div>
  </div>
</template>

<script>
import SnakeGame from './components/SnakeGame.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
export default {
  name: 'App',
  components: {
    SnakeGame,
  },
  setup() {
    const difficulty = ref('Medium');
    const gameStarted = ref(false);
    const gameStartTime = ref(null);
    const sessionStartTime = ref(performance.now());
    const gamesPlayed = ref(0);
    const totalScore = ref(0);

    // Analytics tracking function
    const sendAnalytics = (eventType, data) => {
      window.parent.postMessage({
        type: 'GAME_ANALYTICS',
        eventType,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
          difficulty: difficulty.value,
          sessionDuration: performance.now() - sessionStartTime.value
        }
      }, 'http://localhost:4200');
    };

    // Session tracking
    onMounted(() => {
      sendAnalytics('SESSION_START', {
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        userAgent: navigator.userAgent,
        language: navigator.language
      });
    });

    onBeforeUnmount(() => {
      sendAnalytics('SESSION_END', {
        gamesPlayed: gamesPlayed.value,
        averageScore: gamesPlayed.value > 0 ? totalScore.value / gamesPlayed.value : 0,
        totalPlayTime: performance.now() - sessionStartTime.value
      });
    });

    const startGame = () => {
      gameStarted.value = true;
      gameStartTime.value = performance.now();
      gamesPlayed.value++;

      sendAnalytics('GAME_START', {
        gameNumber: gamesPlayed.value,
        difficulty: difficulty.value,
        previousAverageScore: gamesPlayed.value > 1 ? totalScore.value / (gamesPlayed.value - 1) : 0
      });
    };

    const handleGameOver = (score) => {
      const gameDuration = performance.now() - gameStartTime.value;
      totalScore.value += score;

      sendAnalytics('GAME_OVER', {
        score,
        duration: gameDuration,
        gameNumber: gamesPlayed.value,
        averageScore: totalScore.value / gamesPlayed.value,
        status: 'gameover'
      });

      // Also send the original score message for compatibility
      window.parent.postMessage({
        type: 'GAME_SCORE',
        score: score,
        difficulty: difficulty.value,
        status: 'gameover'
      }, 'http://localhost:4200');
    };

    const handleGameWin = (score) => {
      const gameDuration = performance.now() - gameStartTime.value;
      totalScore.value += score;

      sendAnalytics('GAME_WIN', {
        score,
        duration: gameDuration,
        gameNumber: gamesPlayed.value,
        averageScore: totalScore.value / gamesPlayed.value,
        status: 'win'
      });

      // Also send the original score message for compatibility
      window.parent.postMessage({
        type: 'GAME_SCORE',
        score: score,
        difficulty: difficulty.value,
        status: 'win'
      }, 'http://localhost:4200');
    };

    // Track difficulty changes
    const handleDifficultyChange = (newDifficulty) => {
      sendAnalytics('DIFFICULTY_CHANGE', {
        from: difficulty.value,
        to: newDifficulty,
        gamesPlayed: gamesPlayed.value
      });
      difficulty.value = newDifficulty;
    };

    // Handle messages from Angular
    const handleAngularMessage = (event) => {
      if (event.origin !== 'http://localhost:4200') return;

      try {
        if (event.data.type === 'RESET_GAME') {
          gameStarted.value = false;
          sendAnalytics('GAME_RESET', {
            gamesPlayed: gamesPlayed.value,
            lastScore: totalScore.value > 0 ? totalScore.value / gamesPlayed.value : 0
          });
        }
      } catch (error) {
        sendAnalytics('ERROR', {
          message: error.message,
          stack: error.stack,
          context: 'message_handling'
        });
      }
    };

    // Set up message listener
    onMounted(() => {
      window.addEventListener('message', handleAngularMessage);
      
      // Track window focus/blur for engagement metrics
      window.addEventListener('focus', () => {
        sendAnalytics('WINDOW_FOCUS', {
          gamesPlayed: gamesPlayed.value
        });
      });

      window.addEventListener('blur', () => {
        sendAnalytics('WINDOW_BLUR', {
          gamesPlayed: gamesPlayed.value
        });
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener('message', handleAngularMessage);
    });

    // Error boundary
    window.onerror = (message, source, lineno, colno, error) => {
      sendAnalytics('ERROR', {
        message,
        source,
        lineno,
        colno,
        stack: error?.stack,
        context: 'global_error'
      });
    };

    return {
      difficulty,
      gameStarted,
      startGame,
      handleGameOver,
      handleGameWin,
      handleDifficultyChange
    };
  },
};
</script>

<style scoped>
#app {
  font-family: 'Press Start 2P', Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
}

label {
  font-size: 1.2em;
  margin-right: 10px;
  color: #4CAF50;
  text-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

select {
  font-size: 1em;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #4CAF50;
  background-color: #2c3e50;
  color: #fff;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

select:hover {
  border-color: #45a049;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.start-button {
  font-family: 'Press Start 2P', cursive;
  font-size: 1.2em;
  margin-left: 15px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.start-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.start-button:active {
  transform: translateY(1px);
}

.game-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(249, 249, 249, 0.05);
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(76, 175, 80, 0.3);
  border: 2px solid #4CAF50;
  transition: all 0.3s ease;
}

.game-container:hover {
  box-shadow: 0 0 40px rgba(76, 175, 80, 0.4);
}

h2 {
  font-size: 1.8em;
  color: #4CAF50;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 15px;
  }

  .start-button {
    margin-left: 0;
    margin-top: 15px;
  }

  select {
    width: 100%;
    max-width: 200px;
  }
}

/* Add the retro gaming font */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
</style>
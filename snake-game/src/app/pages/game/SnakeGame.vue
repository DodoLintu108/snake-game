<template>
    <div class="game-area">
      <div v-for="(segment, index) in snake" :key="index" class="snake-segment" :style="getSegmentStyle(segment)"></div>
      <div class="apple" :style="getAppleStyle(apple)"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SnakeGame',
    data() {
      return {
        gridSize: 20,
        snake: [{ x: 10, y: 10 }],
        direction: { x: 0, y: -1 },
        apple: { x: 5, y: 5 },
        gameInterval: null,
        gameOver: false,
        score: 0
      };
    },
    mounted() {
      console.log("SnakeGame component has been mounted.");
      this.startGame();
      window.addEventListener('keydown', this.handleKeydown);
    },
    beforeDestroy() {
      clearInterval(this.gameInterval);
      window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
      startGame() {
        console.log("Game started!");
        this.gameInterval = setInterval(this.moveSnake, 200);
      },
      moveSnake() {
        if (this.gameOver) {
          return;
        }
  
        const newHead = {
          x: this.snake[0].x + this.direction.x,
          y: this.snake[0].y + this.direction.y
        };
  
        if (this.isCollision(newHead)) {
          this.endGame();
          return;
        }
  
        this.snake.unshift(newHead);
  
        if (newHead.x === this.apple.x && newHead.y === this.apple.y) {
          this.score += 10;
          console.log("Apple eaten! Current score:", this.score);
          this.generateApple();
        } else {
          this.snake.pop();
        }
      },
      isCollision(head) {
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
          console.warn("Collision with wall detected.");
          return true;
        }
  
        for (let i = 1; i < this.snake.length; i++) {
          if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
            console.warn("Collision with self detected.");
            return true;
          }
        }
        return false;
      },
      generateApple() {
        let newApple;
        do {
          newApple = {
            x: Math.floor(Math.random() * this.gridSize),
            y: Math.floor(Math.random() * this.gridSize)
          };
        } while (this.snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
        this.apple = newApple;
        console.log("New apple generated at:", this.apple);
      },
      handleKeydown(event) {
        switch (event.key) {
          case 'ArrowUp':
            if (this.direction.y === 0) {
              this.direction = { x: 0, y: -1 };
            }
            break;
          case 'ArrowDown':
            if (this.direction.y === 0) {
              this.direction = { x: 0, y: 1 };
            }
            break;
          case 'ArrowLeft':
            if (this.direction.x === 0) {
              this.direction = { x: -1, y: 0 };
            }
            break;
          case 'ArrowRight':
            if (this.direction.x === 0) {
              this.direction = { x: 1, y: 0 };
            }
            break;
        }
      },
      endGame() {
        this.gameOver = true;
        clearInterval(this.gameInterval);
        alert(`Game Over! Your score is ${this.score}`);
      },
      getSegmentStyle(segment) {
        return {
          left: `${segment.x * 25}px`,
          top: `${segment.y * 25}px`,
          width: '25px',
          height: '25px'
        };
      },
      getAppleStyle(apple) {
        return {
          left: `${apple.x * 25}px`,
          top: `${apple.y * 25}px`,
          width: '25px',
          height: '25px',
          backgroundColor: 'red'
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .game-area {
    width: 500px;
    height: 500px;
    background-color: #f9f9f9;
    position: relative;
    border: 2px solid #333;
  }
  
  .snake-segment {
    position: absolute;
    background-color: #2ecc71;
    border-radius: 5px;
  }
  
  .apple {
    position: absolute;
    background-color: red;
    border-radius: 50%;
  }
  </style>
  
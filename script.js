const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const boxSize = 20; 
let snake = [{ x: 200, y: 200 }]; 
let direction = { x: 0, y: 0 }; 
let apple = { x: getRandomPosition(), y: getRandomPosition() }; 
let score = 0;
let speed = 150; 
let gameInterval; 

function getRandomPosition() {
  return Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#4caf50' : '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#4caf50";
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    ctx.shadowBlur = 0;
  });
}

function drawApple() {
  ctx.beginPath();
  ctx.arc(apple.x + boxSize / 2, apple.y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.shadowBlur = 20;
  ctx.shadowColor = "red";
  ctx.fill();
  ctx.closePath();
}

function flashBackground() {
  document.body.style.backgroundColor = '#4caf50';
  setTimeout(() => (document.body.style.backgroundColor = '#1e1e2f'), 100);
}

function updateGame() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head); 

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    document.getElementById('score').innerText = score;
    flashBackground(); 
    apple = { x: getRandomPosition(), y: getRandomPosition() }; 

    if (speed > 50) {
      clearInterval(gameInterval);
      speed -= 5; 
      gameInterval = setInterval(gameLoop, speed);
    }
  } else {
    snake.pop(); 
  }

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    alert('Game Over! Your score: ' + score);
    resetGame();
  }
}

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: 0, y: 0 };
  score = 0;
  speed = 150;
  document.getElementById('score').innerText = score;
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
  drawSnake();
  drawApple();
}

document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -boxSize };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: boxSize };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -boxSize, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: boxSize, y: 0 };
      break;
  }
});

function gameLoop() {
  updateGame();
  drawGame();
}

gameInterval = setInterval(gameLoop, speed);

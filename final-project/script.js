const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 300;
let velocity = 0;
let gravity = 0.5;

let pipes = [];
let score = 0;

let gameRunning = false;

// Start button
document.getElementById("startBtn").onclick = () => {
  resetGame();
  gameRunning = true;
};

// Jump
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    velocity = -8;
  }
});

function resetGame() {
  birdY = 300;
  velocity = 0;
  pipes = [];
  score = 0;
}

// Create pipes
function createPipe() {
  let gap = 150;
  let topHeight = Math.random() * 300 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - gap
  });
}

// Draw bird (styled)
function drawBird() {
  let x = 50;

  // Body
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(x, birdY, 15, 0, Math.PI * 2);
  ctx.fill();

  // Red wing
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x - 5, birdY + 5, 8, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x + 5, birdY - 5, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x + 6, birdY - 5, 2, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(x + 15, birdY);
  ctx.lineTo(x + 25, birdY - 5);
  ctx.lineTo(x + 25, birdY + 5);
  ctx.closePath();
  ctx.fill();
}

// Game loop
function gameLoop() {
  if (gameRunning) {
    velocity += gravity;
    birdY += velocity;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create pipes randomly
    if (Math.random() < 0.02) {
      createPipe();
    }

    // Draw pipes
    ctx.fillStyle = "green";
    for (let i = 0; i < pipes.length; i++) {
      let p = pipes[i];
      p.x -= 2;

      // Top pipe
      ctx.fillRect(p.x, 0, 50, p.top);

      // Bottom pipe
      ctx.fillRect(p.x, canvas.height - p.bottom, 50, p.bottom);

      // Collision
      if (
        50 < p.x + 50 &&
        50 + 30 > p.x &&
        (birdY < p.top || birdY + 30 > canvas.height - p.bottom)
      ) {
        gameRunning = false;
        alert("Game Over! Score: " + score);
      }

      // Score
      if (p.x === 50) {
        score++;
      }
    }

    // Draw bird
    drawBird();

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // Ground collision
    if (birdY > canvas.height) {
      gameRunning = false;
      alert("Game Over! Score: " + score);
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

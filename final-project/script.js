const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 300;
let velocity = 0;
let gravity = 0.5;

let pipes = [];
let clouds = [];

let score = 0;
let gameRunning = false;
let gameStarted = false;

let highScore = localStorage.getItem("highScore") || 0;

let groundX = 0;

// sounds
const jumpSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
const hitSound = new Audio("https://www.soundjay.com/button/beep-10.wav");

// START BUTTON (FIXED)
document.getElementById("startBtn").onclick = () => {
  startGame();
};

function startGame() {
  resetGame();
  gameRunning = true;
  gameStarted = true;
  document.getElementById("gameOverScreen").style.display = "none";
}

// SPACE JUMP
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameRunning) {
    velocity = -8;
    jumpSound.currentTime = 0;
    jumpSound.play().catch(() => {});
  }
});

// RESET (IMPORTANT FIX)
function resetGame() {
  birdY = 300;
  velocity = 0;
  pipes = [];
  clouds = [];
  score = 0;
  groundX = 0;
}

// CLOUDS
function createCloud() {
  clouds.push({
    x: canvas.width + 50,
    y: Math.random() * 180 + 30,
    speed: 0.8,
    size: Math.random() * 15 + 15
  });
}

// PIPES (FIXED + EASIER GAP)
function createPipe() {
  const gap = 230;

  pipes.push({
    x: canvas.width,
    top: Math.random() * 180 + 60,
    gap: gap,
    scored: false
  });
}

// BIRD
function drawBird() {
  const x = 50;

  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(x, birdY, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x - 5, birdY + 5, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(x + 15, birdY);
  ctx.lineTo(x + 25, birdY - 5);
  ctx.lineTo(x + 25, birdY + 5);
  ctx.closePath();
  ctx.fill();
}

// GAME OVER (FIXED)
function gameOver() {
  gameRunning = false;

  hitSound.currentTime = 0;
  hitSound.play().catch(() => {});

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScore").innerHTML =
    "Score: " + score + "<br>High Score: " + highScore;
}

// LOOP
function gameLoop() {
  requestAnimationFrame(gameLoop);

  // BLUE SKY (FIXED FOREVER)
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) return;

  if (gameRunning) {
    velocity += gravity;
    birdY += velocity;

    // ground
    groundX -= 2;
    if (groundX <= -50) groundX = 0;

    ctx.fillStyle = "#8B5A2B";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    ctx.fillStyle = "#228B22";
    ctx.fillRect(groundX, canvas.height - 25, canvas.width, 5);

    // clouds
    if (Math.random() < 0.015) createCloud();

    ctx.fillStyle = "white";
    for (let c of clouds) {
      c.x -= c.speed;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // pipes
    if (Math.random() < 0.02) createPipe();

    ctx.fillStyle = "#2ecc71";

    for (let p of pipes) {
      p.x -= 2;

      const gap = p.gap;
      const bottomY = p.top + gap;

      // top pipe
      ctx.fillRect(p.x, 0, 60, p.top);

      // bottom pipe
      ctx.fillRect(p.x, bottomY, 60, canvas.height);

      // collision
      if (
        50 < p.x + 60 &&
        50 + 30 > p.x &&
        (birdY < p.top || birdY > bottomY)
      ) {
        gameOver();
      }

      // score
      if (!p.scored && p.x < 50) {
        score++;
        p.scored = true;
      }
    }

    drawBird();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }
}

gameLoop();

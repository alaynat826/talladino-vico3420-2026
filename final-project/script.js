const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 300;
let velocity = 0;
let gravity = 0.5;

let pipes = [];
let clouds = [];
let score = 0;

let gameRunning = false;

let highScore = localStorage.getItem("highScore") || 0;
let scoreHistory = [];

let groundX = 0;

// safer sound setup
const jumpSound = new Audio();
jumpSound.src = "https://www.soundjay.com/button/beep-07.wav";

const hitSound = new Audio();
hitSound.src = "https://www.soundjay.com/button/beep-10.wav";

// START
document.getElementById("startBtn").onclick = () => {
  resetGame();
  gameRunning = true;
  document.getElementById("gameOverScreen").style.display = "none";
};

// JUMP
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    velocity = -8;
    jumpSound.currentTime = 0;
    jumpSound.play().catch(() => {});
  }
});

function resetGame() {
  birdY = 300;
  velocity = 0;
  pipes = [];
  clouds = [];
  score = 0;
}

// CLOUDS (FIXED)
function createCloud() {
  clouds.push({
    x: canvas.width + 50,
    y: Math.random() * 180 + 20,
    speed: 0.8,
    size: Math.random() * 20 + 20
  });
}

// PIPES (FIXED + BIGGER GAP)
function createPipe() {
  const gap = 220; // BIGGER + MORE PLAYABLE

  const topHeight = Math.random() * 200 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
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

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x + 6, birdY - 5, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x + 7, birdY - 5, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(x + 15, birdY);
  ctx.lineTo(x + 25, birdY - 5);
  ctx.lineTo(x + 25, birdY + 5);
  ctx.closePath();
  ctx.fill();
}

// GAME OVER
function gameOver() {
  gameRunning = false;

  hitSound.currentTime = 0;
  hitSound.play().catch(() => {});

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  scoreHistory.push(score);

  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScore").innerHTML =
    `Score: ${score}<br>High Score: ${highScore}`;

  drawChart();
}

// RESTART
function restartGame() {
  resetGame();
  gameRunning = true;
  document.getElementById("gameOverScreen").style.display = "none";
}

// CHART
function drawChart() {
  const ctx2 = document.getElementById("scoreChart").getContext("2d");

  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: scoreHistory.map((_, i) => "Game " + (i + 1)),
      datasets: [{
        label: "Scores",
        data: scoreHistory
      }]
    }
  });
}

// LOOP
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    // CLOUDS (NOW WORKS)
    if (Math.random() < 0.015) createCloud();

    for (let c of clouds) {
      c.x -= c.speed;

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // PIPES (REALISTIC + CAPS)
    if (Math.random() < 0.02) createPipe();

    for (let p of pipes) {
      p.x -= 2;

      const gap = p.gap;

      // top pipe
      ctx.fillStyle = "#2ecc71";
      ctx.fillRect(p.x, 0, 60, p.top);

      // pipe cap
      ctx.fillStyle = "#27ae60";
      ctx.fillRect(p.x - 5, p.top - 20, 70, 20);

      // bottom pipe
      const bottomY = p.top + gap;
      ctx.fillStyle = "#2ecc71";
      ctx.fillRect(p.x, bottomY, 60, canvas.height);

      // bottom cap
      ctx.fillStyle = "#27ae60";
      ctx.fillRect(p.x - 5, bottomY, 70, 20);

      // collision
      if (
        50 < p.x + 60 &&
        50 + 30 > p.x &&
        (birdY < p.top || birdY > bottomY)
      ) {
        gameOver();
      }

      // score fix
      if (!p.scored && p.x < 50) {
        score++;
        p.scored = true;
      }
    }

    drawBird();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    if (birdY > canvas.height) {
      gameOver();
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

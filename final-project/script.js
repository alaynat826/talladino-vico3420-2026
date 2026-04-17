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
let scoreHistory = [];

let chartInstance = null;

document.getElementById("startBtn").onclick = () => {
  startGame();
};

function startGame() {
  resetGame();
  gameRunning = true;
  gameStarted = true;
  document.getElementById("gameOverScreen").style.display = "none";
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameRunning) {
    velocity = -8;
  }
});

function resetGame() {
  birdY = 300;
  velocity = 0;
  pipes = [];
  clouds = [];
  score = 0;
}

function createCloud() {
  clouds.push({
    x: canvas.width + 50,
    y: Math.random() * 180 + 30,
    speed: 0.8,
    size: Math.random() * 15 + 15
  });
}

function createPipe() {
  pipes.push({
    x: canvas.width,
    top: Math.random() * 180 + 60,
    gap: 230,
    scored: false
  });
}

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

function gameOver() {
  gameRunning = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  scoreHistory.push(score);

  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScore").innerHTML =
    "Score: " + score + "<br>High Score: " + highScore;

  drawChart();
}

function drawChart() {
  const ctx2 = document.getElementById("scoreChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx2, {
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

function gameLoop() {
  requestAnimationFrame(gameLoop);

  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) return;

  if (gameRunning) {
    velocity += gravity;
    birdY += velocity;

    if (Math.random() < 0.015) createCloud();

    ctx.fillStyle = "white";
    for (let c of clouds) {
      c.x -= c.speed;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (Math.random() < 0.02) createPipe();

    ctx.fillStyle = "green";

    for (let p of pipes) {
      p.x -= 2;

      const bottom = p.top + p.gap;

      ctx.fillRect(p.x, 0, 60, p.top);
      ctx.fillRect(p.x, bottom, 60, canvas.height);

      if (
        50 < p.x + 60 &&
        50 + 30 > p.x &&
        (birdY < p.top || birdY > bottom)
      ) {
        gameOver();
      }

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

function startGame() {
  resetGame();
  gameRunning = true;
  gameStarted = true;
  document.getElementById("gameOverScreen").style.display = "none";
}

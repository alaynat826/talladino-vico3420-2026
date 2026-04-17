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

let jumpSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
let hitSound = new Audio("https://www.soundjay.com/button/beep-10.wav");

document.getElementById("startBtn").onclick = () => {
  resetGame();
  gameRunning = true;
  document.getElementById("gameOverScreen").style.display = "none";
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    velocity = -8;
    jumpSound.play();
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
    x: canvas.width,
    y: Math.random() * 200 + 20,
    speed: 1
  });
}

function createPipe() {
  pipes.push({
    x: canvas.width,
    top: Math.random() * 250 + 50,
    scored: false
  });
}

function drawBird() {
  let x = 50;

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
  hitSound.play();

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

function restartGame() {
  resetGame();
  gameRunning = true;
  document.getElementById("gameOverScreen").style.display = "none";
}

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

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameRunning) {
    velocity += gravity;
    birdY += velocity;

    groundX -= 2;
    if (groundX <= -50) groundX = 0;

    ctx.fillStyle = "#8B5A2B";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    ctx.fillStyle = "#228B22";
    ctx.fillRect(groundX, canvas.height - 25, canvas.width, 5);

    if (Math.random() < 0.01) {
      createCloud();
    }

    ctx.fillStyle = "white";
    for (let c of clouds) {
      c.x -= c.speed;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    if (Math.random() < 0.02) {
      createPipe();
    }

    ctx.fillStyle = "green";
    for (let p of pipes) {
      p.x -= 2;

      let gap = 200;

      ctx.fillRect(p.x, 0, 50, p.top);
      ctx.fillRect(p.x, p.top + gap, 50, canvas.height);

      if (
        50 < p.x + 50 &&
        50 + 30 > p.x &&
        (birdY < p.top || birdY > p.top + gap)
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

    if (birdY > canvas.height) {
      gameOver();
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

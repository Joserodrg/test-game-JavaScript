const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player properties
const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    color: 'white',
    dy: 0
};

// Obstacle properties
const obstacles = [];
const obstacleWidth = 20;
const obstacleHeight = 100;
const obstacleGap = 200;
let obstacleSpeed = 2;

// Game properties
let isGameOver = false;
let score = 0;

// Handle player movement
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
        player.dy = -5;
    } else if (e.code === 'ArrowDown') {
        player.dy = 5;
    }
});

document.addEventListener('keyup', () => {
    player.dy = 0;
});

// Game loop
function gameLoop() {
    if (isGameOver) {
        alert('Game Over! Your score: ' + score);
        document.location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Update player position
    player.y += player.dy;

    // Prevent player from going out of bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Generate obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - obstacleGap) {
        const obstacleY = Math.random() * (canvas.height - obstacleHeight);
        obstacles.push({ x: canvas.width, y: obstacleY });
    }

    // Draw and update obstacles
    ctx.fillStyle = 'red';
    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        ctx.fillRect(obs.x, obs.y, obstacleWidth, obstacleHeight);

        // Move obstacle
        obs.x -= obstacleSpeed;

        // Check for collision
        if (
            player.x < obs.x + obstacleWidth &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obstacleHeight &&
            player.y + player.height > obs.y
        ) {
            isGameOver = true;
        }

        // Remove offscreen obstacles
        if (obs.x + obstacleWidth < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    // Increase difficulty
    obstacleSpeed += 0.001;

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

gameLoop();
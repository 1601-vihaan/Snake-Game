const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let dx = 0;
let dy = 0;
let appleX;
let appleY;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let changingDirection = false;

highScoreElement.textContent = `High Score: ${highScore}`;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1; // start moving right
    dy = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    gameOverScreen.classList.add('hidden');
    spawnApple();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(draw, 100);
}

function draw() {
    changingDirection = false;
    
    if (hasGameEnded()) {
        gameOver();
        return;
    }
    
    clearCanvas();
    drawApple();
    moveSnake();
    drawSnake();
}

function clearCanvas() {
    // Light green background
    ctx.fillStyle = '#a2d149'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw checkerboard pattern for better visibility (like Google Snake)
    ctx.fillStyle = '#aad751';
    for (let row = 0; row < tileCount; row++) {
        for (let col = 0; col < tileCount; col++) {
            if ((row + col) % 2 === 0) {
                ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }
}

function drawSnake() {
    snake.forEach((part, index) => {
        // Snake is blue
        ctx.fillStyle = index === 0 ? '#1f487e' : '#376996';
        ctx.strokeStyle = '#a2d149'; // outline
        
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    if (head.x === appleX && head.y === appleY) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        spawnApple();
    } else {
        snake.pop();
    }
}

function drawApple() {
    ctx.fillStyle = '#e7471d'; // Red apple
    
    ctx.beginPath();
    ctx.arc(
        appleX * gridSize + gridSize / 2, 
        appleY * gridSize + gridSize / 2, 
        gridSize / 2 - 2, 
        0, 
        2 * Math.PI
    );
    ctx.fill();
}

function spawnApple() {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    
    // Ensure apple doesn't spawn on snake
    for (let part of snake) {
        if (part.x === appleX && part.y === appleY) {
            spawnApple();
            return;
        }
    }
}

function hasGameEnded() {
    // Wall collision
    if (
        snake[0].x < 0 || 
        snake[0].x >= tileCount || 
        snake[0].y < 0 || 
        snake[0].y >= tileCount
    ) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    
    return false;
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverScreen.classList.remove('hidden');
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = `High Score: ${highScore}`;
    }
}

document.addEventListener('keydown', (e) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    
    if (changingDirection) return;
    
    const keyPressed = e.key;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    
    if ((keyPressed === 'ArrowLeft' || keyPressed === 'a') && !goingRight) {
        dx = -1;
        dy = 0;
        changingDirection = true;
    }
    if ((keyPressed === 'ArrowUp' || keyPressed === 'w') && !goingDown) {
        dx = 0;
        dy = -1;
        changingDirection = true;
    }
    if ((keyPressed === 'ArrowRight' || keyPressed === 'd') && !goingLeft) {
        dx = 1;
        dy = 0;
        changingDirection = true;
    }
    if ((keyPressed === 'ArrowDown' || keyPressed === 's') && !goingUp) {
        dx = 0;
        dy = 1;
        changingDirection = true;
    }
});

restartBtn.addEventListener('click', initGame);

// Start game
initGame();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Yüksek çözünürlük için canvas boyutunu ayarlayın
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gridSize = 20;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = { x: gridSize, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let speed = 100; // Başlangıç hızı

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Yılanı çiz
    ctx.fillStyle = 'lime';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });

    // Yemi çiz (nokta şeklinde)
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 4, 0, Math.PI * 2);
    ctx.fill();

    // Skoru göster
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Puan: ${score}`, 10, 30);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Yılanın kendine çarpması
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        resetGame();
        return;
    }

    // Yılanın duvara çarpması
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        resetGame();
        return;
    }

    snake.unshift(head);

    // Yılanın yemi yemesi
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        placeFood();
        speed = Math.max(50, speed - 5); // Hızı artır
    } else {
        snake.pop();
    }
}

function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    speed = 100; // Hızı sıfırla
    placeFood();
}

function changeDirection(event) {
    switch (event.keyCode) {
        case 37: // sol
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 38: // yukarı
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 39: // sağ
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
        case 40: // aşağı
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
    }
}

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, speed);
}

placeFood();
gameLoop();

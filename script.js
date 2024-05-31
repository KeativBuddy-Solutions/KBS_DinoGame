const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 200;

let score = 0;
let gameSpeed = 3;
let gravity = 0.5;

class Character {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = 50;
        this.y = canvas.height - this.height;
        this.dy = 0;
        this.jumpPower = 10;
        this.isJumping = false;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.dy = -this.jumpPower;
        }
    }

    update() {
        if (this.isJumping) {
            this.y += this.dy;
            this.dy += gravity;
            if (this.y + this.height >= canvas.height) {
                this.y = canvas.height - this.height;
                this.isJumping = false;
            }
        }
        this.draw();
    }
}

class Obstacle {
    constructor() {
        this.width = 20;
        this.height = Math.random() * (50 - 20) + 20;
        this.x = canvas.width;
        this.y = canvas.height - this.height;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= gameSpeed;
        this.draw();
    }
}

let player = new Character();
let obstacles = [];
let gameInterval;

function spawnObstacle() {
    obstacles.push(new Obstacle());
}

function updateScore() {
    score++;
    document.getElementById('score').innerText = score;
}

function checkCollision(player, obstacle) {
    return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    );
}

function gameOver() {
    clearInterval(gameInterval);
    alert('Game Over! Final Score: ' + score);
    document.location.reload();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();

    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        if (checkCollision(player, obstacle)) {
            gameOver();
        }
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            updateScore();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        player.jump();
    }
});

gameInterval = setInterval(() => {
    update();
    if (Math.random() < 0.02) {
        spawnObstacle();
    }
}, 1000 / 60);
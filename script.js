let board, context, dinoImg, cactus1Img, cactus2Img, cactus3Img;
let boardWidth = 750, boardHeight = 250;
let dinoWidth = 88, dinoHeight = 94, dinoX = 50, dinoY = boardHeight - dinoHeight;
let dino = { x: dinoX, y: dinoY, width: dinoWidth, height: dinoHeight };
let cactusArray = [], velocityX = -8, velocityY = 0, gravity = 0.4;
let gameOver = false, score = 0;
let restartButton;

const cactusTypes = [
    { imgSrc: "./img/cactus1.png", width: 34, height: 70 },
    { imgSrc: "./img/cactus2.png", width: 69, height: 70 },
    { imgSrc: "./img/cactus3.png", width: 102, height: 70 }
];

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 

    dinoImg = loadImage("./img/dino.png", () => drawImage(dinoImg, dino));

    cactus1Img = loadImage(cactusTypes[0].imgSrc);
    cactus2Img = loadImage(cactusTypes[1].imgSrc);
    cactus3Img = loadImage(cactusTypes[2].imgSrc);

    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", restartGame);

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", moveDino);
}

function loadImage(src, onload) {
    let img = new Image();
    img.src = src;
    if (onload) img.onload = onload;
    return img;
}

function drawImage(img, obj) {
    context.drawImage(img, obj.x, obj.y, obj.width, obj.height);
}

function update() {
    if (gameOver) return;
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    drawImage(dinoImg, dino);

    for (let cactus of cactusArray) {
        cactus.x += velocityX;
        drawImage(cactus.img, cactus);
        if (detectCollision(dino, cactus)) endGame();
    }

    score++; // Increment score
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText(`Score: ${score}`, 5, 20);

    if (gameOver) {
        context.fillStyle = "red";
        context.font = "40px courier";
        context.fillText("Game Over", boardWidth / 2 - 100, boardHeight / 2);
    }
}

function moveDino(e) {
    if (gameOver || dino.y != dinoY) return;
    if (e.code === "Space" || e.code === "ArrowUp") velocityY = -10;
}

function placeCactus() {
    if (gameOver) return;
    let rand = Math.random();
    let type = rand > 0.9 ? 2 : rand > 0.7 ? 1 : rand > 0.5 ? 0 : -1;
    if (type === -1) return;

    let cactusType = cactusTypes[type];
    cactusArray.push({
        img: [cactus1Img, cactus2Img, cactus3Img][type],
        x: boardWidth,
        y: dinoY + dinoHeight - cactusType.height,
        width: cactusType.width,
        height: cactusType.height
    });

    if (cactusArray.length > 5) cactusArray.shift();
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function endGame() {
    gameOver = true;
    dinoImg.src = "./img/dino-dead.png";
    dinoImg.onload = () => drawImage(dinoImg, dino);
}

function restartGame() {
    score = 0;
    cactusArray = [];
    velocityY = 0;
    gameOver = false;
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = () => drawImage(dinoImg, dino);
    requestAnimationFrame(update);
}

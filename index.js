// -------- Selecionar elementos do DOM -------- 

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// -------- Variáveis de controle do jogo -------- 

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

//  -------- Obter o high score do armazenamento local -------- 

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Pontuação Máxima: ${highScore}`;

//  -------- Gerar posição aleatória para a comida -------- 

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

//  -------- Lidar com o fim do jogo -------- 

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Pressione OK para jogar novamente...");
    location.reload();
}

//  -------- Alterar a direção com base na tecla pressionada -------- 

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// --------  Alterar a direção ao clicar em cada tecla -------- 

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

//  -------- Iniciar o jogo -------- 

const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //  -------- Quando a cobra come a comida -------- 
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Adicionar comida ao corpo da cobra
        score++;
        highScore = score >= highScore ? score : highScore; // Se a pontuação for maior que a pontuação máxima, a pontuação máxima é atualizada

        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Pontuação: ${score}`;
        highScoreElement.innerText = `Pontuação Máxima: ${highScore}`;
    }

    // --------  Atualizar a cabeça da cobra -------- 

    snakeX += velocityX;
    snakeY += velocityY;

    // --------  Deslocar os valores dos elementos no corpo da cobra para a frente -------- 

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    //  -------- Verificar se a cobra atingiu a parede -------- 
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    //  -------- Adicionar div para cada parte do corpo da cobra -------- 

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Verificar se a cabeça da cobra atingiu o corpo
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

//  -------- Inicializar a posição da comida e o intervalo do jogo -------- 
updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);

// DEFINIR ELEMENTOS HTML

const borda = document.getElementById('borda-game');
const intrucao = document.getElementById('instrucoes');
const intrucao2 = document.getElementById('instrucoes2');
const logo = document.getElementById('logo');
const pontos = document.getElementById('pontuacao');
const recordTexto = document.getElementById('record');

// Definir variaveis do jogo
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let comida = gerarComida();
let record = 0;
let direcao = 'up';
let gameInterval;
let gameSpeedDelay = 200;
let gamerStarted = false;

// desenhar mapa do game, cobra e comida
function draw(){
    borda.innerHTML = '';
    drawSnake();
    drawComida();
    atualizarPontos();
}

// desenhar snake
function drawSnake(){
    snake.forEach((segmento) => {
        const snakeElemento = createGameElemento('div', 'snake');
        setPosition(snakeElemento, segmento);
        borda.appendChild(snakeElemento);
    })
}

// Criar snake ou comida ou div
function createGameElemento(tag, className){
    const elemento = document.createElement(tag);
    elemento.className = className;
    return elemento;
}

// definir a posicao do Snake ou comida
function setPosition(elemento, position){
    elemento.style.gridColumn = position.x;
    elemento.style.gridRow = position.y;
}

// Testando funcao Draw
// draw();

// Desenhar comida
function drawComida(){
    if(gamerStarted){
    const comidaElemento = createGameElemento('div', 'comida');
    setPosition(comidaElemento, comida);
    borda.appendChild(comidaElemento);
    }
}

// gerar comida em posicoes aleatorias
function gerarComida(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

// mover o Snake
function mover(){
    const head = { ...snake[0]};
    switch (direcao) {
        case 'up':
            head.y--;
        break;
        case 'down':
            head.y++;
        break;
        case 'right':
            head.x++;
        break;
        case 'left':
            head.x--;
        break;
    }
    snake.unshift(head);

    //snake.pop();

    if (head.x === comida.x && head.y === comida.y){
        comida = gerarComida();
        aumentarSpeed();
        clearInterval(gameInterval); //limpar intervalo passado
        gameInterval = setInterval(() => {
            mover();
            checarColisao();
            draw();
        }, gameSpeedDelay);
    } else{
        snake.pop();
    }
}

//testar mover
// setInterval(() => {
//     mover(); //mover primeiro
//     draw();
// }, 200);

//funcao de dar start no jogo
function startGame(){
    gamerStarted = true;
    intrucao.style.display = 'none';
    intrucao2.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() =>{
        mover();
        checarColisao();
        draw();
    }, gameSpeedDelay);
}

// pressionar teclas event listner
function manterTecla(event){
    if((!gamerStarted && event.code === 'Space') || (!gamerStarted && event.key === ' ')){
        startGame();
    }else{
        switch (event.key) {
            case 'w':
            direcao = 'up';
            break;
            case 's':
            direcao = 'down';
            break;
            case 'd':
            direcao = 'right';
            break;
            case 'a':
            direcao = 'left';
            break;
        }
    }
}

document.addEventListener('keydown', manterTecla);

// Ajustar Velocidade do Game
function aumentarSpeed(){
    //console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }else if(gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checarColisao(){
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetarJogo();
    }

    for( let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetarJogo();
        }
    }
}

function resetarJogo(){
    atualizarRecord();
    snake = [{x: 10, y: 10}];
    gerarComida();
    direcao = 'up';
    gameSpeedDelay = 200;
    atualizarPontos();
    pararJogo();
}

function atualizarPontos(){
    const pontuacaoCorreta = snake.length - 1;
    pontos.textContent = pontuacaoCorreta.toString().padStart(3,'0');
}

function pararJogo(){
    clearInterval(gameInterval);
    gamerStarted = false;
    intrucao.style.display = 'block';
    intrucao2.style.display = 'block';
    logo.style.display = 'block';
}

function atualizarRecord(){
    const pontuacaoCorreta = snake.length -1;
    if (pontuacaoCorreta > record){
        record = pontuacaoCorreta;
        recordTexto.textContent = record.toString().padStart(3,'0');
    }

    recordTexto.style.display = 'block';
}
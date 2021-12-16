const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
const gameOverButton =  document.querySelector('.game-over');
let alienInterval;

// Movimento e tiro da nave
function flyShip(event) {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveUp();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveDown();
  } else if (event.key === " ") {
    event.preventDefault();
    fireLaser();
  }
}


// Função de subir
function moveUp() {
  // Vamos trazer o estilo da nave
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');//pegando o valor do top em STRING
  if (topPosition === '0px') {
    return
  } else {
    let position = parseInt(topPosition);
    position -= 50;//vai subir bastante pq de um em um vai muito pouco
    yourShip.style.top = `${position}px`;
  }
}

// Função de descer
function moveDown() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
  if (topPosition === '510px') {
    return;
  } else {
    let position = parseInt(topPosition);
    position += 30;
    yourShip.style.top = `${position}px`;
  }
}


// Funcionalidade de tiro
function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

function createLaserElement() {
  let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
  let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
  let newLaser = document.createElement('img');
  newLaser.src = 'img/shoot.png';
  newLaser.classList.add('laser');
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;//pra ficar no meio da nave dando a impressão que está saindo o laser do meio da nave
  return newLaser;
}

function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => {//comparando se cada alien foi atingido, se sim, troca o src da imagem
      if(checkLaserCollision(laser, alien)) {
        alien.src = 'img/explosion.png';
        alien.classList.remove('alien');
        alien.classList.add('dead-alien');
      }
    })
    if (xPosition === 340) {//se estiver la no final da largura REMOVE
      laser.remove();//se for 340 ou seja já passou toda a largura esse LASER então podemos REMOVELO
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10)
}

// Função para criar inimigos aleatórios
// Sorteio do alienigena que irá aparecer
function createAliens() {
  let newAlien = document.createElement('img');
  // Abaixo temos o sorteio de imagens
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]//sorteio de número do tamanho do array, e vamos arredondar pra baixo
  newAlien.src = alienSprite;
  newAlien.classList.add('alien');
  newAlien.classList.add('alien-transition');
  newAlien.style.left = '370px';
  newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;//o top será random pode vir em baixo ou encima
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}


//Função para movimentar os inimigos
function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
    if (xPosition <= 50) {//ou seja chegou bem perto da nossa NAVE então GAME-OVER
      if (Array.from(alien.classList).includes('dead-alien')) {
        alien.remove();//isso significa que conseguimos atirar no alien e removemos esse alien do jogo
      } else {// senão quer dizer que o alien chegou na nossa nave e deu GAME-OVER
        gameOver();
      }
    } else {//ainda não atingiu 50px na esquerda
      alien.style.left = `${xPosition - 4}px`;
    }
  }, 30);
}


// Função para colisão
function checkLaserCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserBottom = laserTop - 20;
  let alienTop = parseInt(alien.style.top);
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop - 30;
  if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
    if(laserTop <= alienTop && laserTop >= alienBottom) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}


//Inicio do jogo
startButton.addEventListener('click', (event) => {
  playGame();
})

function playGame() {
  gameOverButton.classList.remove('active');
  startButton.style.display = 'none';
  instructionsText.style.display = 'none';
  window.addEventListener('keydown', flyShip);
  alienInterval = setInterval(() => {
    createAliens();
  }, 2000);
}


// Função de game over
function gameOver() {
  window.removeEventListener('keydown', flyShip);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll('.alien');
  aliens.forEach((alien) => {
    alien.remove();
  })
  let lasers = document.querySelectorAll('.laser');
  lasers.forEach((laser) => laser.remove());
  setTimeout(() => {
    gameOverButton.classList.add('active');
    yourShip.style.top = '250px';
    startButton.style.display = 'block';
    instructionsText.style.display = 'block';
  });
}

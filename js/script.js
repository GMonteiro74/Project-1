const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
let hiScoreValue = 0;

let frequencyModule;

let right; // Para movimento do Boss

let currentGame;
let animationId;

// All the music
let bass = new Audio(src="/music/Pad_and_Bass Copy.wav");
let drums = new Audio(src="/music/drums.mp3");
let melody = new Audio(src="/music/melody.mp3");
let bossBells = new Audio(src="/music/boss.mp3");
let notes = new Audio(src="/music/5 notes Copy.wav");
let win = new Audio(src="/music/Victory.wav");
let over = new Audio(src="/music/GameOver Copy.wav");


let score = document.getElementById("score");
let lives = document.getElementById("lives");
let hiScore = document.querySelector('#hiScore');
let overCanvas = document.querySelector('#overCanvas');
let idLevel = document.querySelector('#level');

lives.innerText = 5;
score.innerText = 0;
hiScore.innerText = hiScoreValue;


const startBtn = document.querySelector('#start');
startBtn.onclick = () => {
    startGame();
}


function startGame() {
    bass.pause();
    drums.pause();
    melody.pause();
    bossBells.pause();
    win.pause();
    over.pause();
    over.load();
    bass.load();
    drums.load();
    melody.load();
    bossBells.load();
    win.load();
    played = true;
    currentGame = new Game();
    currentGame.ship = new Player();
    currentGame.boss = new Boss(canvasWidth / 2 - 40, -90);
    currentGame.boss.draw();
    currentGame.ship.draw();
    overCanvas.style.display = 'none';
    cancelAnimationFrame(animationId);
    updateCanvas();
}


let played;

// test1.addEventListener('ended', function() {
//     test3.play();
// }, false);

// document.onload = function() {
//     test3.play();
// }

function sound() {
    if (currentGame.level === 1 && currentGame.bossStage === false && currentGame.gameOver === false) {
        drums.pause();
        melody.pause();
        bossBells.pause();
        win.pause();
        over.pause();
        bass.play();

    } else if (currentGame.level === 2 && currentGame.bossStage === false && currentGame.gameOver === false) {
        bass.pause();
        melody.pause();
        bossBells.pause();
        win.pause();
        over.pause();
         if (played === true) {
            notes.play();
             played = false 
         } else {
            notes.addEventListener('ended', function() {
                drums.play();
            }, false);
        }
    } else if (currentGame.level === 3 && currentGame.bossStage === false && currentGame.gameOver === false) {
        bass.pause();
        drums.pause();
        bossBells.pause();
        win.pause();
        over.pause();
        if (played === false) {
            notes.play();
            played = true 
        } else {
            notes.addEventListener('ended', function() {
                melody.play();
            }, false);
        }
    } else if (currentGame.bossStage === true && currentGame.gameWin === false && currentGame.gameOver === false) {
        bass.pause();
        drums.pause();
        melody.pause();
        win.pause();
        over.pause();
        if (played === true) {
            notes.play();
            played = false 
        } else {
            notes.addEventListener('ended', function() {
                bossBells.play();
            }, false);
        
        }
    } else if (currentGame.gameWin === true) {
        bass.pause();
        drums.pause();
        melody.pause();
        bossBells.pause();
        over.pause();
        win.play();        
    } else if (currentGame.gameOver === true) {

        bass.pause();
        drums.pause();
        melody.pause();
        bossBells.pause();
        win.pause();
        over.play();        
    }
    console.log(currentGame.level, currentGame.bossStage);
}

function shot(key) {

    if (!currentGame.gameOver && !currentGame.gameWin) //Para não haver tiros depois de gameOver/gameWin
        if (key === "ArrowUp") {
            const newShot = new Bullet((currentGame.ship.x + (currentGame.ship.width / 2 - 2)), currentGame.ship.y);
            currentGame.bullet.push(newShot);
        }

        for (const shots of currentGame.bullet) {
            shots.y -= 2;
            shots.draw();
        }
            
}


function changeLevels() { // Qualquer mudança aqui foi só nos scores, para efeitos de teste. nada de relevante.

    if (currentGame.score < 1) {
        frequencyModule = 160;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.692),rgba(46, 46, 46, 0.692)), url(images/lv1.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else if (currentGame.score < 2 && currentGame.score > 0) {
        frequencyModule = 120;
        currentGame.level = 2;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.692),rgba(46, 46, 46, 0.692)), url(images/lv2.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else if (currentGame.score < 3 && currentGame.score > 1) {
        frequencyModule = 80;
        currentGame.level = 3;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.692),rgba(46, 46, 46, 0.692)), url(images/lv3.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else {
        currentGame.bossStage = true;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.692),rgba(46, 46, 46, 0.692)), url(images/bosslvl.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';
        currentGame.boss.move();
        currentGame.boss.draw();
        }

 }



function drawEnemies() {

    currentGame.enemiesFrequency++;
  
    if (!currentGame.bossStage && currentGame.gameOver === false && currentGame.gameWin === false) { 
                
        if (currentGame.enemiesFrequency % frequencyModule === 0) {

            const randomEnemyX = Math.floor(Math.random() * 550);
        
            const newEnemy = new Enemy(randomEnemyX, 0, 40, 35, "green");

            currentGame.enemies.push(newEnemy);
        }
    } 
    
    currentGame.enemies.forEach(((enemy, index) => { // Tirei este forEach do loop acima, para que os inimigos não desapareçam quando vier o bossStage. Funciona na perfeição.
        
        if (currentGame.level === 1) { // Inimigos mais rápidos com o passar dos níveis.
            enemy.y += 0.4;
        } else if (currentGame.level === 2) {
            enemy.y += 0.5;
        } else if (currentGame.level === 3) {
            enemy.y += 0.6;
        }
        
        
        enemy.draw();
        

        if (detectCollision(enemy)){
            currentGame.enemiesFrequency = 0;
            currentGame.enemies = [];
            gameOver();         
        }
        
        if (enemy.y > canvasHeight) {   
            currentGame.lives--;
            lives.innerText = currentGame.lives;
            currentGame.enemies.splice(index, 1);
        }

        // if (currentGame.lives <= 0) {
        //     gameOver();
        // }
        
    }))
    
    if (currentGame.gameOver === false && currentGame.gameWin === false && currentGame.bossStage) {

        if (currentGame.boss.health > 50) {
            if (currentGame.enemiesFrequency % 46 === 0) {
                const newBossShot = new BossShot(currentGame.boss.x + 42, (currentGame.boss.y + currentGame.boss.height), 10, 7, "orange");
                currentGame.bossShots.push(newBossShot);
            }
        } else { // para a frequencia dos tiros do Boss aumentar quando começam a ir para os lados. Pode ser reduzido com uma variavel para o módulo.
            if (currentGame.enemiesFrequency % 25 === 0) {
                const newBossShot = new BossShot(currentGame.boss.x + 42, (currentGame.boss.y + currentGame.boss.height), 10, 7, "orange");
                currentGame.bossShots.push(newBossShot);
            }
        }

        currentGame.bossShots.forEach(((shot, index) => {
            if (currentGame.boss.health > 70) { 
            shot.y += 1.2;
            } else if (currentGame.boss.health > 50) {
            shot.y += 1.4;
            } else {
                
                if (index % 4 === 0) {
                    shot.x += 0.4;
                    shot.y += 1.4;
                } else if (index % 5 === 0) {
                    shot.x -= 0.4;
                    shot.y += 1.4;
                } else {
                    shot.y += 1.6;
                }
            }

            shot.draw();

            if (detectCollision(shot)){
                currentGame.enemiesFrequency = 0;
                currentGame.bossShots = [];
                gameOver();         
            }
        }))     
    }

}



function detectCollision(enemy) {
    
    return !(
        currentGame.ship.left() > enemy.right() ||
        currentGame.ship.right() < enemy.left() ||
        currentGame.ship.top() > enemy.bottom() ||
        currentGame.ship.bottom() < enemy.top() 
    )

}



function shotEnemy() {

    currentGame.bullet.forEach((shot, indexShot) => {
        if (shot.bottom() < 0) {
            currentGame.bullet.splice(indexShot, 1);
        }
        currentGame.enemies.forEach((enemy, indexEnemy) => {
            if (
                shot.top() < enemy.bottom() &&
                shot.right() > enemy.left() &&
                shot.left() < enemy.right()
                ) {
                currentGame.bullet.splice(indexShot, 1);
                currentGame.enemies.splice(indexEnemy, 1);
                currentGame.score++;
                score.innerText = currentGame.score;
                
            }
            
        })

        if (
            shot.top() < currentGame.boss.bottom() &&
            shot.right() > currentGame.boss.left() &&
            shot.left() < currentGame.boss.right()
        ) {
            currentGame.boss.health -= 1;
            currentGame.bullet.splice(indexShot, 1);
            console.log(currentGame.boss.health); //

        }
        
    })

    if (currentGame.boss.health <= 0) {
        gameWin();
    }
        
}



function gameWin() { // Sei que adicionei aqui umas coisas, mas não retirei nada.

    checkHiScore(); // Meti aqui esta
    currentGame.gameWin = true;
    currentGame.enemiesFrequency = 0;
    currentGame.boss = {};
    currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
    currentGame.bullet = [];
    score.innerText = 0;
    lives.innerText = 5;
    overCanvas.innerText = 'YOU WIN'
    overCanvas.style.display = 'block';
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    cancelAnimationFrame(animationId);
    

}



function checkHiScore() {
    if (currentGame.score > hiScoreValue) {
        hiScoreValue = currentGame.score;
        hiScore.innerText = hiScoreValue;
    }
}



function gameOver() { // Sei que adicionei aqui umas coisas, mas não retirei nada.

    checkHiScore();
    currentGame.gameOver = true;
    currentGame.enemiesFrequency = 0;
    currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
    currentGame.boss = {};
    currentGame.bullet = [];
    score.innerText = 0;
    lives.innerText = 5;
    overCanvas.innerText = 'GAME OVER'
    overCanvas.style.display = 'block';
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    cancelAnimationFrame(animationId);
    
}



function updateCanvas() {

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.ship.draw();
    smoothMovement(); // adicionei só aqui a função
    drawEnemies();
    shot();
    shotEnemy();
    changeLevels();
    sound();
    idLevel.innerText = currentGame.level;
    if (currentGame.gameOver === false || currentGame.gameWin === false) {
    animationId = requestAnimationFrame(updateCanvas);
    }

}
    

function smoothMovement() {  // Esta função pressupõem umas ligeiras alterações ao move() do player como estava anteriormente.

    if (currentGame.ship.x >= (canvasWidth - (currentGame.ship.width + 5))) {
        
        currentGame.ship.x = canvasWidth - (currentGame.ship.width + 5);
        
    } else if (currentGame.ship.x <= 5) {
        
        currentGame.ship.x = 5;
        
    }

    currentGame.ship.speed *= currentGame.ship.friction; // Isto é para o speed ir diminuindo quando largas a tecla
    currentGame.ship.x += currentGame.ship.speed;
}




document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);
})




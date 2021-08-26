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
// All the music


let score = document.getElementById("score");
let lives = document.getElementById("lives");
let hiScore = document.querySelector('#hiScore');
let overCanvas = document.querySelector('#overCanvas');
let idLevel = document.querySelector('#level');

lives.innerText = 1;
score.innerText = 0;
hiScore.innerText = hiScoreValue;


const startBtn = document.querySelector('#start');
startBtn.onclick = () => {
    startGame();
}


function startGame() {
    loadSounds();
    played = true;
    currentGame = new Game();
    currentGame.ship = new Player();
    currentGame.boss = new Boss(canvasWidth / 2 - 40, -90);
    currentGame.ship.draw();
    overCanvas.style.display = 'none';
    cancelAnimationFrame(animationId);
    updateCanvas();
}


let played; // To avoid a loop of the 3 notes transition between stages



function shot(key) {

    if (!currentGame.gameOver && !currentGame.gameWin)
        if (key === "ArrowUp") {
            const newShot = new Bullet((currentGame.ship.x + (currentGame.ship.width / 2 - 2)), currentGame.ship.y);
            currentGame.bullet.push(newShot);
        }

        for (const shots of currentGame.bullet) {
            shots.y -= 2;
            shots.draw();
        }
            
}

function changeLevels() {

    if (currentGame.score < 15) {
        frequencyModule = 120;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.5),rgba(46, 46, 46, 0.5)), url(images/lv1.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else if (currentGame.score >= 15 && currentGame.score < 30) {
        frequencyModule = 100;
        currentGame.level = 2;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.5),rgba(46, 46, 46, 0.5)), url(images/lv2.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else if (currentGame.score >= 30 && currentGame.score < 45) {
        frequencyModule = 80;
        currentGame.level = 3;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.5),rgba(46, 46, 46, 0.5)), url(images/lv3.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else if(currentGame.boss.health > 50) {
        currentGame.bossStage = true;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.5),rgba(46, 46, 46, 0.5)), url(images/lv3.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';
        currentGame.boss.move();
        currentGame.boss.draw();

    } else {
        canvas.style.background = 'linear-gradient(0deg, rgba(229, 82, 82, 0.7),rgba(229, 82, 82, 0.7)), url(images/bosslvl.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';
        currentGame.boss.move();
        currentGame.boss.draw();

        }

 }


 function powerLifeUp () {

    if (currentGame.enemiesFrequency % 824 === 0 && currentGame.level > 1 && !currentGame.bossStage) {
     
        const randomPowerUpX = Math.floor(Math.random() * 550);
        const newLifeUp = new PowerUp(randomPowerUpX);

         currentGame.lifeUp.push(newLifeUp);
    }

         currentGame.lifeUp.forEach ((powerUp, index) => {
             powerUp.y++;
             powerUp.draw();

             if (detectCollision(powerUp)) {

                currentGame.lives++;
                lives.innerText = currentGame.lives;
                currentGame.lifeUp.splice(index, 1);

             } 
         })

     
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
    
    currentGame.enemies.forEach(((enemy, index) => {
        
        if (currentGame.level === 1) { 
            enemy.y += 0.8;
        } else if (currentGame.level === 2) {
            enemy.y += 1;
        } else if (currentGame.level === 3) {
            enemy.y += 1.2;
            setTimeout(enemiesShooting(enemy), 500);
            enemiesShooting(enemy);
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

        if (currentGame.lives <= 0) {
            gameOver();
        }
        
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



//Isto está só commented out. Não mudei nada de especial.

function enemiesShooting(enemy) {

    if (currentGame.enemiesFrequency % 400 === 0) {
        const newEnemyBullet =  new BossShot(enemy.x + (enemy.width / 2), enemy.y + enemy.height, 3, 6, 'orange');
        currentGame.enemiesBullets.push(newEnemyBullet);
    }

    currentGame.enemiesBullets.forEach((shot, index) => {
        
        shot.y += 1.4;
        shot.draw();        

        if (shot.y > canvasHeight) {
            currentGame.enemiesBullets.splice(index, 1);
        }

        if (detectCollision(shot)) {
            currentGame.enemiesFrequency = 0;
            currentGame.enemiesBullets = [];
            gameOver();
        }

    })
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

        }
        
    })

    if (currentGame.boss.health <= 0) {
        gameWin();
    }
        
}

function gameWin() { 

    checkHiScore(); 
    currentGame.gameWin = true;
    currentGame.enemiesFrequency = 0;
    currentGame.boss = {};
    currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
    currentGame.bullet = [];
    currentGame.lifeUp = [];
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


function gameOver() { 
    checkHiScore();
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.gameOver = true;
    currentGame.enemiesFrequency = 0;
    currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
    currentGame.enemiesBullets = [];
    currentGame.lifeUp = [];
    currentGame.boss = {};
    currentGame.bullet = [];
    score.innerText = 0;
    lives.innerText = 1;
    overCanvas.innerText = 'GAME OVER';
    overCanvas.style.display = 'block';
    cancelAnimationFrame(animationId);
    
}    

function smoothMovement() {  
    if (currentGame.ship.x >= (canvasWidth - (currentGame.ship.width + 5))) {
        
        currentGame.ship.x = canvasWidth - (currentGame.ship.width + 5);
        
    } else if (currentGame.ship.x <= 5) {
        
        currentGame.ship.x = 5;
        
    }

    currentGame.ship.speed *= currentGame.ship.friction; 
    currentGame.ship.x += currentGame.ship.speed;
}

function updateCanvas() {

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    if (currentGame.gameOver === false && currentGame.gameWin === false) {
        currentGame.ship.draw();
    }
    smoothMovement();
    drawEnemies();
    shot();
    shotEnemy();
    powerLifeUp();
    changeLevels();
    sound();
    if (currentGame.gameOver === false || currentGame.gameWin === false) {
    animationId = requestAnimationFrame(updateCanvas);
    }

}
    

document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);
})




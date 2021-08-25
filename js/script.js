const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
let hiScoreValue = 0;

let frequencyModule;

let right; // Para movimento do Boss

let currentGame;
let animationId;

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

    currentGame = new Game();
    currentGame.ship = new Player();
    currentGame.boss = new Boss(canvasWidth / 2 - 40, -90);
    currentGame.ship.draw();
    overCanvas.style.display = 'none';
    cancelAnimationFrame(animationId);
    updateCanvas();
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

    } else if (currentGame.score < 2) {
        frequencyModule = 120;
        currentGame.level = 2;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.692),rgba(46, 46, 46, 0.692)), url(images/lv2.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else if (currentGame.score < 10) {
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

 function powerLifeUp () {

    if (currentGame.enemiesFrequency % 800 === 0 && currentGame.level === 2 && currentGame.level === 3 && !currentGame.bossStage) {
     
        const randomPowerUpX = Math.floor(Math.random() * 550);
        const newLifeUp = new PowerUp(randomPowerUpX);

         currentGame.lifeUp.push(newLifeUp);
    }

         currentGame.lifeUp.forEach ((powerUp, index) => {
             powerUp.y++;
             powerUp.draw();
             console.log(powerUp);

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
    
    currentGame.enemies.forEach(((enemy, index) => { // Tirei este forEach do loop acima, para que os inimigos não desapareçam quando vier o bossStage. Funciona na perfeição.
        
        if (currentGame.level === 1) { // Inimigos mais rápidos com o passar dos níveis.
            enemy.y += 0.8;
        } else if (currentGame.level === 2) {
            enemy.y += 1;
        } else if (currentGame.level === 3) {
            enemy.y += 1.2;
            setTimeout(enemiesShooting(enemy), 500);
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

        if (currentGame.enemiesFrequency % 50 === 0) {
            const newBossShot = new BossShot(currentGame.boss.x + 42, (currentGame.boss.y + currentGame.boss.height), 10, 7, "orange");
            currentGame.bossShots.push(newBossShot);
        }

        currentGame.bossShots.forEach(((shot, index) => {
            if (currentGame.boss.health > 50) { 
            shot.y += 1.4;
            } else {

                if (index % 4 === 0) {
                    shot.x += 0.4;
                    shot.y += 1.2;
                } else if (index % 5 === 0) {
                    shot.x -= 0.4;
                    shot.y += 1.2;
                } else {
                    shot.y += 1.2;
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

function enemiesShooting (enemy) {

    if (currentGame.enemiesFrequency % 160 === 0) {
    const newEnemyBullet =  new BossShot(enemy.x + (enemy.width / 2), enemy.y + enemy.height, 3, 6, 'orange');
    currentGame.enemiesBullets.push(newEnemyBullet);
    }

    currentGame.enemiesBullets.forEach ((shot, index) => {
        
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
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.gameOver = true;
    currentGame.enemiesFrequency = 0;
    currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
    currentGame.enemiesBullets = [];
    currentGame.ship = {};
    currentGame.boss = {};
    currentGame.bullet = [];
    score.innerText = 0;
    lives.innerText = 5;
    overCanvas.innerText = 'GAME OVER';
    overCanvas.style.display = 'block';
    cancelAnimationFrame(animationId);
    
}

function smoothMovement() {  // Esta função pressupõem umas ligeiras alterações ao move() do player.

    if (currentGame.ship.x >= (canvasWidth - (currentGame.ship.width + 5))) {
        
        currentGame.ship.x = canvasWidth - (currentGame.ship.width + 5);
        
    } else if (currentGame.ship.x <= 5) {
        
        currentGame.ship.x = 5;
        
    }

    currentGame.ship.speed *= currentGame.ship.friction; // Isto é para o speed ir diminuindo quando largas a tecla
    currentGame.ship.x += currentGame.ship.speed;
}

function updateCanvas() {

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.ship.draw();
    smoothMovement(); // adicionei só aqui a função
    drawEnemies();
    shot();
    shotEnemy();
    powerLifeUp();
    changeLevels();
    if (currentGame.gameOver === false || currentGame.gameWin === false) {
    animationId = requestAnimationFrame(updateCanvas);
    }

}
    
document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);
})





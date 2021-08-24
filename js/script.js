const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
let hiScoreValue = 0;

let frequencyModule;

let right;

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
    if (key === "ArrowUp") {
        const newShot = new Bullet((currentGame.ship.x + (currentGame.ship.width / 2 - 2)), currentGame.ship.y);
        currentGame.bullet.push(newShot);
    }

    for (const shots of currentGame.bullet) {
        shots.y -= 3;
        shots.draw();
    }
        
}    

function changeLevels() {

    if (currentGame.score < 5) {
        
        frequencyModule = 80;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.692),rgba(46, 46, 46, 0.692)), url(images/lv1.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else if (currentGame.score >= 5 && currentGame.score < 10) {
        frequencyModule = 70;
        currentGame.level = 2;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.692),rgba(46, 46, 46, 0.692)), url(images/lv2.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';

    } else if (currentGame.score >= 10 && currentGame.score < 20) {
        frequencyModule = 60;
        currentGame.level = 3;
        canvas.style.background = 'linear-gradient(0deg, rgba(46, 46, 46, 0.692),rgba(46, 46, 46, 0.692)), url(images/lv3.png)';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundPosition = 'center center';
// A function boss() apaguei e coloquei aqui a condiçao para que ela se iniciasse, na drawEnemies() tens o resto
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
  
    if (currentGame.bossStage === false && currentGame.gameOver === false && currentGame.gameWin === false) {
                
        if (currentGame.enemiesFrequency % frequencyModule === 0) {

            const randomEnemyX = Math.floor(Math.random() * 550);
        
            const newEnemy = new Enemy(randomEnemyX, 0, 40, 35, "green");

            currentGame.enemies.push(newEnemy);
        }

        currentGame.enemies.forEach(((enemy, index) => {
            enemy.y += 0.3; 
    
            enemy.y ++;
            enemy.draw();
            
    
            //enemy.draw();
    
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
// Funçao boss() está aqui o resto
    } else if (currentGame.gameOver === false && currentGame.gameWin === false && currentGame.boss) {

        if (currentGame.enemiesFrequency % 46 === 0) {
            const newBossShot = new BossShot(currentGame.boss.x + 42, (currentGame.boss.y + currentGame.boss.height), 10, 7, "orange");
            currentGame.bossShots.push(newBossShot);
    }

    currentGame.bossShots.forEach(((shot, index) => {
        if (currentGame.boss.health > 50) { 
        shot.y += 1.2;
        } else {
            
            if (index % 4 === 0) {
                shot.x += 0.2;
                shot.y += 1.2;
            } else if (index % 5 === 0) {
                shot.x -= 0.2;
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

        // if (shot.y > canvasHeight) {   
        //     currentGame.bossShots.splice(index, 1);
        // }

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
            console.log(currentGame.boss.health);

        }
        
    })

    if (currentGame.boss.health <= 0) {
        gameWin();
    }
        
}


function gameWin() {

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.gameWin = true;
    currentGame.enemiesFrequency = 0;
    currentGame.boss = {};
    //currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
    currentGame.bullet = [];
    //score.innerText = 0;
    lives.innerText = 5;
    overCanvas.innerText = 'YOU WIN'
    overCanvas.style.display = 'block';
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
    currentGame.gameOver = true;
    currentGame.enemiesFrequency = 0;
    currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
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
    drawEnemies();
    shot();
    shotEnemy();
    changeLevels();
    idLevel.innerText = currentGame.level;
    if (currentGame.gameOver === false || currentGame.gameWin === false) {
    animationId = requestAnimationFrame(updateCanvas);
    } 
}
    

// function reset(key) {
//     // if (key === "Enter" && (currentGame.gameOver !== false || currentGame.gameWin !== false) ) {
//     //     startGame();
//     // }

//     if (key === "Enter" && (currentGame.gameOver === true || currentGame.gameWin === true)) {
//         startGame();
//     }
// }


// document.addEventListener('keydown', (e) => {  
//     reset(e.key);
// })

document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);

})






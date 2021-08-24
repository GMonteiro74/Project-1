const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

let animationId;
let right = true
let currentGame;

let score = document.getElementById("score");
let lives = document.getElementById("lives");
let overCanvas = document.querySelector('#overCanvas');
lives.innerText = 5;
score.innerText = 0;

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



function boss() {
    
    if (currentGame.score > 0 && currentGame.boss.health > 0 && currentGame.gameOver === false && currentGame.gameWin === false) {
        currentGame.bossStage = true;
        currentGame.boss.move();
        currentGame.boss.draw();
    }

    // if (currentGame.boss.health <= 0) {
    //     currentGame.bossStage = false;
    // }

}


function drawEnemies() {
    currentGame.enemiesFrequency++;
  
    if (currentGame.bossStage === false && currentGame.gameOver === false && currentGame.gameWin === false) {
        if (currentGame.score < 8) {
            if (currentGame.enemiesFrequency % 220 === 0) {
                const randomEnemyX = Math.floor(Math.random() * 450);

                const newEnemy = new Enemy(randomEnemyX, 0, 40, 35, "green");

                currentGame.enemies.push(newEnemy);
            }
        } else if (currentGame.score < 15) {
             overCanvas.innerText = 'Level 2';
             overCanvas.style.display = 'block';
             
            if (currentGame.enemiesFrequency % 160 === 0) {
                const randomEnemyX = Math.floor(Math.random() * 450);

                const newEnemy = new Enemy(randomEnemyX, 0, 40, 35, "green");

                currentGame.enemies.push(newEnemy);
            }
        } else if (currentGame.score < 30) {
             overCanvas.innerText = 'Level 3';
             overCanvas.style.display = 'block';
             
            if (currentGame.enemiesFrequency % 120 === 0) {
                const randomEnemyX = Math.floor(Math.random() * 450);

                const newEnemy = new Enemy(randomEnemyX, 0, 40, 35, "green");

                currentGame.enemies.push(newEnemy);
            }
        }

    } else if (currentGame.gameOver === false && currentGame.gameWin === false) {
        if (currentGame.enemiesFrequency % 46 === 0) {
            const newBossShot = new BossShot(currentGame.boss.x + 42, (currentGame.boss.y + currentGame.boss.height), 10, 7, "orange");
            currentGame.bossShots.push(newBossShot);
              
        }
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
        
    

    currentGame.enemies.forEach(((enemy, index) => {
        enemy.y += 0.3; 
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
            currentGame.boss.health-= 1;
            currentGame.bullet.splice(indexShot, 1);
            console.log(currentGame.boss.health);

        }
        
    })

    if (currentGame.boss.health <= 0) {
        // overCanvas.innerText = 'YOU WIN !!!';
        // overCanvas.style.display = 'block';
        // currentGame.score = 100000;
        // score.innerText = currentGame.score;
        // cancelAnimationFrame(currentGame.animationId);
        gameWin();
    }
        
}


function gameWin() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.gameWin = true;
    currentGame.enemiesFrequency = 0;
    //currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
    //score.innerText = 0;
    lives.innerText = 5;
    overCanvas.innerText = 'YOU WIN !!!'
    overCanvas.style.display = 'block';
    cancelAnimationFrame(currentGame.animationId);

}

function gameOver() {
    cancelAnimationFrame(currentGame.animationId);
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.gameOver = true;
    currentGame.enemiesFrequency = 0;
    currentGame.score = 0;
    currentGame.enemies = [];
    currentGame.bossShots = [];
    score.innerText = 0;
    lives.innerText = 5;
    overCanvas.innerText = 'GAME OVER'
    overCanvas.style.display = 'block';
    cancelAnimationFrame(currentGame.animationId);
    
}

function updateCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.ship.draw();
    drawEnemies();
    shot();
    shotEnemy();
    boss();
    if (currentGame.gameOver === false || currentGame.gameWin === false) {
    currentGame.animationId = requestAnimationFrame(updateCanvas);
    } else if (currentGame.gameOver === true) {
        gameOver();
    } else if (currentGame.gameWin === true) {
        gameWin();
    }
}
    

function reset(key) {
    // if (key === "Enter" && (currentGame.gameOver !== false || currentGame.gameWin !== false) ) {
    //     startGame();
    // }

    if (key === "Enter" && (currentGame.gameOver === true || currentGame.gameWin === true)) {
        startGame();
    }
}


// document.addEventListener('keydown', (e) => {  
//     reset(e.key);
// })

document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);

})






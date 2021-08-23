const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

let animationID;

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




function drawEnemies() {
    currentGame.enemiesFrequency++;

    if (currentGame.enemiesFrequency % 80 === 0) {
        const randomEnemyX = Math.floor(Math.random() * 450);

    const newEnemy = new Enemy(randomEnemyX, 0);

    currentGame.enemies.push(newEnemy);
    }

    currentGame.enemies.forEach(((enemy, index) => {
        enemy.y += 1;
        enemy.draw();

        if (detectCollision(enemy)){
            currentGame.enemiesFrequency = 0;
            currentGame.enemies = [];
            gameOver();
            
            
        } else if (enemy.y > canvasHeight && currentGame.lives > 0) {
            
            currentGame.lives--;
            lives.innerText = currentGame.lives;
            currentGame.enemies.splice(index, 1);

            if (currentGame.lives <= 0) {
                gameOver();
            }
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
                
            } else if (shot.bottom() < 0) {
                currentGame.bullet.splice(indexShot, 1);
            }
        })
        
    })
        
}

function gameOver() {
  
    currentGame.gameOver = true;
    currentGame.enemiesFrequency = 0;
    currentGame.score = 0;
    currentGame.enemies = [];
    score.innerText = 0;
    lives.innerText = 5;
    overCanvas.innerText = 'GAME OVER'
    overCanvas.style.display = 'block';
    cancelAnimationFrame(currentGame.animationID);
    
}

function updateCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.ship.draw();
    drawEnemies();
    shot();
    shotEnemy();
    if (currentGame.gameOver === false) {
    currentGame.animationID = requestAnimationFrame(updateCanvas);
    } else {
        gameOver();
    }
}
    

document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);

})







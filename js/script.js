const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
let hiScoreValue = 0;

let frequencyModule;

let currentGame;

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
    currentGame.ship.draw();
    overCanvas.style.display = 'none';
    cancelAnimationFrame(currentGame.animationId);
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

    } else if (currentGame.score >= 5 && currentGame.score < 10) {
        frequencyModule = 70;
        currentGame.level = 2;

    } else if (currentGame.score >= 10) {
        frequencyModule = 60;
        currentGame.level = 3;
    }
 }


function drawEnemies() {

    currentGame.enemiesFrequency++;

    if (currentGame.enemiesFrequency % frequencyModule === 0) {
        const randomEnemyX = Math.floor(Math.random() * 550);

    const newEnemy = new Enemy(randomEnemyX, 0);

    currentGame.enemies.push(newEnemy);
    }

    currentGame.enemies.forEach(((enemy, index) => {

        enemy.y ++;
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
        currentGame.ship.top() > enemy.bottom()
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
        
    })
        
}

function checkHiScore() {
    if (currentGame.score > hiScoreValue) {
        hiScoreValue = currentGame.score;
        hiScore.innerText = hiScoreValue;
    }
}

function closeOverCanvas() {
    overCanvas.style.display = 'none';
}

function gameOver() {

    checkHiScore();
    currentGame.gameOver = true;
    currentGame.enemiesFrequency = 0;
    currentGame.score = 0;
    currentGame.enemies = [];
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
    changeLevels();
    idLevel.innerText = currentGame.level;
    if (currentGame.gameOver === false) {
    currentGame.animationId = requestAnimationFrame(updateCanvas);
    } 
}
    

document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);

})







const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

let currentGame;

let score = document.getElementById("score");
let lives = document.getElementById("lives");
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
    updateCanvas();
}

function shot(key) {
    if (key === "ArrowUp") {
        const newShot = new Bullet(currentGame.ship.x + currentGame.ship.width / 2 - 2, currentGame.ship.y);
        currentGame.bullet.push(newShot);
    }

    for (const shots of currentGame.bullet) {
        shots.y -= 3;
        shots.draw();

        
    }
        
}    




function drawEnemies() {
    currentGame.enemiesFrequency++;

    if (currentGame.enemiesFrequency % 197 === 0) {
        const randomEnemyX = Math.floor(Math.random() * 450);

    const newEnemy = new Enemy(randomEnemyX, 0);

    currentGame.enemies.push(newEnemy);
    }

    currentGame.enemies.forEach(((enemy, index) => {
        enemy.y += 0.5;
        enemy.draw();

        if (detectCollision(enemy)){
            currentGame.enemiesFrequency = 0;
            currentGame.enemies = [];
            alert('Game Over');
            
        }

        if (enemy.y > canvasHeight) {
            
            currentGame.lives--;
            lives.innerText = currentGame.lives;
            currentGame.enemies.splice(index, 1);
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

};
    


function updateCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.ship.draw();
    drawEnemies();
    shot();
    shotEnemy();
    requestAnimationFrame(updateCanvas);
}
    

document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);

})







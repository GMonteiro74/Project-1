const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
const score = document.querySelector('#score');

let currentGame;

const startBtn = document.querySelector('#start');
startBtn.onclick = () => {
    startGame();
    updateCanvas();
}

function startGame() {
    currentGame = new Game();
    currentGame.ship = new Player();
    currentGame.bullet = new Bullet(currentGame.ship.x, currentGame.ship.y);
    currentGame.ship.draw();
    // currentGame.bullet.draw();
}

function drawEnemies() {
    currentGame.enemiesFrequency++;

    if (currentGame.enemiesFrequency % 120 === 0) {
        const randomEnemyX = Math.floor(Math.random() * 450);

    const newEnemy = new Enemy(randomEnemyX, 0);

    currentGame.enemies.push(newEnemy);
    }

    currentGame.enemies.forEach(((enemy) => {
        enemy.y++;
        enemy.draw();

        if (detectCollision(enemy)){
            currentGame.enemiesFrequency = 0;
            currentGame.enemies = [];
            currentGame.score = 0;
            alert('Game Over');
            
        }

        if (enemy.y > canvasHeight) {
            currentGame.score++;
            score.innerText = currentGame.score;
            // currentGame.enemies.splice(index, 1);
        }
    }))
}

function detectCollision(enemy) {
    console.log(currentGame);
    return !(
        currentGame.ship.left() > enemy.right() ||
        currentGame.ship.right() < enemy.left() ||
        currentGame.ship.top() > enemy.bottom() ||
        currentGame.ship.bottom() < enemy.top()
    )
    
}

function updateCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.ship.draw();
    drawEnemies();
    requestAnimationFrame(updateCanvas);
}
    

document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    currentGame.bullet.shoot(e.key);

})







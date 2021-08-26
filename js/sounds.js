function loadSounds() {
    bass.load();
    drums.load();
    melody.load();
    bossBells.load();
    over.load();
    win.load();
    notes.load();
}


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
    // console.log(currentGame.level, currentGame.bossStage);
}
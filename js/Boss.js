class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 75;
        this.health = 1;

        const img = new Image();
        img.src = "./images/pngwing.com.png";
        this.image = img;
        
    }

    draw() {
        if (this.health > 75) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (this.health > 50) {
            this.width = 60;
            this.height = 60;
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (this.health > 15) {
            this.width = 40;
            this.height = 40;
            const img2 = new Image();
            img2.src = "./images/Boss_vermelho.png";
            this.image = img2;
            context.drawImage(this.image, this.x, this.y, this.width, this.height);

        } else {
            this.width = 25;
            this.height = 25;
            context.drawImage(this.image, this.x, this.y, this.width, this.height);

        }

    }    

    
    move() {
        if (this.y < 10) {
            this.y += 0.5;
        }  
        

        if (this.y === 10 &&  this.x < ((canvasWidth - 10) - this.width) && right === true) {
            this.x += 1.5;
        } else {
            right = false;
        }

        if (this.y === 10 && right === false && this.x > 10) {
            this.x -= 1.5;
        } else {
            right = true;
        }

    }



    top() {
        return this.y;
    }

    bottom() {
        return this.y + this.height;
    }

    left() {
        return this.x;
    }

    right() {
        return this.x + this.width;
    }

}
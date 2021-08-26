
class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        

        const img = new Image();
        img.src = "./images/enemy_recortado.png";
        this.image = img;
        
     }



    draw() {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
    top() {
        return this.y;
    }
  
    bottom() {
        return this.y + this.height;
    }

    right() {
        return this.x + this.width;
    }

    left() {
        return this.x;
    }
}


class BossShot extends Enemy {
    constructor(x, y, width, height) {
        super(x, y, width, height);

        const img = new Image();
        img.src = "./images/enemy-shot.png";
        this.image = img;

        
    }

    draw() {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }  
    
}
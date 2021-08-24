
class Enemy {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        const img = new Image();
        img.src = "../enemy_recortado.png";
        this.image = img;
        
     }



    draw() {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // draw() {
    //     context.fillStyle = this.color;
    //     context.fillRect(this.x, this.y, this.width, this.height);
    // }  
  
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
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }  
    
}
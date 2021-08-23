
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        context.fillStyle = '#0be587';
        context.fillRect(this.x, this.y, 50, 50);
    }  
  
    top() {
        return this.y;
    }
  
    bottom() {
        return this.y + 50;
    }

    right() {
        return this.x + 50;
    }

    left() {
        return this.x;
    }
}
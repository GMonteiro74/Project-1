class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 8;
    }

    draw() {
        context.fillStyle = "green";
        context.fillRect(this.x, this.y, this.width, this.height);
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
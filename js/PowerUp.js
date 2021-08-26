class PowerUp {
    constructor(x) {
        this.x = x;
        this.y = 0;
        this.width = 30;
        this.height = 27; // mudei o width and height porque fiz crop à imagem original para ficar com a HitBox certa. Podes aceitar no Pull.

        const img = new Image();
        img.src = "./images/life.png";
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
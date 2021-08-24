class Player {

    constructor() {
        this.width = 25;
        this.height = 45;
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - 60;

        const img = new Image();
        img.src = "./images/rocket_recortado.png";
        this.image = img;
        
    }



    draw() {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // draw() {
    //     context.fillStyle = 'tomato';
    //     context.fillRect(this.x, this.y, this.width, this.height);
    // }

    move(key) {
        context.clearRect(this.x, this.y, this.width, this.height);
        switch (key) {
            case "ArrowLeft":
              if (this.x > 13) {
                this.x -= 12;
              }      
              break;
            case "ArrowRight":
              if (this.x <= canvasWidth - (this.width + 13) ) {
                this.x += 12;
              }
              break;
            // case "ArrowUp":
            //     if(this.y >= 0) {
            //         this.y -= 10;
            //     }
            //     break;
            // case "ArrowDown":
            //     if (this.y < canvasHeight - this.height) {
            //         this.y += 10;
            //     }
            //     break;
          }
          // this.draw();
    }

    left() {
      return this.x;
    }

    top() {
      return this.y;
    }

    right() {
      return this.x + this.width;
    }

    bottom() {
      return this.y + this.height;
    }

}
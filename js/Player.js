class Player {

    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - 45;
        
    }

    draw() {
        context.fillStyle = 'tomato';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    move(key) {
        context.clearRect(this.x, this.y, this.width, this.height);
        switch (key) {
            case "ArrowLeft":
              if (this.x > 0) {
                this.x -= 10;
              }      
              break;
            case "ArrowRight":
              if (this.x <= canvasWidth - this.width) {
                this.x += 10;
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
          this.draw();
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
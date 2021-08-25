class Player {

    constructor() {
        this.width = 25;
        this.height = 45;
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - 55;
        this.speed = 0;
        this.friction = 0.965;

        const img = new Image();
        img.src = "./images/rocket_recortado.png";
        this.image = img;
        
    }

    draw() {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // move(key) {
    //     context.clearRect(this.x, this.y, this.width, this.height);
    //     switch (key) {
    //         case "ArrowLeft":
    //           if (this.x > 13) {
    //             this.x -= 15;
    //           }      
    //           break;
    //         case "ArrowRight":
    //           if (this.x <= canvasWidth - (this.width + 13) ) {
    //             this.x += 15;
    //           }
    //           break;
            
    //       }
         
    // }

    move(key) {
        const vel = 3;
        if (key === "ArrowLeft") {
          if (this.speed > -vel) {
          
            this.speed--
            
          } 
        }

        if (key === "ArrowRight") {
          if (this.speed < vel) {
          
            this.speed++
            
          }     
        }
      
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
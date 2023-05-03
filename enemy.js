import * as utils from "./utils.js";

export class Enemy {
  constructor(game) {
    this.game = game;
    this.type = "enemy"
    this.collisionRadius = 30;
    this.collisionX = this.game.width;
    this.collisionY = utils.random(this.game.height, this.game.topMargin);
    this.speedX = utils.random(4, 1);
    this.image = document.getElementById("toads");
    this.spriteWidth = 140;
    this.spriteHeight = 260;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.frameX = 0
    this.frameY = Math.floor(utils.random(4, 0))
    this.spriteX = this.collisionX - this.width / 2;
    this.spriteY = this.collisionY - this.height / 2 - 70;
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.spriteWidth*this.frameX, this.spriteHeight*this.frameY,this.spriteWidth, this.spriteHeight,this.spriteX, this.spriteY, this.width, this.height);

    if (this.game.debug) {
      ctx.beginPath();
      ctx.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
        );
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.restore();
        ctx.stroke();
      }
    }
    
    update() {
      this.collisionX -= this.speedX;
      if (this.spriteX + this.width < 0) {
        this.collisionX = this.game.width+this.width+utils.random(this.game.width/2, 1);
        this.collisionY = utils.random(this.game.height, this.game.topMargin);
        this.speedX = utils.random(4, 1);
        this.frameY = Math.floor(utils.random(4, 0))
      }
      this.spriteX = this.collisionX - this.width / 2;
      this.spriteY = this.collisionY - this.height / 2 - 40;
      
      let collisionObjects = [ ...this.game.obstacles, ...this.game.eggs,...this.game.enemies.filter((e)=> e!==this)];
      collisionObjects.forEach((o) => {
        let { collied, dx, dy, d, sumOfRadii } = this.game.checkCollision(
          this,
          o
          );
          if (collied) {
            const intersectionX = ((sumOfRadii - d) * dx) / d;
        const intersectionY = ((sumOfRadii - d) * dy) / d;
        if(o.type == "obstacle"){
            this.collisionX += intersectionX;
            this.collisionY += intersectionY;
            
        } else {
            this.collisionX += intersectionX/2;
            this.collisionY += intersectionY/2;
            o.collisionX -= intersectionX/2;
            o.collisionY -= intersectionY/2;
            
        }
      }
    });
  }
}

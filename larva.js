import { Firefly, Spark } from "./particle.js";
import * as utils from "./utils.js";
export class Larva {
  constructor(game, x, y) {
    this.game = game;
    this.type = "larva"
    this.collisionRadius = 30;
    this.collisionX = x
    this.collisionY = y
    this.image = document.getElementById("larva");
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.width = this.spriteWidth;
    this.markedForDelete = false
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.speedY = utils.random(2, 0)
    this.col = 0
    this.row = Math.trunc(utils.random(2, 0))
  }

  update() {
    this.collisionY-=this.speedY
    let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.eggs, ...this.game.enemies];
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
            
        } else if(o.type == "enemy") {
            this.markedForDelete = true
            this.game.removeGameObject()
            this.game.lostHatchlings++

            for(let i =0; i< 5 ; i++){
        
              this.game.particles.push(new Spark(this.game, this.collisionX , this.collisionY, 'red'))
            }
            
        } else {
          this.collisionX += intersectionX/2;
            this.collisionY += intersectionY/2;
            o.collisionX -= intersectionX/2;
            o.collisionY -= intersectionY/2;
        }
      }
      this.spriteX = this.collisionX - this.width/2;
    this.spriteY = this.collisionY - this.height/2-50;
    });
    this.spriteX = this.collisionX - this.width / 2;
    this.spriteY = this.collisionY - this.height * 0.5 - 25;
    if(this.collisionY+this.height/2 < this.game.topMargin){
      this.markedForDelete = true
      this.game.removeGameObject()
      this.game.score++
      for(let i =0; i< 3 ; i++){

        this.game.particles.push(new Firefly(this.game, this.collisionX , this.collisionY, 'yellow'))
      }
    }
  }
  draw(ctx) {
    ctx.drawImage(this.image,this.col*this.spriteWidth, this.row*this.spriteHeight, this.spriteWidth, this.spriteHeight ,this.spriteX, this.spriteY, this.width, this.height);
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
}
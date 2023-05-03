import * as utils from "./utils.js";
export class Player {
  constructor(game) {
    this.game = game;
    this.type = "player"
    this.collisionX = this.game.width / 2;
    this.collisionY = this.game.height / 2;
    this.collisionRadius = 30;
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = 5;
    this.image = document.getElementById("bull")
    this.spriteWidth = 255
    this.spriteHeight = 256
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.spriteX = this.collisionX - this.width/2
    this.spriteY = this.collisionY - this.height/2-70
    this.col = Math.round(utils.random(3, 0))
    this.row = Math.round(utils.random(2, 0))
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.col * this.spriteWidth,this.row * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)

    if(this.game.debug){
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
        ctx.beginPath();
        ctx.moveTo(this.collisionX, this.collisionY);
        ctx.lineTo(this.game.mouse.x, this.game.mouse.y);
        ctx.stroke();
      }

    }


  update() {
    this.dx = this.game.mouse.x - this.collisionX;
    this.dy = this.game.mouse.y - this.collisionY;
    const angle = Math.atan2(this.dy, this.dx)
    
    if(angle<-2.74 || angle>2.74) this.row = 6
    else if(angle<-1.96) this.row = 7
    else if(angle<-1.17) this.row = 0
    else if(angle<-0.39) this.row = 1
    else if(angle<0.39) this.row = 2
    else if(angle<1.17) this.row = 3
    else if(angle<1.96) this.row = 4
    else if(angle<2.74) this.row = 5

    const distance = Math.hypot(this.dy, this.dx);
    if(distance>this.speedModifier){
      this.speedX = this.dx / distance || 0;
      this.speedY = this.dy / distance || 0;

    }else{
      this.speedX = 0;
      this.speedY = 0;
      this.game.mouse.x = this.collisionX
      this.game.mouse.y = this.collisionY
    }
    this.collisionX += this.speedX *this.speedModifier ;
    this.collisionY += this.speedY *this.speedModifier;

    if(this.collisionX<0+this.collisionRadius) this.collisionX = this.collisionRadius
    if(this.collisionX>this.game.width-this.collisionRadius) this.collisionX =this.game.width - this.collisionRadius
    if(this.collisionY<this.game.topMargin+this.collisionRadius) this.collisionY = this.collisionRadius+this.game.topMargin
    if(this.collisionY>this.game.height-this.collisionRadius) this.collisionY =this.game.height - this.collisionRadius

    let collisionObjects = [ ...this.game.obstacles, ...this.game.eggs, ...this.game.enemies];
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
    this.spriteX = this.collisionX - this.width/2
    this.spriteY = this.collisionY - this.height/2-70
  }
}

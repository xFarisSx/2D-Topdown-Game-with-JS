import * as utils from "./utils.js";
export class Obstacle {
  constructor(game) {
    this.type = "obstacle"
    this.game = game;
    this.collisionX = utils.random(this.game.width, 0);
    this.collisionY = utils.random(this.game.height, 0);
    this.collisionRadius = 60;
    this.image = document.getElementById("obstacles");
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width / 2;
    this.spriteY = this.collisionY - this.height / 2 - 70;
    this.col = Math.round(utils.random(3, 0));
    this.row = Math.round(utils.random(2, 0));
  }
update() {
  
}
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.col * this.spriteWidth,
      this.row * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );

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

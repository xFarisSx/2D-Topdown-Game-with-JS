import { Larva } from "./larva.js";
import * as utils from "./utils.js";
export class Egg {
  constructor(game) {
    this.game = game;
    this.type = "egg";
    this.collisionRadius = 40;
    this.margin = this.collisionRadius * 2;
    this.collisionX = utils.random(this.game.width - this.margin, this.margin);
    this.collisionY = utils.random(
      this.game.height - this.margin,
      this.game.topMargin
    );
    this.image = document.getElementById("egg");
    this.spriteWidth = 110;
    this.spriteHeight = 135;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width / 2;
    this.spriteY = this.collisionY - this.height * 0.5 - 25;

    this.hatchTimer = 0;
    this.hatchInterval = 3000;
    this.markedForDelete = false;
  }

  update(dt) {
    let collisionObjects = [
      this.game.player,
      ...this.game.obstacles,
      ...this.game.eggs.filter((e) => e !== this),
    ];
    collisionObjects.forEach((o) => {
      let { collied, dx, dy, d, sumOfRadii } = this.game.checkCollision(
        this,
        o
      );
      if (collied) {
        const intersectionX = ((sumOfRadii - d) * dx) / d;
        const intersectionY = ((sumOfRadii - d) * dy) / d;
        if (o.type == "obstacle") {
          this.collisionX += intersectionX;
          this.collisionY += intersectionY;
        } else {
          this.collisionX += intersectionX / 2;
          this.collisionY += intersectionY / 2;
          o.collisionX -= intersectionX / 2;
          o.collisionY -= intersectionY / 2;
        }
      }
    });
    this.spriteX = this.collisionX - this.width / 2;
    this.spriteY = this.collisionY - this.height * 0.5 - 25;

    if (this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin) {
      this.game.hatchlings.push(new Larva(this.game, this.collisionX,this.collisionY))
      this.markedForDelete = true;
      this.game.removeGameObject()
    } else {
      this.hatchTimer += dt;
    }
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.spriteX, this.spriteY);
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
      const displayTimer = ((this.hatchInterval-this.hatchTimer)/1000).toFixed(0)
      ctx.fillText(displayTimer, this.collisionX, this.collisionY-this.height)
    }
  }
}

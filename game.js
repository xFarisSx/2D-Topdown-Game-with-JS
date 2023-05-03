import { Player } from "./player.js";
import { Obstacle } from "./obstacle.js";
import { Egg } from "./egg.js";
import { Enemy } from "./enemy.js";
import { Larva } from "./larva.js";
import { Firefly, Spark } from "./particle.js";
import * as utils from "./utils.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.font = "40px Bangers";
  ctx.textAlign = "center";

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.topMargin = 260;
      this.debug = true;
      this.player = new Player(this);
      this.fps = 70;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.eggTimer = 0;
      this.eggInterval = 1000;
      this.numberOfObstacles = 10;
      this.maxEggs = 5;
      this.obstacles = [];
      this.eggs = [];
      this.hatchlings = [];
      this.enemies = [];

      this.particles = [];

      this.losingScore = 1;
      this.running = true;
      this.score = 0;
      this.lostHatchlings = 0;
      this.seenSprites = [
        this.player,
        ...this.eggs,
        ...this.obstacles,
        ...this.enemies,
      ];
      this.mouse = {
        x: this.width / 2,
        y: this.height / 2,
        pressed: false,
      };
      this.init();

      window.addEventListener(
        "keydown",
        function (e) {
          if (e.key == "d") this.debug = !this.debug;
          console.log(this.debug);
          if(e.key == "r" && !this.running){
            this.restart()
          }
        }.bind(this)
      );

      canvas.addEventListener(
        "mousedown",
        function (e) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
          this.mouse.pressed = true;
        }.bind(this)
      );
      canvas.addEventListener(
        "mouseup",
        function (e) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
          this.mouse.pressed = false;
        }.bind(this)
      );
      canvas.addEventListener(
        "mousemove",
        function (e) {
          if (this.mouse.pressed) {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
          }
        }.bind(this)
      );
    }

    restart() {
      this.debug = true;
      this.player = new Player(this);
      this.eggTimer = 0;
      this.eggInterval = 1000;
      this.numberOfObstacles = 10;
      this.maxEggs = 5;
      this.obstacles = [];
      this.eggs = [];
      this.hatchlings = [];
      this.enemies = [];

      this.particles = [];

      this.losingScore = 1;
      this.running = true;
      this.score = 0;
      this.lostHatchlings = 0;
      this.seenSprites = [
        this.player,
        ...this.eggs,
        ...this.obstacles,
        ...this.enemies,
      ];
      this.mouse = {
        x: this.width / 2,
        y: this.height / 2,
        pressed: false,
      };
      this.init();
    }

    render(ctx, dt) {
      if (this.timer > this.interval) {
        this.seenSprites = [
          this.player,
          ...this.eggs,
          ...this.obstacles,
          ...this.enemies,
          ...this.hatchlings,
        ];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.seenSprites
        .sort((a, b) => a.collisionY - b.collisionY)
        .forEach((s) => {
          s.draw(ctx);
          if (this.running) {
              s.update(dt);}
            });
            
            this.particles.forEach((s) => {
              s.draw(ctx);
              if (this.running) {
                  s.update(dt);}
                
          });

          this.timer = 0;
        }
        this.timer += dt;
        if (
          this.eggTimer > this.eggInterval &&
          this.eggs.length < this.maxEggs
        ) {
          this.addEgg();
          this.eggTimer = 0;
        } else {
          this.eggTimer += dt;
        }

        ctx.save();
        ctx.textAlign = "left";
        ctx.fillText("Score: " + this.score, 25, 50);
        ctx.fillText("Lost: " + this.lostHatchlings, 25, 100);
        ctx.restore();
      

      if (this.lostHatchlings >= this.losingScore) {
        this.running = false;
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        let message1 = "Bullocks!";
        let message2 =
          "You lost " +
          this.lostHatchlings +
          " hatchlings, don't be a pushover!";
        ctx.font = "130px Helvetica";
        ctx.fillText(message1, this.width / 2, this.height / 2);
        ctx.font = "40px Helvetica";
        ctx.fillText(message2, this.width / 2, this.height / 2 + 50);
        ctx.fillText(
          "Final Score: " + this.score + ". Press 'R' to start again!",
          this.width / 2,
          this.height / 2 + 100
        );
        ctx.restore();
      }
    }

    removeGameObject() {
      this.eggs = this.eggs.filter((e) => !e.markedForDelete);
      this.hatchlings = this.hatchlings.filter((e) => !e.markedForDelete);
      this.particles = this.particles.filter((e) => !e.markedForDelete);
    }

    addEnemy() {
      this.enemies.push(new Enemy(this));
    }

    addEgg() {
      this.eggs.push(new Egg(this));
    }

    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const d = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return { collied: d < sumOfRadii, d, dx, dy, sumOfRadii };
    }

    init() {
      for (let i = 0; i < 5; i++) {
        this.addEnemy();
      }
      let attempts = 0;
      while (attempts < 500 && this.obstacles.length < this.numberOfObstacles) {
        let testObstacle = new Obstacle(this);
        let overlap = false;
        this.obstacles.forEach((o) => {
          const dx = testObstacle.collisionX - o.collisionX;
          const dy = testObstacle.collisionY - o.collisionY;
          const d = Math.hypot(dy, dx);
          const dBuffer = 100;
          const sumOfRadii =
            testObstacle.collisionRadius + o.collisionRadius + dBuffer;
          if (d < sumOfRadii) {
            overlap = true;
          }
        });
        const margin = testObstacle.collisionRadius * 3;
        if (
          !overlap &&
          testObstacle.spriteX > 0 &&
          testObstacle.spriteX < this.width - testObstacle.width &&
          testObstacle.collisionY > this.topMargin + margin &&
          testObstacle.collisionY < this.height - margin
        ) {
          this.obstacles.push(testObstacle);
        }

        attempts++;
      }
    }
  }

  const game = new Game(canvas);
  let lastTime = 0;
  animate();
  function animate(d) {
    let deltaTime = d - lastTime;
    lastTime = d;
    deltaTime = deltaTime > 0 ? deltaTime : 1;

    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
});

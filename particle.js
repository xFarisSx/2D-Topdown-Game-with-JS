import * as utils from "./utils.js"

class Particle{
    constructor(game, x, y, color){
        this.game = game
        this.collisionX = x
        this.collisionY = y
        this.color = color
        this.radius = Math.floor(utils.random(15, 5))
        this.speedX = utils.random(3, -3)
        this.speedY = utils.random(2.5, 0.5)
        this.angle = 0
        this.va = utils.random(0.11, 0.01)
        this.markedForDelete = false
    }
    
    draw(ctx){
        ctx.save()
        ctx.fillStyle = this.color
        ctx.beginPath(
            
            )
            ctx.arc(this.collisionX, this.collisionY, this.radius, 0 , Math.PI*2)
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        }
    }
    export class Firefly extends Particle{
        update(){
            this.angle += this.va
            this.collisionX += Math.cos(this.angle) * this.speedX
            this.collisionY -= this.speedY
            if(this.collisionY< 0 - this.radius){
                this.markedForDelete = true
                this.game.removeGameObject()
            }
        }
    }
    
    export class Spark extends Particle{
        update(){
            this.angle += this.va/2
        this.collisionX -= Math.cos(this.angle) * this.speedX
        this.collisionY -= this.speedY * Math.sin(this.angle) 
        if(this.radius >0.1){
            this.radius-=0.05
        } else {
            this.markedForDelete = true
                this.game.removeGameObject()
        }
    }
}
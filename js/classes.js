class Sprite {
    constructor({ 
        position, 
        imageSource, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0} 
    }) {
        this.position = position 
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSource
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        // change speed of the sprite animation //
        this.framesHold = 10
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image, 
            // animating by sprite //
            this.framesCurrent * (this.image.width / this.framesMax),
            // cropping image by sprites //
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++
        
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    // repeats the animation process back to 0 once the framesCurrent reaches framesMax //
    update() {
        this.draw()
        this.animateFrames()
    }
}


// extending to sprite allows the sprite constructor to be used within class fighter //
class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSource, 
        scale = 1, 
        framesMax = 1,
        offset = { x: 0, y: 0 },  
    //contains sprites for specific fighter//
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined}
    }) {

    // super calls parent constructor //
        super({
            position,
            imageSource,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 14
        this.sprites = sprites
        this.dead = false


        // alternates each object within different sprites -- run, idle //
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSource
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //spawns onto the ground//
        if (this.position.y + this.height + this.velocity.y >= 
            canvas.height - 43) {
            this.velocity.y = 0
        } else
            this.velocity.y += gravity
    }

    attack() {
        this.switchSprite('attack')
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

    takeHit(){
        this.switchSprite('takeHit')
        this.health -= 9

        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1) 
                this.dead = true
            return
        }

        if (this.image === this.sprites.attack.image && 
            this.framesCurrent < this.sprites.attack.framesMax - 1
        ) return

        if (this.image === this.sprites.takeHit.image && 
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        ) return



        switch (sprite) {
            case 'idle':
                    this.image = this.sprites.idle.image
                break


            case 'idleleft':
                    this.image = this.sprites.idleleft.image
                break


            case 'runleft':
                    this.image = this.sprites.runleft.image
                break


            case 'runright':
                    this.image = this.sprites.runright.image
                break


            case 'jump':
                    this.image = this.sprites.jump.image
                break

            case 'attack':
                    this.image = this.sprites.attack.image
                break

            case 'takeHit':
                    this.image = this.sprites.takeHit.image
                break

            case 'death':
                    this.image = this.sprites.death.image
                break
        }
    }
}

// Sprite class for images
class Sprite {
    constructor({ //by setting some parameters equal to something, you set the value even if it is not passed through
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0} 
    }) { 
        this.position = position //adjusting the position property of the object to be equal to the position passed through as an argument
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0,
        this.framesElapsed = 0,
        this.framesHold = 6,
        this.offset = offset
    }

    //within the class, we add a draw function that, when called, creates a 'sprite' with a position, width, and height
    draw() {
        canvasContext.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax )* this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0)
        if (this.framesCurrent < this.framesMax -1) {
        this.framesCurrent++
        } else {
            this.framesCurrent = 0
        }
    }

    //the update method is what gives each frame animation its value. in this, each frame the object will move
    update() {
        this.draw()
        this.animateFrames()
        
    }
}

//this is our object class and constructor that will be used to create the player and the enemy. notice that for the parameter of the constructor, it is an object. this makes it so that all properties of the object are not required and that they are order insensitive
class Fighter extends Sprite {
    constructor({ 
        position, 
        velocity, color, 
        attackBox = { 
            offset: {}, 
            width: undefined, 
            height: undefined }, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = { x: 0, y: 0},
        sprites 
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.framesCurrent = 0,
        this.framesElapsed = 0,
        this.framesHold = 6
        this.position = position //adjusting the position property of the object to be equal to the position passed through as an argument
        this.velocity = velocity //same as property
        this.width = 50
        this.height = 150
        this.lastKey //this property will hold as its value the last key that was inputted
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
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        console.log(this.sprites)
    }    

    //the update method is what gives each frame animation its value. in this, each frame the object will move
    update() {
        this.draw()
        if (!this.dead) this.animateFrames()

        //attack boxes
        //this code is important because it redraws the attackBox position on each frame, helping the rectangleCollision function work properly
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
            //draws rectangles to show the attack box location and size
        // canvasContext.fillRect(
        //     this.attackBox.position.x, 
        //     this.attackBox.position.y, 
        //     this.attackBox.width, 
        //     this.attackBox.height
        //     )

        //this code makes it so that the character is redrawn in a new space each frame (based on the original position and the added velocity)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

//physics
        //floor physics. adds a limit to the falling velocity and also adds increasing gravity for when characters are in the air
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {
            this.velocity.y = 0
            this.position.y = 331
        } else this.velocity.y += gravity;

        //ceiling. this code makes the characters bounce off the top of the screen when they jump too high
        if (this.position.y + this.velocity.y <= 0) {
            this.position.y = 0 //this makes the limit
            this.velocity.y = 1 //this velocity change makes it so the character bounces off the ceiling, rather than sticking and waiting for gravity to kick in
        }
        
        //left wall. this code makes it so the characters can't leave the screen on the left
        if (this.position.x + this.velocity.x <= 0) {
            this.position.x = 0
        }

        //right wall
        if (this.position.x + this.width >= canvas.width) {
            this.position.x = canvas.width - this.width
        }
    }

    attack() {
        this.isAttacking = true
        this.switchSprite('attack1')
    }

    takeHit() {
        this.health -= 20
        //death
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
        //this if statement overrides all other animations when attack is activated
        if (
            this.image === this.sprites.attack1.image && 
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        ) 
            return

        //override all other animations if takes a hit
        if (
            this.image === this.sprites.takeHit.image && 
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        ) 
            return
        {
        switch (sprite) {
            case 'idle': 
                if (this.image !== this.sprites.idle.image) {
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
                this.framesCurrent = 0
            }
                break
            case 'run': 
                if (this.image !== this.sprites.run.image) {
                this.image = this.sprites.run.image
                this.framesMax = this.sprites.run.framesMax
                this.framesCurrent = 0
            }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                this.image = this.sprites.jump.image
                this.framesMax = this.sprites.jump.framesMax
                this.framesCurrent = 0
            }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                this.image = this.sprites.fall.image
                this.framesMax = this.sprites.fall.framesMax
                this.framesCurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                this.image = this.sprites.attack1.image
                this.framesMax = this.sprites.attack1.framesMax
                this.framesCurrent = 0
            } 
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                this.image = this.sprites.takeHit.image
                this.framesMax = this.sprites.takeHit.framesMax
                this.framesCurrent = 0
            } 
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                this.image = this.sprites.death.image
                this.framesMax = this.sprites.death.framesMax
                this.framesCurrent = 0
            } 
                break
        }
        }
    }
    }





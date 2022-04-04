const canvas = document.querySelector('canvas'); //declaring this variable alows us to manipulate the 'canvas' tag in the index.html file
const canvasContext = canvas.getContext('2d'); //this variable will be used throughout. it is what allows us to manipulate the canvas within js

canvas.width = 1024; //here we are accessing and setting the height and width properties of the variable canvas
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.width); //the fillRect method on the context is what draws the shapes

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

//this is the first instantiation of the Fighter class. we create a player and give it a starting position
const player = new Fighter({ //notice that this is a SECOND curly braces. this is because the Fighter class takes an object as its argument, and this object has properties
    position: { //starting position of player1
        x: 100,
        y: 300
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    imageSrc: './img/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 155,
        height: 50
    }
});

//creating the enemy sprite
const enemy = new Fighter({ 
    position: { //here we offset the enemy to start on the right side of the screen
        x: 800,
        y: 300
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    imageSrc: './img/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 140,
        height: 50
    }
});

//the keys variable holds all of the keys that we will use to move the sprites. by having a variable set with these keys in it, we avoid some problems that come up when using event listeners
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate) //this line of code is what calls back the animate function, making it get called every frame. 
    canvasContext.fillStyle = 'black' //every frame, the background will be cleared and reset, making it so that the sprites do not leave paint trails from their animation. we are setting it to black, because otherwise it would be red, which was the last style applied
    canvasContext.fillRect(0, 0, canvas.width, canvas.height) //this sets how much will be cleared (the whole canvas)
    background.update() //these updates are being called in a layered order that places the first ones in the back, hence the characters come after the background
    shop.update() 
    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.15)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    player.update() //by calling this here, we are adding in the player character
    enemy.update() //by calling this here, we are adding in the enemy character
    
    //character movement initialization and reset
    player.velocity.x = 0 //this sets the default x velocity. otherwise, the object would continue moving in the direction
    enemy.velocity.x = 0

    //run and idle animations (player)
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //jumping animation (player)
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //run and idle animations (enemy)
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    //jumping animation (enemy)
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect for collision from player attackbox to enemy hurtbox and enemy gets hit, trigerring animation
    if (
        rectangleCollision({
            attacker: player,
            recipient: enemy
        }) && 
        player.isAttacking && 
        player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false;
        gsap.to('#enemy-health', {
            width: enemy.health + '%'
        })
    };

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //detect for collision from enemy attackbox to player hurtbox
    if (
        rectangleCollision({
            attacker: enemy,
            recipient: player
        }) &&
        enemy.isAttacking && 
        enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#player-health', {
            width: player.health + '%'
        })
    }

    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
}

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner ({ player, enemy, timerId })
    }
};

animate() //calling the animate function here is what draws the characters, updates them frame by frame, and so on. it's pretty important


//CONTROLS

//this event listener is for the characters to move using the keys. 
window.addEventListener('keydown', (event) => {
    if (!player.dead) {
    switch (event.key) {
        
        //player controls
        case 'd': 
            keys.d.pressed = true
            player.lastKey = 'd' //having this lastKey variable change makes it so that only one key can be assigned to this at a time. multiple keys can all be true at the same time, but only one key can be assigned to lastKey
            break
        case 'a': 
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w': 
            player.velocity.y = -13
            break
        case ' ':
            player.attack()
            break
    }
}
    if (!enemy.dead) {
        switch (event.key) {
            //enemy controls
            case 'ArrowRight': 
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight' 
            break
        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft' 
            break
        case 'ArrowUp': 
            enemy.velocity.y = -13
            break
        case 'Shift':
            enemy.attack()
            break
        }
    }
}
)
//this event listener is the KEYUP listener, so that the character doesnt move on forever when a button is pressed
window.addEventListener('keyup', (event) => {
    //player controls
    switch (event.key) {
        case 'd': 
            keys.d.pressed = false
            break
        case 'a': 
            keys.a.pressed = false
            break
        case 'w': 
            keys.w.pressed = false
            break
    }
    //enemy controls
    switch (event.key) {
        case 'ArrowRight': 
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp': 
            keys.ArrowUp.pressed = false
            break 
    }
})

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.6



const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSource: './img/background.png'
})

const wisp = new Sprite({
    position: {
        x: 362,
        y: 468
    },
    imageSource: './img/wisp.png',
    // sets scale property individually to wisp //
    scale: 1.8,
    framesMax: 8
})

const player = new Fighter({
    position: {
        x: -100,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSource: './img/pink_monster/pink_monster_idle_4.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x: -148,
        y: -58
    },
    sprites: {
        idle: {
            imageSource: './img/pink_monster/pink_monster_idle_4.png',
            framesMax: 4,
        },
        runright: {
            imageSource: './img/pink_monster/pink_monster_runright_4.png',
            framesMax: 4,
        },
        runleft: {
            imageSource: './img/pink_monster/pink_monster_runleft_4.png',
            framesMax: 4,
        },
        jump: {
            imageSource: './img/pink_monster/pink_monster_jump_4.png',
            framesMax: 4,
        },
        attack: {
            imageSource: './img/pink_monster/pink_monster_attack2_6.png',
            framesMax: 4,
        },
        takeHit: {
            imageSource: './img/pink_monster/pink_monster_hurt_4.png',
            framesMax: 4,
        },
        death: {
            imageSource: './img/pink_monster/pink_monster_death_8.png',
            framesMax: 4,
        }
    },
    attackBox: {
        offset: {
            x: 0,
            y: 0,
        },
        width: 5,
        height: 50
    }
})



const enemy = new Fighter({
    position: {
        x: 780,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSource: './img/owlet_monster/owlet_monster_idle_4.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x: -148,
        y: -58
    },
    sprites: {
        idle: {
            imageSource: './img/owlet_monster/owlet_monster_idle_4.png',
            framesMax: 4,
        },
        runright: {
            imageSource: './img/owlet_monster/owlet_monster_runright_4.png',
            framesMax: 4,
        },
        runleft: {
            imageSource: './img/owlet_monster/owlet_monster_runleft_4.png',
            framesMax: 4,
        },
        jump: {
            imageSource: './img/owlet_monster/owlet_monster_jump_4.png',
            framesMax: 4,
        },
        attack: {
            imageSource: './img/owlet_monster/owlet_monster_attack2_4.png',
            framesMax: 4,
        },
        takeHit: {
            imageSource: './img/owlet_monster/owlet_monster_hurt_4.png',
            framesMax: 4,
        },
        death: {
            imageSource: './img/owlet_monster/owlet_monster_death_8.png',
            framesMax: 4,
        }

    },
    attackBox: {
        offset: {
            x: 0,
            y: 0,
        },
        width: 5,
        height: 50
    }
})

enemy.draw()

console.log(player)

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
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    // spawns the sprites, background, and players //
    background.update()
    wisp.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player movement //
    player.switchSprite('idle')
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -4.5
        player.switchSprite('runleft')
    } 
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 4.5
        player.switchSprite('runright')
    }

    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }

    //Enemy movement
    enemy.switchSprite('idle')
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -4.5
        enemy.switchSprite('runleft')
    } 
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 4.5
        enemy.switchSprite('runright')
    }
    else {
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }

    //Collision detection
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy 
        }) &&
        player.isAttacking
    ) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }


    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player 
        }) &&
        enemy.isAttacking
    ) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //END GAME
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })

    }
}

animate()


//Player moves upon keydown 'd'
window.addEventListener('keydown', (event) => {
    if (!player.dead) {

    switch (event.key) {
        case 'd':
            keys.d.pressed = true   
            player.lastKey = 'd'
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

    if ( !enemy.dead ) {

    switch(event.key) {
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
        case 'ArrowDown':
            enemy.attack()
            break
        }
    }
})

//Player stops moving upon releasing key
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false  
            break
        case 'a':
            keys.a.pressed = false  
            break
        case 'w':
            keys.w.pressed = false
            lastKey = 'w'    
            break
    }

    //Enemy keys

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false  
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false  
            break
    }
})
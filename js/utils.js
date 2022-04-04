function rectangleCollision({ attacker, recipient }) {
    return (
        attacker.attackBox.position.x + attacker.attackBox.width >= recipient.position.x && 
        attacker.attackBox.position.x <= recipient.position.x + recipient.width &&
        attacker.attackBox.position.y + attacker.attackBox.height >= recipient.position.y &&
        attacker.attackBox.position.y <= recipient.position.y + recipient.height
    )
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#display-text').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#display-text').innerHTML = 'It\'s a Tie!'
    } else if (player.health > enemy.health) {
        document.querySelector('#display-text').innerHTML = 'Player1 Wins!'
    } else if (player.health < enemy.health) {
        document.querySelector('#display-text').innerHTML = 'Player2 Wins!'
    }
}

let timer = 30
let timerId

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML= timer
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
} 

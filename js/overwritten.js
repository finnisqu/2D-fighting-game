/*

//this code makes the rectangle characters
draw() {
    //character
    canvasContext.fillStyle = this.color
    canvasContext.fillRect(
        this.position.x, 
        this.position.y, 
        this.width, 
        this.height
        )

    //attack box
    if (this.isAttacking) {
    canvasContext.fillStyle = 'green'
    canvasContext.fillRect(
        this.position.x + this.offset, //code to make the attackbox offset according to the Sprite object's offset property (only affects the enemy attackBox)
        this.position.y, 
        this.attackBox.width, 
        this.attackBox.height
        )
    }
}


*/
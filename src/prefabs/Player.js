// Player prefab
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, frame) {
        super(scene, 75, game.settings.pos0, texture, frame);

        // set parameters
        this.params = {
            targetPos: game.settings.pos0,
            isMoving: false,
        }
    
        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // set overlap/collide detection
        this.body.onOverlap = true;
        this.body.onCollide = true;
    }
    
    update() {
        // calculate keystroke
        if(Phaser.Input.Keyboard.JustDown(Up) && 
           this.params.targetPos > game.settings.pos0 + 1
           && !this.params.isMoving) {
            this.params.targetPos -= game.settings.laneWidth;
            this.depth -= 1;
        }
        if(Phaser.Input.Keyboard.JustDown(Down) &&
           this.params.targetPos < game.settings.pos0 + game.settings.laneWidth * (game.settings.numLanes - 1) && 
           !this.params.isMoving) {
            this.params.targetPos += game.settings.laneWidth;
            this.depth += 1;
        }
        
        // calculate movement
        if(Math.abs(this.y - this.params.targetPos) < 20) { // if within 20 pixels, let player move again
            this.params.isMoving = false;
        }
        else { // if further than 20 pixels away, player cannot move yet
            this.params.isMoving = true;
        }
        if(Math.abs(this.y - this.params.targetPos) > 0) { // if further than 1 pixel, keep moving
            this.body.velocity.y = 10 * (this.params.targetPos - this.y);
        }
        else { // stop moving if within 1 pixel
            this.body.velocity.y = 0;
        }
    }

    /*
        colWidth:  width of collision box
        colHeight: height of collision box
        colX: X offset of collision box
        colY: Y offset of collision box
    */
   setCollisionDimensions( colWidth, colHeight, colX, colY) {
    this.body.width = colWidth;
    this.body.height = colHeight;
    this.body.offset.x = colX;
    this.body.offset.y = colY;
    }
}
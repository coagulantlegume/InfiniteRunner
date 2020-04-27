// Player prefab
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, frame) {
        super(scene, 75, game.settings.pos0, texture, frame);
    
        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // set overlap detection
        this.body.onOverlap = true;
    }
    
    update() {
        // calculate movement
        if(Phaser.Input.Keyboard.JustDown(Up) && 
           this.y > game.settings.pos0) {
            this.y -= game.settings.laneWidth;
            this.depth -= 1;
        }
        if(Phaser.Input.Keyboard.JustDown(Down) &&
           this.y < game.settings.pos0 + game.settings.laneWidth * (game.settings.numLanes - 1)) {
            this.y += game.settings.laneWidth;
            this.depth += 1;
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
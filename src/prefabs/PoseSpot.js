// PoseSpot prefab
class PoseSpot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, frame) {
        super(scene, game.config.width, 0, texture, frame);

        // calculate position
        this.setOrigin(0,0); // set origin to upper left corner
        this.y = game.settings.pos0 + game.settings.laneWidth * Math.floor(Math.random() * 4) - 
                 this.width / 2; // move to random aisle
        this.x = game.config.width + this.width; // move off screen

        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // set physics aspects
        this.setVelocityX(-game.settings.scrollSpeed);
        this.setImmovable();
    }
    
    update() {
        if(this.x < -this.width) {
            this.destroy();
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
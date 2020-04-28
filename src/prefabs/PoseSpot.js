// PoseSpot prefab
class PoseSpot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, frame) {
        super(scene, game.config.width, 0, texture, frame);
        
        let poseNum = Math.floor(Math.random() * 4);

        // set parameters
        this.params = {
            complete: false, // tracking if player has posed on spot or not
            attempted: false, // if attempted before, could be changed to int for multiple attempts
            poseKey: poseKeys[poseNum], // which key to satisfy pose
        };

        // calculate position
        this.setOrigin(0,0); // set origin to upper left corner
        this.y = game.settings.pos0 + game.settings.laneWidth * Math.floor(Math.random() * game.settings.numLanes) - 
                 this.width / 2; // move to random aisle
        this.x = game.config.width + this.width; // move off screen

        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // set physics aspects
        this.setVelocityX(-game.settings.scrollSpeed);
        this.setImmovable();

        // set texture
        this.setFrame(poseNum);
    }
    
    update() {
        if(this.x < -this.width) {
            if(!this.params.complete) {
                console.log("Missed!");
            }

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

    check() {
        if(!this.params.complete && !this.attempted) { // if unattempted
            if (Phaser.Input.Keyboard.JustDown(this.params.poseKey)) { // if correct key pressed
                this.params.complete = true;
                console.log("Hit!");
            }
        }
    }
}
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
            pose: poseNum,
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
        this.body.setCircle(this.width / 2);

        // set texture
        this.setFrame(poseNum);

        // debug color green
        this.setDebugBodyColor(0x00FF00);

        //audio for posing and missing pose spots 
        this.boo = scene.sound.add('boo');
        this.posesfx = scene.sound.add(Phaser.Math.RND.pick(['posesfx1', 'posesfx2', 'posesfx3']));

        // get player width for calculating when pose spot has passed and should be destroyed
        this.playerWidth = scene.player.width;
    }

    update() {
        // if(this.x < -this.width) {
        //     if(!this.params.complete) {
        //         this.boo.setVolume(0.05);
        //         this.boo.play();
        //         this.scene.player.params.swag -= 15;
        //         this.scene.player.params.currentCombo = 0;
        //     }

        //     this.destroy();
        // }
        if(this.x < -this.width / 2) {
            this.destroy();
        }
        else if(this.x < game.settings.playerXpos - this.playerWidth * 1.5) {
            if(!this.params.complete) {
                this.boo.setVolume(0.05);
                this.boo.play();
                this.scene.player.params.swag = Math.max(this.scene.player.params.swag - 15, 0);
                this.scene.player.params.currentCombo = 0;
                this.params.complete = true;
            }
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
                this.posesfx.setVolume(0.8);
                this.posesfx.play();
                this.params.complete = true;
                this.setDebugBodyColor(0xFFFFFF);
                this.scene.player.params.currentCombo += 1;
                this.scene.player.params.swag = Math.min(this.scene.player.params.swag + 20 * (this.scene.player.params.currentCombo / 2), 100);
                this.scene.player.params.lastPose = this.params.pose;
            }
        }
    }
}
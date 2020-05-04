// Player prefab
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, frame) {
        super(scene, game.settings.playerXpos, game.settings.pos0, texture, frame);

        // set parameters
        this.params = {
            swag: 100,
            lastPose: undefined,
            targetPosY: game.settings.pos0,
            isMoving: false,
            currentCombo: 0,
        }
        this.depth = 1;

        // set walking animations
        this.anims.load('walk');
        this.play('walk');
    
        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // set overlap/collide detection
        this.body.onOverlap = true;
        this.body.onCollide = true;

        // set debug color
        this.setDebugBodyColor(0x00FF00);

        // add idle swag loss timer, 1 swag every second
        this.swagLossTimer = this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                this.params.swag = Math.max(this.params.swag - 0.5, 0);
            },
            callbackScope: this,
            loop: true
        });
    }
    
    update() {
        // calculate keystroke
        if(Phaser.Input.Keyboard.JustDown(Up) && 
           this.params.targetPosY > game.settings.pos0 + 1
           && !this.params.isMoving) {
            this.params.targetPosY -= game.settings.laneWidth;
        }
        if(Phaser.Input.Keyboard.JustDown(Down) &&
           this.params.targetPosY < game.settings.pos0 + game.settings.laneWidth * (game.settings.numLanes - 1) && 
           !this.params.isMoving) {
            this.params.targetPosY += game.settings.laneWidth;
        }
        
        // calculate movement Y
        if(Math.abs(this.y - this.params.targetPosY) < 20) { // if within 20 pixels, let player move again
            this.params.isMoving = false;
        }
        else { // if further than 20 pixels away, player cannot move yet
            this.params.isMoving = true;
        }
        if(Math.abs(this.y - this.params.targetPosY) > 0) { // if further than 1 pixel, keep moving
            if (game.settings.scrollSpeed < 600) {
                this.body.velocity.y = 10 * (this.params.targetPosY - this.y);
                //this.body.velocity.y = (game.settings.scrollSpeed / 30) * (this.params.targetPosY - this.y);
            }
            else {
                this.body.velocity.y = 10 * (this.params.targetPosY - this.y);
                this.body.velocity.y = (600 / 30) * (this.params.targetPosY - this.y);
            }
        }
        else { // stop moving if within 1 pixel
            this.body.velocity.y = 0;
        }

        // calculate movement X
        if(Math.abs(this.x - game.settings.playerXpos) < 20) { // if within 20 pixels, let player move again
            this.params.isMoving = false;
        }
        else { // if further than 20 pixels away, player cannot move yet
            this.params.isMoving = true;
        }
        if(Math.abs(this.x - game.settings.playerXpos) > 0) { // if further than 1 pixel, keep moving
            if (game.settings.scrollSpeed < 600) {
                this.body.velocity.x = 3 * (game.settings.playerXpos - this.x);
                //this.body.velocity.x = (game.settings.scrollSpeed / 30) * (game.settings.playerXpos - this.x);
            }
            else {
                this.body.velocity.x = 10 * (game.settings.playerXpos - this.x);
                this.body.velocity.x = (600 / 30) * (game.settings.playerXpos - this.x);
            }
        }
        else { // stop moving if within 1 pixel
            this.body.velocity.x = 0;
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

    tripMove() {
        this.x -= 20;
        this.setDebugBodyColor(0xFF0000);
        this.tripTimer = this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                this.setDebugBodyColor(0x00FF00);
            },
            callbackScope: this,
        });
    }
}
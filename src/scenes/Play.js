class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('poseSpot', './assets/poseSpot.png');
    }

    create() {
        // set lane aspects
        game.settings.laneWidth = game.settings.runwayWidth / game.settings.numLanes; // set lane width for game
        game.settings.pos0 = game.config.width / 2 - game.settings.runwayWidth / 2 + game.settings.laneWidth / 2; // set furthest left position

        // draw runway
        this.add.rectangle(game.config.width / 2, 0, game.settings.runwayWidth, game.config.height, 0xFACADE).setOrigin(0.5,0);

        // create poseSpot group
        this.poseSpotGroup = this.add.group({
            runChildUpdate: true,
        })

        // create poseSpot timer
        this.poseSpotTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnPoseSpot,
            callbackScope: this,
            loop: true
        });
    }

    update() {
    }

    spawnPoseSpot() {
        let posespot = new PoseSpot(this, 'poseSpot');
        posespot.setCollisionDimensions(posespot.width, posespot.height / 2, 0, posespot.height / 2);
        this.poseSpotGroup.add(posespot);
        
    }
}
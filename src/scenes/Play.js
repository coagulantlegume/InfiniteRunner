class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('poseSpot', './assets/poseSpot.png');
        this.load.image('player', './assets/player.png');
    }

    create() {
        // set lane aspects
        game.settings.laneWidth = game.settings.runwayWidth / game.settings.numLanes; // set lane width for game
        game.settings.pos0 = game.config.height / 2 - game.settings.runwayWidth / 2 + game.settings.laneWidth / 2; // set furthest left position

        // define keyboard keys
        Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        Down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // draw runway
        this.add.rectangle(0, game.config.height / 2, game.config.width, game.settings.runwayWidth, 0xFACADE).setOrigin(0,0.5);

        // create player
        this.player = new Player(this, 'player');

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
        this.player.update();
    }

    spawnPoseSpot() {
        let posespot = new PoseSpot(this, 'poseSpot');
        posespot.setCollisionDimensions(posespot.width, posespot.height / 2, 0, posespot.height / 2); // make custom size collision box for sprite
        this.poseSpotGroup.add(posespot);
        
    }
}
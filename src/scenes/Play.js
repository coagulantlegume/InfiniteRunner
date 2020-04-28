class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('poseSpot', './assets/temp_posespot.png', {frameWidth: 32,
                frameHeight: 32});
        this.load.image('player', './assets/player.png');
        this.load.image('obstacle', './assets/obstacle.png');
        this.load.audio('bgm', './assets/funkymusic.wav');
    }

    create() {
        this.sound.play('bgm');

        // set lane aspects
        game.settings.laneWidth = game.settings.runwayWidth / game.settings.numLanes; // set lane width for game
        game.settings.pos0 = game.config.height / 2 - game.settings.runwayWidth / 2 + game.settings.laneWidth / 2; // set furthest left position

        // define keyboard keys
        Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        Down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        poseKeys = [
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
        ];
        
        // draw runway
        this.add.rectangle(0, game.config.height / 2, game.config.width, game.settings.runwayWidth, 0xFACADE).setOrigin(0,0.5);

        // create poseSpot group
        this.poseSpotGroup = this.add.group({
            runChildUpdate: true,
        })

        // create obstacle group
        this.obstacleGroup = this.add.group({
            runChildUpdate: true,
        })

        // create poseSpot timer
        this.poseSpotTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnPoseSpot,
            callbackScope: this,
            loop: true
        });

        // create obstacle timer
        this.obstacleTimer = this.time.addEvent({
            delay: 3000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        // create difficulty bump timer
        this.difficultyTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                if(game.settings.spawnRate > 500) {// cap at .5 second
                    game.settings.spawnRate -= 15;
                }
                game.settings.scrollSpeed += 1;
            },
            callbackScope: this,
            loop: true
        })

        // create player
        this.player = new Player(this, 'player');

        // create player/posespot overlap event
        this.physics.world.on('overlap', (body1, body2) => {
            body2.check();
        }, this);
        this.physics.add.overlap(this.player, this.poseSpotGroup);
        this.physics.add.overlap(this.player, this.obstacleGroup);
    }

    update() {
        this.player.update();
    }

    spawnPoseSpot() {
        let posespot = new PoseSpot(this, 'poseSpot');
        //posespot.setCollisionDimensions(posespot.width, posespot.height / 2, 0, posespot.height / 2);
        this.poseSpotGroup.add(posespot);

        // randomize timer for next call
        this.poseSpotTimer.delay = Math.floor((Math.random() + 1) * game.settings.spawnRate);
    }

    spawnObstacle() {
        let obstacle = new Obstacle(this, 'obstacle');
        this.obstacleGroup.add(obstacle);

        // randomize timer for next call
        this.obstacleTimer.delay = Math.floor((Math.random() + 1) * game.settings.spawnRate);
    }
}
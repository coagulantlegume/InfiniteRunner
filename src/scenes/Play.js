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
        this.music = this.sound.play('bgm', {
            loop: true
        });

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

        // create distance calculator
        this.distanceCalc = this.time.addEvent({
            delay: game.settings.scrollSpeed,
            callback: () => {
                game.settings.distanceCounter += 0.5;
                this.distanceCalc.delay = game.settings.scrollSpeed;
                console.log(game.settings.distanceCounter);
            },
            loop: true,
        })

        // create object spawn timer
        this.objectTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnObjects,
            callbackScope: this,
            loop: true
        });
        // add pose spawn tracker
        this.objectTimer.lastPoseSpot = {
            location: -1,
            lane: -1,
            previousSpawn: true,
        };

        // create speed bump timer
        this.speedTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                if(game.settings.spawnRate > 200) {// cap at .2 second (after 95 seconds playtime)
                    game.settings.spawnRate -= 7;
                }
                game.settings.scrollSpeed += .5;
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
    }

    spawnObstacle() {
        let obstacle = new Obstacle(this, 'obstacle');
        this.obstacleGroup.add(obstacle);
    }

    spawnObjects() {
        // check distance from last posespot
        if((game.settings.distanceCounter - this.objectTimer.lastPoseSpot.location) >= game.settings.scrollSpeed / 10) { // spawn posespot
            this.spawnPoseSpot();
            this.objectTimer.lastPoseSpot.location = game.settings.distanceCounter;
            this.objectTimer.lastPoseSpot.previousSpawn = true;
        }
        else { // spawn object
            this.spawnObstacle();
            this.objectTimer.lastPoseSpot.previousSpawn = false;
        }

        //if (game.settings.spawnRate > 200) {// above minimal calculation
        //   // begins game with 75% chance of spawning pose spot, caps at 15% chance of pose spot
        //   if (Math.random() <= (game.settings.startRate / 200 * 1.25 - 
        //       game.settings.startRate / game.settings.spawnRate) / 33.3) {
        //       this.spawnPoseSpot();
        //   }
        //   else {
        //       this.spawnObstacle();
        //   }
        //}
        //else {
        //    if(Math.random() <= .15) {
        //        this.spawnPoseSpot();
        //    }
        //    else {
        //        this.spawnObstacle();
        //    }
        //}
        // randomize timer for next call
        this.objectTimer.delay = Math.floor((Math.random()) * (game.settings.spawnRate / 2) + game.settings.spawnRate * 0.5);
    }
}
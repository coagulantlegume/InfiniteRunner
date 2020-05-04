class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('poseSpot', './assets/poseSpot.png', {frameWidth: 57,
                frameHeight: 57});
        this.load.atlas('player', './assets/playerAnimation.png', './assets/playerAnimation.json');
        this.load.image('obstacle', './assets/obstacle.png');
        this.load.image('background', './assets/tiledBG.png');
        this.load.audio('bgm', './assets/funkymusic.wav');
    }

    create() {
        this.music = this.sound.play('bgm', {
            loop: true
        });

        // set lane aspects
        game.settings.laneWidth = game.settings.runwayWidth / game.settings.numLanes; // set lane width for game
        game.settings.pos0 = game.settings.runwaytopY + game.settings.laneWidth / 2; // set furthest up position

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
        this.background = this.add.tileSprite(0, 0, 1280, 600, 'background').setOrigin(0, 0);

        // create poseSpot group
        this.poseSpotGroup = this.add.group({
            runChildUpdate: true,
        })

        // create obstacle groupz
        this.obstacleGroup = this.add.group({
            runChildUpdate: true,
        })

        // create distance calculator
        this.distanceCalc = this.time.addEvent({
            delay: 2 * game.settings.scrollSpeed,
            callback: () => {
                game.settings.distanceCounter += 1;
                this.distanceCalc.delay = 2 * game.settings.scrollSpeed;
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

        // create stage timer
        this.stageTimer = this.time.addEvent({
            //delay: game.settings.stages.duration1,
            callback: () => {
                switch(game.settings.stages.currentStage) {
                    case 1: // Switching from stage 1 to stage 2
                        this.stageTimer.delay = game.settings.stages.duration2;
                        this.stageTimer.newScrollSpeed = game.settings.stages.scrollSpeed2;
                        game.settings.poseDist = game.settings.stages.poseDist2;
                        game.settings.spawnRate = game.settings.stages.spawnRate2;
                        console.log("Stage 2");
                        break;
                    case 2: // Switching from stage 2 to stage 3
                        this.stageTimer.delay = game.settings.stages.duration3;
                        this.stageTimer.newScrollSpeed = game.settings.stages.scrollSpeed3;
                        game.settings.poseDist = game.settings.stages.poseDist3;
                        game.settings.spawnRate = game.settings.stages.spawnRate3;
                        console.log("Stage 3");
                        break;
                    case 3: // Switching from stage 3 to stage 4
                        this.stageTimer.delay = game.settings.stages.duration4;
                        this.stageTimer.newScrollSpeed = game.settings.stages.scrollSpeed4;
                        game.settings.poseDist = game.settings.stages.poseDist4;
                        game.settings.spawnRate = game.settings.stages.spawnRate4;
                        console.log("Stage 4");
                        break;
                    default:
                        this.stageTimer.newScrollSpeed += 50;
                        game.settings.spawnRate -= 15;
                        console.log("Difficulty bump");
                }
                game.settings.stages.currentStage += 1;
                this.stageTimer.pause = true;

                // slowly ramp up speed, +50 per second, calculated every .5 seconds
                this.stageTimer.rampTimer = this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        game.settings.scrollSpeed += 25;
                        // check if new stage speed met or exceeded
                        if(game.settings.scrollSpeed >= this.stageTimer.newScrollSpeed) {
                            game.settings.scrollSpeed = this.stageTimer.newScrollSpeed;
                            this.stageTimer.pause = false;
                            this.stageTimer.rampTimer.reset();
                            this.stageTimer.rampTimer.pause = true;
                        }
                        // set current obstacle speeds
                        Phaser.Actions.Call(this.obstacleGroup.getChildren(), (obj) => {
                            obj.setVelocityX(-game.settings.scrollSpeed);
                        }, this);

                        // set current pose spot speeds
                        Phaser.Actions.Call(this.poseSpotGroup.getChildren(), (obj) => {
                            obj.setVelocityX(-game.settings.scrollSpeed);
                        }, this);
                    },
                    callbackScope: this,
                    loop: true,
                })
            },
            callbackScope: this,
            loop: true,
        });
        // set stage 1 params
        this.stageTimer.delay = game.settings.stages.duration1;
        game.settings.scrollSpeed = game.settings.stages.scrollSpeed1;
        game.settings.poseDist = game.settings.stages.poseDist1;
        game.settings.spawnRate = game.settings.stages.spawnRate1;
        console.log("Stage 1");

        // create player 
           // set walk animation
        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 14,
            frames: this.anims.generateFrameNames('player', {
                prefix: 'f',
                suffix: '.png',
                start: 1,
                end: 12,
                zeroPad: 2
            })
        }) 
           // create player object
        this.player = new Player(this);
        this.player.setOrigin(0.85,0.85);
        this.player.setCollisionDimensions(this.player.width * 0.9, this.player.height / 3, 0, this.player.height / 3 * 2);

        // create player/posespot overlap event
        this.physics.world.on('overlap', (body1, body2) => {
            body2.check();
        }, this);
        this.physics.add.overlap(this.player, this.poseSpotGroup);
        this.physics.add.overlap(this.player, this.obstacleGroup);
    }

    update() {
        // scroll background
        this.background.tilePositionX += game.settings.scrollSpeed / 60;
        // check if game end
        if(this.player.params.swag > 0) {
            this.player.update();
        }
        else if (game.settings.scrollSpeed > 0) {
            game.settings.scrollSpeed -= 5;
            if (game.settings.scrollSpeed < 0) {
                game.settings.scrollSpeed = 0;
            }
            // set current obstacle speeds
            Phaser.Actions.Call(this.obstacleGroup.getChildren(), (obj) => {
                obj.setVelocityX(-game.settings.scrollSpeed);
            }, this);

            // set current pose spot speeds
            Phaser.Actions.Call(this.poseSpotGroup.getChildren(), (obj) => {
                obj.setVelocityX(-game.settings.scrollSpeed);
            }, this);
        }
        else {
            this.scene.start("gameoverScene");
        }
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
        if((game.settings.distanceCounter - this.objectTimer.lastPoseSpot.location) >= game.settings.poseDist) { // spawn posespot
            this.spawnPoseSpot();
            this.objectTimer.lastPoseSpot.location = game.settings.distanceCounter;
            this.objectTimer.lastPoseSpot.previousSpawn = true;
        }
        else { // spawn object
            this.spawnObstacle();
            this.objectTimer.lastPoseSpot.previousSpawn = false;
        }
        this.objectTimer.delay = Math.floor((Math.random()) * (game.settings.spawnRate / 2) + game.settings.spawnRate * 0.5);
    }
}
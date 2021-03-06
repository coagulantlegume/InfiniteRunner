class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('poseSpot', './assets/poseSpot.png', {frameWidth: 57,
                frameHeight: 57});
        this.load.atlas('player', './assets/playerAnimation.png', './assets/playerAnimation.json');
        this.load.image('obMask', './assets/obstacleMask.png');
        this.load.image('obBag', './assets/obstacleBag.png');
        this.load.image('obShoes', './assets/obstacleShoes.png');
        this.load.image('background', './assets/tiledBG.png');
        this.load.image('backgroundSideCover', './assets/backgroundSideCover.png');
        this.load.image('hotbar', './assets/posesUI.png');
        this.load.spritesheet('swagBar', './assets/swagBar.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('swagText', './assets/swagText.png', {frameWidth: 122, frameHeight: 64});
        this.load.audio('bgm', './assets/funkymusic.wav');
    }

    create() {
        this.music = this.sound.add('bgm', {
            loop: true,
            volume: 0.1
        });
        this.music.play();

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

        // draw swagbar base
        this.add.image(0,0,'backgroundSideCover').setOrigin(0,0).setDepth(2);
        this.add.sprite(87, game.config.height - 18, 'swagBar').setOrigin(0, 1).setScale(1.7, 10).setFrame(4).setDepth(2).angle = -6.4;

        // draw swagbar full
        this.swagBar = this.add.sprite(87, game.config.height - 18, 'swagBar');
        this.swagBar.setOrigin(0, 1).setScale(1.7, 10).setFrame(5).setDepth(3).angle = -6.4;
        this.swagText = this.add.sprite(172, game.config.height - 24, 'swagText')
        this.swagText.setOrigin(0, 1).setFrame(4).setDepth(3).angle = -6.4;

        // draw hotbar
        this.hotbar = this.add.sprite(game.config.width/2, game.config.height-80, 'hotbar').setDepth(2);

        // draw combo text 
        this.comboText = this.add.bitmapText(25, game.config.height - 20, 'myfont', '', 50);
        this.comboText.setOrigin(0,1).setDepth(3).angle = -6.4;

        // draw distance travelled text
        this.distString = game.settings.distanceCounter+'m';
        this.distText = this.add.bitmapText(game.config.width/2, 25, 'myfont', this.distString, 35).setOrigin(0.5,0);

        // create poseSpot group
        this.poseSpotGroup = this.add.group({
            runChildUpdate: true,
        });

        // create obstacle group
        this.obstacleGroup = this.add.group({
            runChildUpdate: true,
        });

        // create distance calculator
        this.distanceCalc = this.time.addEvent({
            delay: 2 * game.settings.scrollSpeed,
            callback: () => {
                game.settings.distanceCounter += .5;
                this.distanceCalc.delay = 2 * game.settings.scrollSpeed;
            },
            loop: true,
        });

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

        // update swag bar
        this.swagBar.setScale(1.7, this.player.params.swag / 10);
        if(this.player.params.lastPose != undefined) {
            this.swagBar.setFrame(this.player.params.lastPose);
            this.swagText.setFrame(this.player.params.lastPose);
        }
        if(this.player.params.currentCombo > 0) {
            this.comboText.setText(this.player.params.currentCombo + 'x');
        }
        else {
            this.comboText.setText('');
        }

        // set distance travelled text
        this.distText.setText(Phaser.Math.FloorTo(game.settings.distanceCounter)+'m');

        // check if game end
        if(this.player.params.swag > 0) {
            this.player.update();
        }
        else if (game.settings.scrollSpeed > 0) {
            this.distanceCalc.paused = true;
            this.player.setVelocity(0,0);
            this.music.volume /= 2;
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
            this.music.destroy();
            this.scene.start("gameoverScene");
        }
    }

    spawnPoseSpot() {
        let posespot = new PoseSpot(this, 'poseSpot');
        //posespot.setCollisionDimensions(posespot.width, posespot.height / 2, 0, posespot.height / 2);
        this.poseSpotGroup.add(posespot);
    }

    spawnObstacle() {
        let obstacle = new Obstacle(this, Phaser.Math.RND.pick(['obMask', 'obBag', 'obShoes']));
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
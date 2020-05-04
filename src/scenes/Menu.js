class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.bitmapFont('myfont', 'assets/fonts/odetogaming.png', 'assets/fonts/odetogaming.fnt');
        this.load.bitmapFont('titlefont', 'assets/fonts/titlefont.png', 'assets/fonts/titlefont.fnt');
        this.load.image('title', './assets/titleScreen.png');
        this.load.image('guide', './assets/instructions.png');
        this.load.image('titlepose', './assets/titlepose.png');
        this.load.audio('boo', './assets/boo.wav');
        this.load.audio('posesfx1', './assets/posesfx1.wav');
        this.load.audio('posesfx2', './assets/posesfx2.wav');
        this.load.audio('posesfx3', './assets/posesfx3.wav');
        this.load.audio('gasp', './assets/gasp.wav');
    }

    create(){
        // menu display
        /*let menuConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#FF0000',
            align: 'left',
            wordWrap: { width: 500, useAdvancedWrap: true },
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }*/

        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;

        //start
        //this.add.text(centerX, centerY, 'Press Space to start', menuConfig).setOrigin(0.5);
        //this.runway = this.add.tileSprite(centerX, centerY + 300, 726, 1280, 'runway').setOrigin(0.5);
        this.title = this.add.tileSprite(0, 0, 1280, 600, 'title').setOrigin(0);
        //this.add.rectangle(centerX, centerY + 220, 550, 60, 0x000000).setOrigin(0.5);
        //this.startText = this.add.bitmapText(centerX, centerY + 50, 'titlefont', 'Superstar', 72).setOrigin(0.5);
        //this.startText = this.add.bitmapText(centerX, centerY + 225, 'myfont', 'Press Space to Start', 30).setOrigin(0.5);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            // easy mode
            //game.settings = {
            //    scrollSpeed: 200,
            //    runwayWidth: 400,
            //    numLanes: 4,
            //    spawnRate: 3500,
            //    
            //}
            //this.guide = this.add.tileSprite(0, 0, 1280, 600, 'guide').setOrigin(0);
            this.scene.start("playScene");
        }
        // if(Phaser.Input.Keyboard.JustDown(keySpace)){
        //     this.scene.start("playScene");   
        // }
    }
    
}
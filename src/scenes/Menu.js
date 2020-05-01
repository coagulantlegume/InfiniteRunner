class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){

    }

    create(){
        // menu display
        let menuConfig = {
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
        }

        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        this.add.text(centerX, centerY, 'Press Space to start', menuConfig).setOrigin(0.5);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            // easy mode
            game.settings = {
                scrollSpeed: 200,
                startScroll: 200,
                runwayWidth: 400,
                numLanes: 4,
                spawnRate: 3500,
                startRate: 3500,
            }
            this.scene.start("playScene");    
        }
    }
    
}
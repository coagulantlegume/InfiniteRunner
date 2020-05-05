class Gameover extends Phaser.Scene {
    constructor() {
        super("gameoverScene");
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

        this.add.bitmapText(centerX, centerY, 'myfont', 'Distance You Walked: ' + game.settings.distanceCounter, 30).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 225, 'myfont', 'Press Space to Return to Main', 30).setOrigin(0.5);

        // From PaddleParcourP3 by Nathan Altice https://github.com/nathanaltice/PaddleParkourP3
        let newHighScore = undefined;
        let highScore = undefined;
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            
            if(game.settings.distanceCounter > storedScore) {
                localStorage.setItem('hiscore', game.settings.distanceCounter.toString());
                newHighScore = true;
            }
            else {
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        }
        else {
            highScore = game.settings.distanceCounter;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        if(newHighScore) {
            this.add.bitmapText(centerX, centerY - 225, 'myfont', 'New High Score!', 30).setOrigin(0.5);
        }
        else {
            this.add.bitmapText(centerX, centerY - 225, 'myfont', 'High Score: ' + highScore, 30).setOrigin(0.5);
        }
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            game.settings.distanceCounter = 0;
            this.scene.start('menuScene');
            location.reload(); // Super inefficient, bad practice, but we were getting major errors with restarting the scene and not enough time to fix it 
        }
    }
}
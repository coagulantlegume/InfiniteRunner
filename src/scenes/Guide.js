class Guide extends Phaser.Scene {
    constructor() {
        super("guideScene");
    }

    preload(){
    }

    create(){
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.title = this.add.tileSprite(0, 0, 1280, 600, 'guide').setOrigin(0);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyEnter)) {
            this.scene.start("playScene");
        }
    }
}
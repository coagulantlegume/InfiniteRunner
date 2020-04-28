let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Play, Gameover],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true, // show bounding boxes
        }
    }
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    scrollSpeed: 100,
    runwayWidth: 400,
    numLanes: 4,
    spawnRate: 3000,
}

// reserve keyboard vars
let Up, Down, poseKeys;                     
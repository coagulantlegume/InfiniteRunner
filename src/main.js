let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 600,
    scene: [Menu, Play, Gameover],
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
    spawnRate: 4000,
}

// reserve keyboard vars
let Up, Down, poseKeys, keySpace;                     
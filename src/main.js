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
    scrollSpeed: 200,
    runwayWidth: 400,
    numLanes: 4,
    spawnRate: 2000,
    distanceCounter: 0,
    runwaytopY: 50,
    stages: {
        currentStage: 1,
        // Stage 1
        scrollSpeed1: 200,
        spawnRate1: 2000,
        duration1: 10000,
        // Stage 2
        scrollSpeed2: 400,
        spawnRate2: 1000,
        duration2: 10000,
        // Stage 3
        scrollSpeed3: 600,
        spawnRate3: 500,
        duration3: 100000,
    },
}

// reserve keyboard vars
let Up, Down, poseKeys, keySpace;                     
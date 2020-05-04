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
    scrollSpeed: 0,
    runwayWidth: 345,
    numLanes: 4,
    spawnRate: 0,
    poseDist: 0,
    distanceCounter: 0,
    runwaytopY: 102,
    playerXpos: 200,
    stages: {
        currentStage: 1,
        // Stage 1
        scrollSpeed1: 300,
        spawnRate1: 2000,
        poseDist1: 1.5,
        duration1: 20000,
        // Stage 2
        scrollSpeed2: 400,
        spawnRate2: 700,
        poseDist2: 2.,
        duration2: 20000,
        // Stage 3
        scrollSpeed3: 550,
        spawnRate3: 500,
        poseDist3: 2.5,
        duration3: 20000,
        // Stage 4
        scrollSpeed4: 700,
        spawnRate4: 300,
        poseDist4: 3,
        duration4: 20000,
    },
}

// reserve keyboard vars
let Up, Down, poseKeys, keySpace;                     
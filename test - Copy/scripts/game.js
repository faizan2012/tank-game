const config = {
    key: 'game',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    height: 600,
    width: 800,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y: 0}
        }
    },
    scene: [menu, Boot]
};


var game = new Phaser.Game(config);
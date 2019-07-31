class menu extends Phaser.Scene {

    constructor(){
        super('mainmenu')
    }

    preload() {
        this.load.image('tankbg', 'assets/tank.png');
        this.load.bitmapFont('ice', 'assets/iceicebaby.png', 'ASSETS/iceicebaby.xml');
    }

    create() {
        this.add.image(400, 300, 'tankbg');

        //MENU BUTTONS & ON INPUT FUNCTION

        var start = this.add.dynamicBitmapText(250, 230, 'ice', 'START GAME', 50);
        start.inputEnabled = true;
        start.setInteractive();
        start.on('pointerdown', function(pointer){
            this.scene.start('uno');
        }, this) 

        var options = this.add.dynamicBitmapText(312, 290, 'ice', 'OPTIONS', 50);
        options.inputEnabled = true;
        options.setInteractive();
        options.on('pointerdown', function(pointer){
            this.scene.start('settings');
        }, this) 

        

       
    }
    


    
}
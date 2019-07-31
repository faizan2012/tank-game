class Boot extends Phaser.Scene {

    constructor(){
        super('uno');
    }    

    preload() {

        this.load.atlas ('player', 'assets/tanks.png', 'assets/tanks.json');
        this.load.atlas ('player2', 'assets/enemy-tanks.png', 'assets/tanks.json');
        this.load.image('earth', 'assets/scorched_earth.png');
        this.load.image('bullet', 'assets/Fireball.png');
        this.load.image('crosshair', 'assets/crosshair.png');
        this.load.spritesheet('explosive', 'assets/explosion.png', 
        { frameWidth: 64, frameHeight: 64});
    }   


    create() {

        //load map and camera is fixed to map
        map = this.add.tileSprite(0, 0, 2000, 2000, 'earth');
        this.physics.world.setBounds(-1000, -1000, 2000, 2000);
        this.cameras.main.setBounds(-1000, -1000, 2000, 2000);
        map.fixedToCamera = true;

        //add cursor input
        cursors = this.input.keyboard.createCursorKeys();

        //spawn multiple enemies      
        for (var i = 0; i < blength; i++)
        {
            this.physics.add.existing (new Enemy(this, Phaser.Math.Between(0, this.game.config.width), Phaser.Math.Between(0, this.game.config.height)));
        }

        //explosion pool
        this.anims.create({
            key: 'kaboom',
            frames: this.anims.generateFrameNumbers('explosive'),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
            });


        
        
    
            
        //add player object
        player = this.physics.add.sprite(config.width/2, config.height/2, 'player', 'tank1');
        player.setOrigin(0.5, 0.5);
        player.setCollideWorldBounds(true);
        player.body.immovable = true;
        player.body.drag.set(0.2);
        player.body.maxVelocity.setTo(400, 400);
        player.body.bounce.setTo(1, 1);      
        playershadow = this.physics.add.image(0, 0, 'player', 'shadow').setAlpha(0.6);
        playershadow.setOrigin(0.5, 0.5);
        player.health = 3;
        player.alive = true;

        //camera follows player
        this.cameras.main.startFollow(player, true, 0.09, 0.08);

        //add turret on player object
        playerturret = this.physics.add.image(0, 0, 'player', 'turret');
        playerturret.setOrigin(0.3, 0.5);

        //create crosshair for player to aim
        this.recticle = this.add.image(0, 0, 'crosshair').setScale(0.06);

        //lock cursor into the game on mousedown
        game.canvas.addEventListener('mousedown', () => {
            game.input.mouse.requestPointerLock();
        });

        //crosshair should follow the mousemovement
        this.input.on('pointermove', (pointer) => {

            if(this.input.mouse.locked) {

                this.recticle.x += pointer.movementX;
                this.recticle.y += pointer.movementY;
            var angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(playerturret.x, playerturret.y, this.recticle.x, this.recticle.y);
            playerturret.setAngle(angle);
            }              
        }, this);

        //bullet class constructor
        playerBullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true 
        });
        enemyBullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        //shoot with pointerdown function
        this.input.on('pointerdown', (pointer,time,lastFired) => {
            if(this.input.mouse.locked){
                var bullet = playerBullets.get().setActive(true).setVisible(true);
                if(bullet){
                    bullet.fire(playerturret, this.recticle);
                }
            }
        }, this);    
        
        
    }


    update(time, delta, velocity) {
      
        playerturret.x = player.x;
        playerturret.y = player.y;

        playershadow.x = player.x;
        playershadow.y = player.y;

        /*//make reticle move with player tank
        this.recticle.body.velocity.x = player.body.velocity.x;
        this.recticle.body.velocity.y = player.body.velocity.y;*/

        if (cursors.left.isDown)
        {
            player.angle -= 4;
            this.recticle.angle += 4;
        }
        else if (cursors.right.isDown)
        {
            player.angle += 4;
            this.recticle.angle -= 4;
        }

        if (cursors.up.isDown)
        {
            //  The speed we'll travel at
            currentSpeed = 300;
        }
        else
        {
            if (currentSpeed > 0)
            {
                currentSpeed -= 4;
            }
        }

        if (currentSpeed > 0)
        {
           this.physics.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);
        }

        



    }


    


    









}

var cursors;
var currentSpeed;
var player;
var tank;
var enemyTurret;
var enemyShadow;
var playerturret;
var recticle;
var playershadow;
var map;
var enemy;
var blength = 5;
var playerBullets;
var enemyBullets;
var explosions;
var play




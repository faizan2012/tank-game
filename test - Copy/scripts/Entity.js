class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key, type);
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.enemy = this.scene.physics.add.sprite(x, y, 'player2', 'tank1');
        this.enemy.setOrigin(0.5, 0.5);
        this.enemy.body.immovable = false;
        this.enemy.body.collideWorldBounds = true;
        this.enemy.body.bounce.setTo(1, 1);
        this.enemy.health = 3;
        this.enemy.alive = true;
        this.enemy.lastFired = 0;

        this.turret = this.scene.add.image(x, y, 'player2', 'turret');
        this.turret.setOrigin(0.3, 0.5);
        

        this.shadow = this.scene.add.image(x, y, 'player2', 'shadow');
        this.shadow.setOrigin(0.5, 0.5);
        this.shadow.setAlpha(0.7);
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.events.on('update', this.update, this);
        


    }
    update(time, delta) {

    

        this.turret.x = this.enemy.x;
        this.turret.y = this.enemy.y;

        this.shadow.x = this.enemy.x;
        this.shadow.y = this.enemy.y;

        this.enemy.setVelocityX(100);

        this.scene.physics.world.collide(this.enemy, player);
        this.scene.physics.world.collide(this.enemy, playerBullets, enemyHitCallback, null, this);
        this.scene.physics.world.collide(player, enemyBullets, playerHitCallback, null, this);

        this.turret.rotation = Phaser.Math.Angle.Between(this.turret.x, this.turret.y, player.x, player.y);

       

        function enemyHitCallback(enemyHit, bulletHit)
        {
            // Reduce health of enemy
            if (bulletHit.active === true && enemyHit.active === true)
            {
                enemyHit.health = enemyHit.health - 1;
                console.log("Enemy hp: ", enemyHit.health);
        
                // Kill enemy if health <= 0
                if (enemyHit.health <= 0)
                {    
                   this.explosion = new Explosion(this, this.enemy.x, this.enemy.y);         
                   this.enemy.setActive(false).setVisible(false);
                   this.turret.setActive(false).setVisible(false);
                   this.shadow.setActive(false).setVisible(false);
                                                      
                }
                                
        
                // Destroy bullet
                bulletHit.setActive(false).setVisible(false);
            }
            
        }

        function enemyFire (enemy, player, time)
        {
            if(enemy.active === false)
            {
                return;
            }

            if((time - enemy.lastFired) > 2100)
            {
                enemy.lastFired = time;

                var bullez = enemyBullets.get().setActive(true).setVisible(true);

                if (bullez)
                {
                    bullez.fire(enemy, player);
                }
                
            }
        }
        enemyFire(this.enemy, player, time, this);

        //playerhit function
        function playerHitCallback(playerHit, bulletHit)
        {
            if (bulletHit.active === true && playerHit.active === true)
            {
                playerHit.health = playerHit.health -1;
                console.log('player hp', playerHit.health);

                if (playerHit.health <= 0)
                {
                  
                    player.setActive(false).setVisible(false);
                    playerturret.setActive(false).setVisible(false);
                    playershadow.setActive(false).setVisible(false);
                    //this.anims.play('kaboom');            
                   
                }
                bulletHit.setActive(false).setVisible(false);
            }
            
        }

            
    }
    
}


var Bullet = new Phaser.Class ({
    Extends: Phaser.GameObjects.Image,

    initialize:
    
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.speed = 0.5;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12,12, true);
        this.setScale(0.04);
    },
    fire: function(playerturret, target){
        this.setPosition(playerturret.x, playerturret.y);
        this.direction = Math.atan((target.x-this.x) / (target.y-this.y))
        if (target.y >= this.y){
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else{
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }
        this.rotation = playerturret.rotation;
        this.born = 0;
        //console.log(this.xSpeed, this.ySpeed);
    },

    update: function(time, delta){
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1200){
            this.setActive(false);
            this.setVisible(false);
        }
    }
});


class Explosion extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y, texture){
    super(scene,x,y,texture = 'explosive');
    scene.add.existing(this);
    this.play('kaboom');
    }
}
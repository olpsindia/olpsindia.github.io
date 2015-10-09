var game = new Phaser.Game(800, 600, Phaser.AUTO, 'sneeze', {preload: preload, create: create, update: update});

function preload() {
    game.load.image('medicine', 'bug.png');
    game.load.image('vampire', 'vampire.png');
    game.load.image('human', 'man.png');
}

var medicineSprite;
var humanSprite;
var humanSprite2;
var humanSprite3;
var vampireSprite;
var counter = 0;
var refreshCounter = 0;
var humans;
var human;
var vampires;
var vampire;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#ff1';
    var xposition = 0, yposition = 0;
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    humans = game.add.group();
    humans.enableBody = true;
    humans.physicsBodyType = Phaser.Physics.ARCADE;
    humans.createMultiple(5, 'human');
    humans.setAll('checkWorldBounds', true);
    humans.setAll('collideWorldBounds', true);
   
    // Create humans group
    for(var i = 0 ; i<5;i++){
        var human = humans.getFirstExists(false);
        human.reset(game.world.randomX, game.world.randomY);   
        human.body.collideWorldBounds=true;
    }
    
    // Initialize vampires group but show only one
    vampires = game.add.group();
    vampires.enableBody = true;
    vampires.physicsBodyType = Phaser.Physics.ARCADE;
    vampires.createMultiple(7, 'vampire');
    vampires.setAll('checkWorldBounds', true);
    vampires.setAll('collideWorldBounds', true);
    vampire = vampires.getFirstExists(false);
    vampire.reset(game.world.randomX, game.world.randomY);   
    vampire.body.collideWorldBounds=true;
    
    /*game.physics.startSystem(Phaser.Physics.ARCADE);
    vampireSprite = game.add.sprite(500, 800, 'vampire', 'vampire');
    game.physics.enable(vampireSprite, Phaser.Physics.ARCADE);
    vampireSprite.body.collideWorldBounds=true;*/

}

function update() {    
    refreshCounter ++;    
    if(refreshCounter%50==0) {
            humans.forEach(function(human) {
            var gen1 = Math.floor(Math.random() * 3);
            var gen2 = Math.floor(Math.random() * 3);
            var valX = 100;
            var valY = 100;
            if(gen1 == 2) {
                valX = -300;
            }
            if(gen2 == 1) {
                valY = -300;
            }
            
            human.body.velocity.x = valX;
            human.body.velocity.y = valY;
                
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.overlap(humans, vampires, collisionHandler, null, this);        
        });
        
    vampires.forEach(function(vampire){
        var val3X=300;
        var val3Y=300;
        if(Math.floor(Math.random() * 2) == 1) {
            val3X = -300;
        }
        if(Math.floor(Math.random() * 2) == 0) {
            val3Y = -300;
        }  

        vampire.body.velocity.x = val3X;
        vampire.body.velocity.y = val3Y;    
        
    });   
        
    refreshCounter = 0;
    
    }
        
    
    /*if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        medicineSprite.body.velocity.x = 500;
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        medicineSprite.body.velocity.x = -500;
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        medicineSprite.body.velocity.y = -500;
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        medicineSprite.body.velocity.y = 500;
    }else{
        medicineSprite.body.velocity.x = 0;
        medicineSprite.body.velocity.y = 0;
    }*/
    
}

function collisionHandler(obj1, obj2) {
    obj1.kill();
    var vampire = vampires.getFirstExists(false);
    vampire.reset(obj1.x, obj1.y);   
    vampire.body.collideWorldBounds=true;
    
}
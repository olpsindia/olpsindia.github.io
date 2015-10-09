var game = new Phaser.Game(800, 600, Phaser.AUTO, 'sneeze', {preload: preload, create: create, update: update});

function preload() {
    game.load.image('doctor', 'doctor.png');
    game.load.image('safeman', 'safeman.png');
    game.load.image('vampire', 'vampire.png');
    game.load.image('human', 'man.png');
    game.load.image('logo','logo.png');
    game.load.image('gameover','gameover.png');
    game.load.image('howToPlay','howToPlay.png');
    game.load.image('youwin','youwin.png');   
    game.load.audio('boden',['music.mp3', 'music.ogg']);
    game.load.audio('sfx', 'fx_mixdown.ogg');
    
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
var doctor;
var safemans;
var logo;
var gameover;
var howToPlay;
var timer;
var isGameStarted = false;
var youwin;
//var music;
var fx;
function step0()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#00FF99';
    var xposition = 0, yposition = 0;
    fx = game.add.audio('sfx');
    fx.addMarker('numkey', 9, 0.1);
    fx.addMarker('ping', 10, 1.0);
    
    music = game.add.audio('boden');
    music.play();
    
    logo = game.add.sprite(200, 200,'logo');
    logo.inputEnabled = true;
    logo.events.onInputDown.add(removeLogo,this);
}

function step1(){
    //timer = game.time.now + 2000;
    howToPlay = game.add.sprite(game.world.centerX,game.world.centerY,'howToPlay');
    howToPlay.anchor.setTo(.5,.5);
    howToPlay.inputEnabled = true;
    howToPlay.events.onInputDown.add(removeHowToPlay,this);
    
   
}

function step2(){
    humans = game.add.group();
    humans.enableBody = true;
    humans.physicsBodyType = Phaser.Physics.ARCADE;
    humans.createMultiple(10, 'human');
    humans.setAll('checkWorldBounds', true);
    humans.setAll('collideWorldBounds', true);
   
    /**/
    
    // Create humans group
    for(var i = 0 ; i<10;i++){
        var human = humans.getFirstExists(false);
        human.reset(game.world.randomX, game.world.randomY);   
        human.body.collideWorldBounds=true;
    }
    
    // Initialize vampires group but show only one
    vampires = game.add.group();
    vampires.enableBody = true;
    vampires.physicsBodyType = Phaser.Physics.ARCADE;
    vampires.createMultiple(15, 'vampire');
    vampires.setAll('checkWorldBounds', true);
    vampires.setAll('collideWorldBounds', true);
    vampire = vampires.getFirstExists(false);
    vampire.reset(game.world.randomX, game.world.randomY);   
    vampire.body.collideWorldBounds=true;
    
    // Initialize safe peoples
    safemans = game.add.group();
    safemans.enableBody = true;
    safemans.physicsBodyType = Phaser.Physics.ARCADE;
    safemans.createMultiple(10, 'safeman');
    safemans.setAll('checkWorldBounds', true);
    safemans.setAll('collideWorldBounds', true);
    
    // doctor sprite
    game.physics.startSystem(Phaser.Physics.ARCADE);
    doctor = game.add.sprite(0, 0, 'doctor', 'doctor');
    game.physics.enable(doctor, Phaser.Physics.ARCADE);
    doctor.body.collideWorldBounds=true;
    
    isGameStarted = true;
}


function create() {
    step0();

}

function update() {
    
    if(! isGameStarted) {
        return;
    }
    
    if(humans.countLiving()==0 && vampires.countLiving()==0 && safemans.countLiving()==0){
     return;   
    }
    
    
    if(humans.countLiving()==0 ){
        if(vampires.countLiving()<=5){
            youwin = game.add.sprite(game.world.centerX, game.world.centerY,'youwin');
            youwin.anchor.setTo(.5,.5);
        }else {
            gameover = game.add.sprite(game.world.centerX,game.world.centerY,'gameover');
            gameover.anchor.setTo(.5,.5);
        }
        humans.callAll('kill');
        vampires.callAll('kill');
        safemans.callAll('kill');  
        doctor.kill();
    }
    
    
    /*if(humans.countLiving()==0 && vampires.countLiving()<3){
        //alert(vampires.countLiving());
        youwin = game.add.sprite(game.world.centerX, game.world.centerY,'youwin');
        youwin.anchor.setTo(.5,.5);
        //alert("No normal human remaining");
        humans.callAll('kill');
        vampires.callAll('kill');
        safemans.callAll('kill');  
        doctor.kill();
    }else if(humans.countLiving()==0 && vampires.countLiving()>=3){
        //alert(vampires.countLiving());
        gameover = game.add.sprite(game.world.centerX,game.world.centerY,'gameover');
        gameover.anchor.setTo(.5,.5);
        
        humans.callAll('kill');
        vampires.callAll('kill');
        safemans.callAll('kill');
        doctor.kill();
    } */
    
    refreshCounter ++;    
    if(refreshCounter%50==0) {
            humans.forEach(function(human) {
            var gen1 = Math.floor(Math.random() * 3);
            var gen2 = Math.floor(Math.random() * 3);
            var valX = 100;
            var valY = 100;
            if(gen1 == 2) {
                valX = -100;
            }
            if(gen2 == 1) {
                valY = -100;
            }
            
            human.body.velocity.x = valX;
            human.body.velocity.y = valY;
                
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.overlap(humans, vampires, collisionHandler, null, this);
                
        });
        
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.overlap(doctor, humans, collisionWithDoctor, null, this);    
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
        
    safemans.forEach(function(safeman){
        var val3X=100;
        var val3Y=100;
        if(Math.floor(Math.random() * 2) == 1) {
            val3X = -100;
        }
        if(Math.floor(Math.random() * 2) == 0) {
            val3Y = -100;
        }  

        safeman.body.velocity.x = val3X;
        safeman.body.velocity.y = val3Y;
    });    
        
    refreshCounter = 0;
    
    }
        
    
    if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        doctor.body.velocity.x = 500;
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        doctor.body.velocity.x = -500;
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        doctor.body.velocity.y = -500;
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        doctor.body.velocity.y = 500;
    }else{
        doctor.body.velocity.x = 0;
        doctor.body.velocity.y = 0;
    }
    
    
    game.debug.text('Safe peoples in the city:'+ counter+'',20,20);
}

function collisionHandler(obj1, obj2) {
    obj1.kill();
    fx.play('ping');
    var vampire = vampires.getFirstExists(false);
    vampire.reset(obj1.x, obj1.y);   
    vampire.body.collideWorldBounds=true;
}

function collisionWithDoctor(obj3, obj4){
    obj4.kill();
    fx.play('numkey');
    var safeman = safemans.getFirstExists(false);
    safeman.reset(obj4.x, obj4.y);   
    safeman.body.collideWorldBounds=true;
    counter = counter + 1;
}

function removeLogo(){
    logo.kill();   
    step1();
}

function removeHowToPlay(){
    //game.input.onDown.remove(howToPlay, this);
    howToPlay.kill();
    step2();
}

function stopGame(){
       
}
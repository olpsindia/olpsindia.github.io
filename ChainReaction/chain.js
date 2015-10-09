var game = new Phaser.Game(300,400,Phaser.CANVAS,'chain-reaction',{preload: preload, create:create,update:update,render:render});

function preload(){
    game.load.image('block','block.png');
    //game.load.image('atom-1','atom-1.png');
    game.load.image('atom-2','atom-2.png');
    game.load.image('atom-3','atom-3.png');
    game.load.image('green-atom-1','green-atom-1.png');
    game.load.image('red-atom-1','red-atom-1.png');
    game.load.image('howtoplay1','./HowToPlay/howtoplay1.png');
    game.load.image('howtoplay2','./HowToPlay/howtoplay2.png');
    game.load.image('continue','continue.png');
    game.load.image('play','play.png');
}
    
function step1() {
    howtoplay1sprite =  game.add.sprite(0,0,'howtoplay1');   
    howtoplay1sprite.inputEnabled = true;
    howtoplay1sprite.events.onInputDown.add(step2,this);
    cont = game.add.sprite(220,350,'continue');
    cont.anchor.x = .5;
    cont.anchor.y = .5;
    
}
function step2(){
    howtoplay1sprite.kill();
    cont.kill();
    howtoplay2sprite =  game.add.sprite(3,3,'howtoplay2');   
    howtoplay2sprite.inputEnabled = true;
    howtoplay2sprite.events.onInputDown.add(step3,this);
    play = game.add.sprite(220,350,'play');
    play.anchor.x = .5;
    play.anchor.y = .5;
}
function step3(){
    play.kill();
    howtoplay2sprite.kill();
    createGame();    
}
var matrix = new Array();
var atomMatrix = new Array();
var atomSpriteMatrix = new Array();
var blockWidth ;
var blockHeight;
var noOfHoizBlock = 6;
var noOfVertBlock = 9;
var firstX=0;
var lastX;
var firstY=0;
var lastY;
var lineColor = '#ff0000';
var player1 = 'red';
var player2 = 'green';
var currentPlayer = player1;
var blockOwner = new Array();
var horzLines = new Array();
var verLines = new Array();
var startCounter = 1;
var stateText ;
var blocks;
var howtoplay1sprite;
var howtoplay2sprite;
var cont;
var play;
function create()
{
    step1();
}

function createGame()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    
    blockWidth = Math.floor (game.world.width/noOfHoizBlock);
    blockHeight = Math.floor (game.world.height/noOfVertBlock);
    
    
    blocks = game.add.group();
    for(var x = 0; x <= noOfHoizBlock; x++)
    {
        
       horzLines[x] = new Phaser.Line(x*blockWidth,0,x*blockWidth,game.world.height);
    }
    
    for(var y = 0; y <= noOfVertBlock; y++){
        verLines[y] = new Phaser.Line(0,y*blockHeight,300,y*blockHeight);
    }
    
    for(var x = 0; x <= noOfHoizBlock; x++)
    {
        var blockArray = new Array();
        
        for(var y = 0; y < noOfVertBlock; y++)
        {
            var block = blocks.create(x*blockWidth,y*blockHeight ,'block');
            block.inputEnabled = true;
            block.events.onInputDown.add(clickHandler, this);
            var obj = {
                
                block :block,
                atomSprite:[],
                atomsNumber:0,
                blockOwner:null
            };
            
            blockArray[y] = obj;
            if(y == noOfVertBlock-1)
                lastY = y * blockHeight;
            
        }
        matrix[x] = blockArray;
        if(x == noOfHoizBlock-1)
            lastX = x * blockWidth;
    }

}

function clickHandler(block)
{
    var i = block.x/blockWidth;
    var j = block.y/blockHeight;
    
    if(matrix[i][j].blockOwner==null)
        matrix[i][j].blockOwner = currentPlayer;
    console.log(matrix[i][j].blockOwner);
    if(currentPlayer == matrix[i][j].blockOwner)
    {
       
         addAtom(block);
        if(startCounter>2)
            checkForWinner();
        else
            startCounter++;
        
        switchPlayer();
    }    
}

function checkForWinner()
{
    var player1Counter = 0;
    var player2Counter = 0;
    
       matrix.forEach(function(blocks){
       
            blocks.forEach(function(block){
               if(block.blockOwner != null && block.blockOwner == player1)
                   player1Counter++;
               if(block.blockOwner != null && block.blockOwner == player2)
                   player2Counter++;
            });
           
       });
    
    if( player1Counter == 0 || player2Counter == 0 ) {
        console.log("Winner is "+currentPlayer+" Player :)");
        blocks.callAll('kill');
        
        alert("Winner is "+currentPlayer+" Player :)\n Refresh page to Play Again");
        
    }
        
}

function switchPlayer()
{   
    if(currentPlayer == player1)
    {
        currentPlayer = player2;
        lineColor = '';
    }
    else
    {
        currentPlayer = player1;
        lineColor = '#ff0000';
    }
}

function addAtom(block){
    
    var i = block.x/blockWidth;
    var j = block.y/blockHeight;
    var blockX = block.x;
    var blockY = block.y;
    var fusionPoint = getBlockAtomFusionPoint(blockX,blockY);    
        
    if(fusionPoint == 3)
    {
        var noOfAtomsInBlock = matrix[i][j].atomsNumber;
            
        if(noOfAtomsInBlock == fusionPoint)
        {  
                   
            matrix[i][j].atomsNumber = 0;
                
            matrix[i][j].blockOwner = null;
            
            if(matrix[i][j].atomSprite.length>0)
            {
                matrix[i][j].atomSprite.forEach(function(atom){
                    atom.kill();
                });
            }
                    
            addAtom(matrix[i-1][j].block);
            addAtom(matrix[i][j-1].block);
            addAtom(matrix[i+1][j].block);
            addAtom(matrix[i][j+1].block);
        }
        else
        {
           
            if(matrix[i][j].blockOwner !=  currentPlayer)
            {
                    matrix[i][j].atomSprite.forEach(function(atom){
                    atom.kill();
                    createAtom(0,i,j); 
                });
            }
            
            createAtom(++noOfAtomsInBlock,i,j);            
            matrix[i][j].atomsNumber = noOfAtomsInBlock;
            
        }
    }  
    
    if(fusionPoint == 2)
    {
        var noOfAtomsInBlock = matrix[i][j].atomsNumber;

        if(lastX == blockX)
        {
            if(noOfAtomsInBlock == fusionPoint)
            {
                
                matrix[i][j].atomsNumber = 0;
                
                if(matrix[i][j].atomSprite.length>0)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                    });
                }
                
                matrix[i][j].blockOwner = null;
                
                addAtom(matrix[i-1][j].block);
                addAtom(matrix[i][j-1].block);
                addAtom(matrix[i][j+1].block);
            }
            else
            {
                if(matrix[i][j].blockOwner !=  currentPlayer)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                        createAtom(0,i,j); 
                    });
                }
                
                createAtom(++noOfAtomsInBlock,i,j);
                matrix[i][j].atomsNumber = noOfAtomsInBlock;
            }
        }
         
        if(firstX == blockX)
        {
            
            if(noOfAtomsInBlock == fusionPoint)
            {
                matrix[i][j].atomsNumber = 0;
                
                if(matrix[i][j].atomSprite.length>0)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                    });
                }
                
                matrix[i][j].blockOwner = null;
                
                addAtom(matrix[i+1][j].block);
                addAtom(matrix[i][j-1].block);
                addAtom(matrix[i][j+1].block);
            }
            else
            {
                if(matrix[i][j].blockOwner !=  currentPlayer)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                        createAtom(0,i,j); 
                    });
                }
                
                createAtom(++noOfAtomsInBlock,i,j);
                matrix[i][j].atomsNumber = noOfAtomsInBlock;
            }
        }
        
        if(lastY == blockY)
        {
            if(noOfAtomsInBlock == fusionPoint)
            {
                matrix[i][j].atomsNumber = 0;
                
                if(matrix[i][j].atomSprite.length>0)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                    });
                }
                
                matrix[i][j].blockOwner = null;
                
                addAtom(matrix[i+1][j].block);
                addAtom(matrix[i][j-1].block);
                addAtom(matrix[i-1][j].block);
            }
            else
            {
                if(matrix[i][j].blockOwner !=  currentPlayer)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                        createAtom(0,i,j); 
                    });
                }
                
                createAtom(++noOfAtomsInBlock,i,j);
                matrix[i][j].atomsNumber = noOfAtomsInBlock;
            }
        }
        
        if(firstY == blockY)
        {
            if(noOfAtomsInBlock == fusionPoint)
            {
                
                matrix[i][j].atomsNumber = 0;
                
                if(matrix[i][j].atomSprite.length>0)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                    });
                }
                
                matrix[i][j].blockOwner = null;
                
                addAtom(matrix[i+1][j].block);
                addAtom(matrix[i][j+1].block);
                addAtom(matrix[i-1][j].block);
            }
            else
            {
                if(matrix[i][j].blockOwner !=  currentPlayer)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                        createAtom(0,i,j); 
                    });
                }
                createAtom(++noOfAtomsInBlock,i,j);
                matrix[i][j].atomsNumber = noOfAtomsInBlock;
            }
        }
    }
        
    if(fusionPoint == 1)
    {
        var noOfAtomsInBlock = matrix[i][j].atomsNumber;
                    
        if(firstX == blockX && firstY == blockY)
        {
            if(noOfAtomsInBlock == fusionPoint)
            {
                matrix[i][j].atomsNumber = 0;
                    
                if(matrix[i][j].atomSprite.length>0)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                    });
                }
                    
                matrix[i][j].blockOwner = null;
    
                addAtom(matrix[i+1][j].block);
                addAtom(matrix[i][j+1].block);
            }
            else
            {
                if(matrix[i][j].blockOwner !=  currentPlayer)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                        createAtom(0,i,j); 
                    });
                }
                createAtom(++noOfAtomsInBlock,i,j);
                matrix[i][j].atomsNumber = noOfAtomsInBlock;
            }
        }
        
        if(firstX == blockX && lastY == blockY)
        {
            if(noOfAtomsInBlock == fusionPoint)
            {
                matrix[i][j].atomsNumber = 0;
                    
                if(matrix[i][j].atomSprite.length>0)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                    });
                }
                        
                matrix[i][j].blockOwner = null;
                    
                addAtom(matrix[i+1][j].block);
                addAtom(matrix[i][j-1].block);
            }
            else
            {
                if(matrix[i][j].blockOwner !=  currentPlayer)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                        createAtom(0,i,j); 
                    });
                }
                createAtom(++noOfAtomsInBlock,i,j);
                matrix[i][j].atomsNumber = noOfAtomsInBlock;
            }
        }
        if(lastX == blockX && firstY == blockY)
        {
            if(noOfAtomsInBlock == fusionPoint)
            {
                matrix[i][j].atomsNumber = 0;
                    
                if(matrix[i][j].atomSprite.length>0)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                    });
                }
                    
                matrix[i][j].blockOwner = null;
                    
                addAtom(matrix[i][j+1].block);
                addAtom(matrix[i-1][j].block);
            }
            else
            {
                if(matrix[i][j].blockOwner !=  currentPlayer)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                        createAtom(0,i,j); 
                    });
                }
                createAtom(++noOfAtomsInBlock,i,j);
                matrix[i][j].atomsNumber = noOfAtomsInBlock;
            }
        }
        
        if(lastX == blockX && lastY == blockY)
        {
            if(noOfAtomsInBlock == fusionPoint)
            {
                        
                matrix[i][j].atomsNumber = 0;
                    
                if(matrix[i][j].atomSprite.length>0)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                    });
                }
                    
                matrix[i][j].blockOwner = null;
                    
                addAtom(matrix[i][j-1].block);
                addAtom(matrix[i-1][j].block);
            }
            else
            {
                if(matrix[i][j].blockOwner !=  currentPlayer)
                {
                    matrix[i][j].atomSprite.forEach(function(atom){
                        atom.kill();
                        createAtom(0,i,j); 
                    });
                }
                createAtom(++noOfAtomsInBlock,i,j);
                matrix[i][j].atomsNumber = noOfAtomsInBlock;
            }
        }
    }          
}

function getBlockAtomFusionPoint(x,y)
{
    
    //LastX:250:LastY:352
    
    if( (x == firstX && y == firstY) || (x == firstX && y == lastY)
        || (x == lastX && y == lastY) || (x == lastX  && y == firstY))
       return 1;
       
       
    if( ( x == firstX  ||  y == firstY || x == lastX || y == lastY))
       return 2;
    
    return 3;
}

function createAtom(noOfAtom,i,j)
{
    var x = matrix[i][j].block.x + matrix[i][j].block.width/2;
    var y = matrix[i][j].block.y + matrix[i][j].block.height/2;
    if(noOfAtom == 2)
    {
        x-=10;
    }
    if(noOfAtom == 3)
    {
        y-=10;
    }
    
    var atomSprite = game.add.sprite(x,y,currentPlayer+'-atom-1');   
    atomSprite.anchor.x = 0.5;
    atomSprite.anchor.y = 0.5;
    game.physics.enable(atomSprite, Phaser.Physics.ARCADE);
    
    game.add.tween(atomSprite).to({x:x+5},500,Phaser.Easing.Circular.InOut , true,0,1000,true);
    
    matrix[i][j].atomSprite.push( atomSprite );
    matrix[i][j].blockOwner = currentPlayer;
}

function update(){
    
 
    
}

function render()
{
    
    for(var i = 0 ; i<= horzLines.length;i++)
    {
       game.debug.geom(horzLines[i], lineColor);
        
    }
    for(var i = 0 ; i<= verLines.length;i++)
    {
       game.debug.geom(verLines[i], lineColor);
        
    }
    
}

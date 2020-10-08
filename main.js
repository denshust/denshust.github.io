'use strict;'

// const btn = document.createElement('button');
// btn.innerText = 'New Button';
// document.body.appendChild(btn);
// btn.addEventListener('click',()=>{alert('vvv');}); 

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//var CANVAS_WIDTH = 1400;
//var CANVAS_HEIGHT = 780;
var white = '#ffffff'; //air
var red = '#ff0000'; //lava              !
var black = '#000000'; //wall            x
var yellow = '#ffbb00'; //coins          *
var green = '#006934';  //jumpPlatform   =
var blue = '#0000ff'; // player          @
var magenta = '#c702ae'; //platform      -
var iceblue = '#00ffff'; //ice           ~
var lightgreen = '#64ff4f'; //heal       +
var brown = '#9c5500'; //mud             ,
var scale = 0.5;
var size = 32*scale;
var level = [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "x     x+   !                                                              x",
    "x     x    !                                                              x",
    "x     x    !                                       +                      x",
    "x--x  x    !                                                              x",
    "x  x xx    !                                  +                           x",
    "x  x     x,,~~!!!~~~~,   x  x  xxxxxxxxx~~~~~~~~~                         x",
    "x  x      x   xxx        x x  x                                           x",
    "x  x~~~~  x              x x  x                                           x",
    "x            ,,,,,,,,,,,,x x  x                                           x",
    "x               $ + $ + $  x  x                                           x",
    "x                          x  x                                           x",
    "x=           ~~~~~~~~~~~~~~x  x                                           x",
    "x                          x  x                                           x",
    "x                          x  x                                           x",
    "x ~~  ,,  ,,,              x  x                                           x",
    "x              $           x  x                                           x",
    "x                          x  x                                           x",
    "x  ,,,,,,,,,,,   x         x  x                                           x",
    "x            x!!!x         x  x                                           x",
    "x            xxxxx         x  x                                           x",
    "xx,,,,,,,,x--x             x$ x                                           x",
    "x$        x  x             x $x                                           x",
    "x         x  x             x$ x                                           x",
    "x-------x-x--x             x $x                                           x",
    "x       x x  x             x$ x                                           x",
    "x       x x  x             x $x                                           x",
    "x xxxxxxx x--x             x+ x                                           x",
    "x       x x  x             x  x  $                                        x",
    "x   $   x x  x        x    x  x                                           x",
    "xxxxxxx x x  xxxxxxxx xxxxxx  xxxxxxxxxxxxxx                              x",
    "x       x x  x                             x          $                   x",
    "x@      x                                  x!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!x",
    "xxxxxxxxxxx==xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  
    
    ];
  var level1 = [

  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "x                                                                         x",
  "x    $      x    $                                                        x",
  "x  xxxxxxx  x                                                             x",
  "x  x     x  x                 $                                           x",
  "x  x     x  x                ~~~~                                         x",
  "x  x  xx x--x           ~~~                                               x",
  "x  x  x  x  x--                              @                            x",
  "x  x  x  x  x                                                             x",
  "x  x  x--x  x       ~--~                                                  x",
  "x  x  x--x  x       ~~~~                +                                 x",
  "x  x        x                                                             x",
  "x  x        x           ===                                               x",
  "x  xx----xxxx        $                    +                               x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x                                                                         x",
  "x            --- x!!!x          x       x   ++                            x",
  "xxxxx~~~~~~~xxxxxxxxxxxxxx===xxxx,,,,,,xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  
  ];
  var convertedLevel = [];
  
  var convertLevel = function(lvl)
  {
      
      for (let i = 0; i < lvl.length; i++)
      {
          convertedLevel.push(level[i].split(''));
      }
  }
  convertLevel(level);

canvas.width = convertedLevel[0].length*size;
canvas.height = convertedLevel.length*size;
var FPS = 60;
var then, now, past, fpsInterval;


function Object (x,y,width,height,color)
{
    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y;
    this.color=color;
}

var objects =[];

var playerPosX;
var playerPosY;
var gravitation = 0.8*scale
// гравець
var player = {
    width : size,
    height : size,
    xPrev:0,
    yPrev:0,
    x : 0,
    y : 0,
    xVelocity : 0,
    yVelocity : 0,
    color : blue,
    points:0,
    health:200,
    inAir:true,
    inLava:false,
    isDead:false
    
};

var controller= {
    left:false,
    right:false,
    up: false,
    down : false,
    KeyListener:function(evt)
    {
        var keyState = (evt.type == "keydown") ? true : false;
        switch(evt.keyCode)
        {
            case 37:
                controller.left = keyState;
                break;
            case 39:
                controller.right = keyState;
                break;
            case 38:
                controller.up = keyState;
                break;
            case 40:
                controller.down = keyState;
                break;
        }
    }
};


var drawTile = function(tile)
{
    context.fillStyle = tile.color;
    context.fillRect(tile.x,tile.y,tile.width,tile.height);
}

var readTile = function(tile)
{
    switch(tile){
        case "@":
            return blue
            break;
        case "x":
            return black
            break;
        case "!":
            return red
            break;
        case "$":
            return yellow
            break;
        case "-":
            return magenta
            break;
        case "~":
            return iceblue
            break;
        case "+":
            return lightgreen
            break;
        case "=":
            return green
            break;
        case ",":
            return brown
            break;
        default:
            return white
            break;
    }
}



var startAnimation = function(fps)
{
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    animation(then);
}

var animation = function(newTime) // кадри щосекунди
{
    window.requestAnimationFrame(animation);
    now = newTime;
    past = now - then;
    if(past > fpsInterval)
    {
        then = now - (past%fpsInterval);
        draw();
    }
}


var isCollided = function(obst, obj)
{
    
    if (obj.x+obj.width  > obst.x 
        && obj.x < obst.x + obst.width
        && obj.y < obst.y + obst.height
        && obj.y + obj.height  > obst.y)
        {
            //console.debug("coll");
            return true;
        }
        else
        {
            return false;
        }
}

var collideHandler = function(obst,obj,color)
{
    if (isCollided(obst,obj))
    {
        if(color==black||color==iceblue||color==green||color==brown)
        {
            if(obj.yPrev + obj.height <= obst.y)
            {
                obj.y = obst.y - obj.height;
                obj.yVelocity = 0;
                obj.inAir = false;
                if(color==green)
                obj.yVelocity=-6*scale;
                if(color==brown)
                obj.yVelocity=+7*scale;
               // console.debug("down : "+obj.x);
            }
            else if (obst.x + obst.width <= obj.xPrev) //зліва (obst.x + obst.width <= obj.xPrev)
            {
                obj.x = obst.x + obst.width;
                obj.xVelocity = 0;
                //console.debug("left : "+obj.x);
            }
            else if (obj.xPrev + obst.width <= obst.x) //справа
            {
                obj.x = obst.x - obj.width;
                obj.xVelocity = 0;
               // console.debug("right : "+obj.x);
            }
            else if (obj.yPrev > obst.y + obst.height)
            {
                obj.y = obst.y + obst.height;
                obj.yVelocity =0;
            }
            if(color==iceblue)
            obj.xVelocity*=1.2;
            if(color==brown)
            obj.xVelocity*=0.3;
            
        }
        if(color==red)
        {
            player.health-=1;
            if (player.health<=0)
            {
                player.health=0;
                player.isDead=true;
            }
            player.inLava=true;
        }
        if(color==magenta)
        {
            if (controller.down)
            {
                console.debug("down");
               // obj.y = obst.y + obst.height/2; 
            }
            else if(obj.yPrev + obj.height <= obst.y)
            {
                obj.y = obst.y - obj.height;
                obj.yVelocity = 0;
                obj.inAir = false;
               // console.debug("down : "+obj.x);
            }
            else if (obj.yPrev > obst.y + obst.height)
            {
                obj.y = obst.y + obst.height;
                obj.yVelocity *=1;
            }
            
        }
        if(color==lightgreen)
        {
            player.health+=100;
            return true;
        }
        if(color==yellow)
        {
            console.debug("COIN!!!!!!!!!!!!!!!!!!");
            player.points++;
            return true;
        }
        
    }
}

var showCounter = function()
{
   
    context.fillStyle = '#000000';
    context.font = 'normal 30px lucida console';
    
    context.fillText("time : " +time,convertedLevel[0].length*size-size*14,size*3);
    context.fillText("coins : " +player.points,convertedLevel[0].length*size-size*14,size*5);
    
    context.font = 'normal 10px lucida console';
    context.fillText(player.health,player.x-1,player.y-5);
}
var time =0;
var counter=0;
var timer = function()
{
    counter++
    if(counter==54)
    {
        time++;
        counter=0;
    }
}
var draw = function()
{
    timer();
   if(!player.isDead)
   {
    player.xPrev = player.x;
    player.yPrev = player.y;
    if (controller.up&& player.inAir == false)
    {
        player.yVelocity -= 15*scale;
        player.inAir = true;
    }
    
    if(controller.right)
    {
        player.xVelocity +=1*scale;
    }
    if (controller.left)
    {
        player.xVelocity -=1*scale;
    }
    
    for (let index = 0; index < objects.length; index++) 
    {
        drawTile(objects[index]);
    }
   }
  
     player.yVelocity+=gravitation;

    
  if(player.inLava)
  {
  player.xVelocity*=0.6;
  player.yVelocity+=0.4*scale;
  player.inLava=false;
  }
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    player.xVelocity *=0.8;
   
  

    for (let i = 0; i < objects.length; i++) {
       // collideHandler(objects[i],player,objects[i].color);
        if (collideHandler(objects[i],player,objects[i].color) == true)
        {
        objects[i].color = white;
        }
    }
    
    if(!player.isDead)
    {
    drawTile(player);
    }
    showCounter();
}


var setObjects=function()
{
    for (let i = 0; i < convertedLevel.length; i++)
    {
        for (let j = 0; j < convertedLevel[0].length; j++) 
        {
            //drawTile(size*j,size*i,size,size,readTile(convertedLevel[i][j])) ;
            let object = new Object(size*j,size*i,size,size,readTile(convertedLevel[i][j]));
            objects.push(object);
            if(object.color==blue)
            {  
                player.x = object.x;
                player.y = object.y;
                console.debug(object.color);
                object.color=white;
          
            }
            
        }
    }
}




setObjects();
startAnimation(FPS);
//  drawOnce();

window.addEventListener("keydown",controller.KeyListener);
window.addEventListener("keyup",controller.KeyListener);





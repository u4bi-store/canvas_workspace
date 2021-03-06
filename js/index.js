/*index js*/

var myGamePiece;
var redGamePiece, blueGamePiece, yellowGamePiece;
var btnUp, btnDown, btnLeft, btnRight;

var myObstacles = [];

var myScore;
var myBackground;
var mySound;
var myMusic;

var myGameArea = {
  canvas : document.createElement("canvas"),
    start: function(){
      this.canvas.width = 480;
      this.canvas.height = 270;
      // this.canvas.style.cursor = 'none'; /* cursor hide*/
      this.context = this.canvas.getContext("2d");
    
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.frameNo = 0;
      this.interval = setInterval(updateGameArea, 20);
      window.addEventListener('keydown', function(e){
        myGameArea.keys = (myGameArea.keys || []);
        myGameArea.keys[e.keyCode] = true;
      } );
      window.addEventListener('keyup', function(e){
        myGameArea.keys[e.keyCode] = false;
      } );
      // window.addEventListener('mousemove', function(e) {
      //   myGameArea.x = e.pageX;
      //   myGameArea.y = e.pageY;
      // } );
      window.addEventListener('touchmove', function(e) {
        myGameArea.x2 = e.touches[0].screenX;
        myGameArea.y2 = e.touches[0].screenY;
      } );
      window.addEventListener('mousedown',  function(e) {
        myGameArea.x = e.pageX;
        myGameArea.y = e.pageY;
      } );
      window.addEventListener('mouseup',    function(e) {
        myGameArea.x = false;
        myGameArea.y = false;
      } );
      window.addEventListener('touchstart', function(e) {
        myGameArea.x = e.pageX;
        myGameArea.y = e.pageY;
      } );
      window.addEventListener('touchend',   function(e) {
        myGameArea.x = false;
        myGameArea.y = false;
      } );
      
    },
    clear: function(){
      this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    },
    stop: function(){
      clearInterval(this.interval);
    }
};

function init(){
  myGameArea.start();
  
  redGamePiece = new component(75,75, "red", 10, 10);
  blueGamePiece = new component(75,75, "yellow", 10, 100);
  yellowGamePiece = new component(75,75, "blue", 10, 200);
  
  myGamePiece = new component(30,30, 'images/smiley.gif', 2, 2, 'image'); /* x, y */
  
  btnUp = new component(30,30,'blue',50,10);
  btnDown = new component(30,30,'blue',50,70);
  btnLeft = new component(30,30,'blue',20,40);
  btnRight = new component(30,30,'blue',80,40);
  
  myScore = new component('30px', 'Consolas', 'black', 280, 40, 'text');
  myBackground = new component(480, 270, 'images/background.png', 0, 0, 'background');
  mySound = new sound('lib/bounce.mp3');
  myMusic = new sound('lib/background.mp3');
  myMusic.play();
};

function component(width, height, color, x, y, type){
  this.type = type;
  if(type == 'image' || type == 'background'){
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.gravity = 0.01;
  this.gravitySpeed = 0;
  this.x = x;
  this.y = y;
  this.update = function(){
    var ctx = myGameArea.context;
    
    if(this.type =='image' || this.type == 'background'){
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if(type == 'background'){
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    }
    else if(this.type == 'text'){
      ctx.font = this.width + ' ' + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }else{
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
  };
  this.clicked = function(){
    var left = this.x;
    var right = this.x + (this.width);
    
    var top = this.y;
    var bottom = this.y + (this.height);
    
    var area_x = myGameArea.x;
    var area_y = myGameArea.y;
    
    var clicked = true;
    if( (bottom < area_y)||(top > area_y)||(right < area_x)||(left > area_x) ) clicked = false;
    return clicked;
  };
  this.newPos = function(){
    this.x += this.speedX;
    if(this.type == 'background'){
      if(this.x == -(this.width)) this.x = 0;
      this.y += this.speedY;
    }else{
      this.gravitySpeed += this.gravity;
      this.y += this.speedY + this.gravitySpeed;
    }
    this.hitBottom();
  };
  this.hitBottom = function(){
    var rockbottom = myGameArea.canvas.height - this.height;
    if(this.y > rockbottom){
      this.y = rockbottom;
    }
  };
  this.crashWith = function(otherobj){
    var left = this.x;
    var right = this.x + (this.width);
    
    var top = this.y;
    var bottom = this.y + (this.height);
    
    var obj_left = otherobj.x;
    var obj_right = otherobj.x + (otherobj.width);
    var obj_top = otherobj.y;
    var obj_bottom = otherobj.y + (otherobj.height);
    
    var crash = true;
    if((bottom<obj_top)||(top>obj_bottom)||(right<obj_left)||(left>obj_right))crash = false;
    return crash;
  };
}

function updateGameArea(){
  if(isHit()){
    mySound.play();
    myGameArea.stop();
  }else{
    myGameArea.clear(); /* 지우고 다시 그리고하기 때문에 만약 clear을 주석처리하면 지나온 흔적을 남겨면서 그려짐*/
    // myGamePiece.x += 1;

    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update(); /* 배경이므로 캔버스가 그려지는 순서에 의해 앞렬*/

    keyoardCtrl();
    //mouseCtrl();
    //touchCtrl();
    //canvasCtrl();

    btnUp.update();
    btnDown.update();
    btnLeft.update();
    btnRight.update();
    myGamePiece.newPos();
    myGamePiece.update();


    redGamePiece.update();
    blueGamePiece.update();
    yellowGamePiece.update();

    redGamePiece.x +=2;
    blueGamePiece.x +=2;
    yellowGamePiece.x +=2;

    myGameArea.frameNo += 1;
    pushObstacle();
    updateObstacle();

    myScore.text='스코어: '+myGameArea.frameNo;
    myScore.update();
  }
}
/* move type
   @ type : up 0/down 1/left 2/right 3/
*/
function move(type){
  switch(type){
      case 0: myGamePiece.speedY -=2; break;
      case 1: myGamePiece.speedY +=2; break;
      case 2: myGamePiece.speedX -=2; break;
      case 3: myGamePiece.speedX +=2; break;
      default : myGamePiece.speedX = 0; myGamePiece.speedY = 0; break;
  }
}

function keyoardCtrl(){
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  var keys = myGameArea.keys;
  if(keys){
    if(keys[37]) myGamePiece.speedX = -1;
    if(keys[39]) myGamePiece.speedX =  1;
    if(keys[38]) myGamePiece.speedY = -1;
    if(keys[40]) myGamePiece.speedY =  1;
  }
}

function mouseCtrl(){
  var x = myGameArea.x;
  var y = myGameArea.y;
  
  if(x && y) myGamePiece.x = x; myGamePiece.y = y;
}

function touchCtrl(){
  var x = myGameArea.x2;
  var y = myGameArea.y2;
  
  if(x && y) myGamePiece.x = x; myGamePiece.y = y;
}

function canvasCtrl(){
  
  var x = myGameArea.x;
  var y = myGameArea.y;
  
  if(x && y){
    myGamePiece.image.src = 'images/angry.gif';
    
    if(btnUp.clicked()) myGamePiece.y -= 1;
    if(btnDown.clicked()) myGamePiece.y += 1;
    if(btnLeft.clicked()) myGamePiece.x -= 1;
    if(btnRight.clicked()) myGamePiece.x += 1;
    
  }else myGamePiece.image.src = 'images/smiley.gif';
}

function isHit(){
  for(i = 0; i<myObstacles.length; i++){
    if(myGamePiece.crashWith(myObstacles[i]))return true;
  }
}

function movingObstacle(num){
  myObstacles[num].x += -1;
}

function everyinterval(n){
  if((myGameArea.frameNo / n) % 1 == 0) return true;
  return false;
}

function pushObstacle(){
  var x, minH, maxH, height;
  var minGap, maxGap, gap;
  
  var no = myGameArea.frameNo;
  
  if( no == 1 || everyinterval(150)){
    x = myGameArea.canvas.width;
    minH = 20;
    maxH = 200;
    
    height = Math.floor(Math.random()*(maxH-minH+1) + minH);
    minGap = 50;
    maxGap = 200;
    
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    myObstacles.push(new component(10, height, 'green', x, 0));
    
    myObstacles.push(new component(10, x - height - gap, 'green', x,  height+gap));
  }
}

function updateObstacle(){
  for(i = 0; i< myObstacles.length; i++){
    movingObstacle(i);
    myObstacles[i].update();
  }
}

function sound(src){
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  };
  this.stop = function(){
    this.sound.pause();
  };
}

function accelerate(n) {
    myGamePiece.gravity = n;
}
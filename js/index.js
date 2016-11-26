/*index js*/

var myGamePiece;
var redGamePiece, blueGamePiece, yellowGamePiece;
var btnUp, btnDown, btnLeft, btnRight;

var myObstacle;

var myGameArea = {
  canvas : document.createElement("canvas"),
    start: function(){
      this.canvas.width = 480;
      this.canvas.height = 270;
      // this.canvas.style.cursor = 'none'; /* cursor hide*/
      this.context = this.canvas.getContext("2d");
    
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
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
  
  myGamePiece = new component(10,140, 'rgba(0, 0, 255, 0.5)', 2, 2); /* x, y */
  
  btnUp = new component(30,30,'blue',50,10);
  btnDown = new component(30,30,'blue',50,70);
  btnLeft = new component(30,30,'blue',20,40);
  btnRight = new component(30,30,'blue',80,40);
  
  myObstacle = new component(10, 200, 'green', 300, 120);
};

function component(width, height, color, x, y){
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function(){
    var ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
    this.y += this.speedY;
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
  if(isHit()) return myGameArea.stop();
  
  myGameArea.clear(); /* 지우고 다시 그리고하기 때문에 만약 clear을 주석처리하면 지나온 흔적을 남겨면서 그려짐*/
  // myGamePiece.x += 1;
  //keyoardCtrl();
  //mouseCtrl();
  //touchCtrl();
  canvasCtrl();
  
  btnUp.update();
  btnDown.update();
  btnLeft.update();
  btnRight.update();
  //myGamePiece.newPos();
  myGamePiece.update();
  
  
  redGamePiece.update();
  blueGamePiece.update();
  yellowGamePiece.update();
  
  redGamePiece.x +=2;
  blueGamePiece.x +=2;
  yellowGamePiece.x +=2;
  
  myObstacle.update();
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
    if(btnUp.clicked()) myGamePiece.y -= 1;
    if(btnDown.clicked()) myGamePiece.y += 1;
    if(btnLeft.clicked()) myGamePiece.x -= 1;
    if(btnRight.clicked()) myGamePiece.x += 1;
  }
}

function isHit(){
  if(myGamePiece.crashWith(myObstacle))return true; 
}
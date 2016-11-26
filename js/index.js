/*index js*/

var myGamePiece;
var redGamePiece, blueGamePiece, yellowGamePiece;

var myGameArea = {
  canvas : document.createElement("canvas"),
    start: function(){
      this.canvas.width = 480;
      this.canvas.height = 270;
      this.context = this.canvas.getContext("2d");
    
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.interval = setInterval(updateGameArea, 20);
    },
    clear: function(){
      this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
};

function init(){
  myGameArea.start();
  
  redGamePiece = new component(75,75, "red", 10, 10);
  blueGamePiece = new component(75,75, "yellow", 10, 100);
  yellowGamePiece = new component(75,75, "blue", 10, 200);
  
  myGamePiece = new component(10,140, 'rgba(0, 0, 255, 0.5)', 2, 2); /* x, y */
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
  this.newPos = function(){
    this.x += this.speedX;
    this.y += this.speedY;
  };
}

function updateGameArea(){
  myGameArea.clear(); /* 지우고 다시 그리고하기 때문에 만약 clear을 주석처리하면 지나온 흔적을 남겨면서 그려짐*/
  // myGamePiece.x += 1;
  myGamePiece.newPos();
  myGamePiece.update();
  
  
  redGamePiece.update();
  blueGamePiece.update();
  yellowGamePiece.update();
  
  redGamePiece.x +=2;
  blueGamePiece.x +=2;
  yellowGamePiece.x +=2;
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
/*index js*/

var myGamePiece;

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
  myGamePiece = new component(10,140, 'rgba(0, 0, 255, 0.5)', 10, 120);
};

function component(width, height, color, x, y){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function(){
    var ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function updateGameArea(){
  myGameArea.clear(); /* 지우고 다시 그리고하기 때문에 만약 clear을 주석처리하면 지나온 흔적을 남겨면서 그려짐*/
  myGamePiece.x += 1;
  myGamePiece.update();
}
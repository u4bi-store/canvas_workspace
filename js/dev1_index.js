/*dev1_index js*/

var player;

function startGame() {
  area.start();
  player = new component(50,30, 'red', 2, 2);
}

var area = {
  canvas : document.createElement('canvas'),
  start : function() {
    this.canvas.width = 600;
    this.canvas.height = 360;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    
    this.rennder = setInterval(update, 20);
  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function component(width, height, color, x, y){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  
  this.update = function(){
    var ctx = area.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height); 
  };
}

function update(){
  area.clear();
  player.update();
}
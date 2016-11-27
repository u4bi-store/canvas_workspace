/*dev1_index js*/

var player;
var walls = [];
var score;

function startGame() {
  area.start();
  player = new component(50,30, 'red', 2, 120);
  score = new component('30px', 'Consolas', 'black', 280, 40, 'text');
}

var area = {
  canvas : document.createElement('canvas'),
  start : function() {
    this.canvas.width = 600;
    this.canvas.height = 360;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.renderTick = 0;
    
    this.rennder = setInterval(update, 20);
  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function(){
    clearInterval(this.interval);
  }
};

function component(width, height, color, x, y, type){
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  
  this.update = function(){
    var ctx = area.context;
    if(this.type == 'text'){
      var size = this.width;
      var name = this.height; 
      ctx.font = size + ' ' + name;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }else{
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height); 
  };
  this.newPos = function() {
      this.x += this.speedX;
      this.y += this.speedY;        
  };
  this.crashWith = function(obj){
    var left = this.x;
    var right = this.x + (this.width);
    var top = this.y;
    var bottom = this.y + (this.height);
    
    var obj_left = obj.x;
    var obj_right = obj.x + (obj.width);
    var obj_top = obj.y;
    var obj_bottom = obj.y + (obj.height);
    
    var crash = true;
    if((bottom < obj_top)||(top > obj_bottom)||(right < obj_left)||(left > obj_right)) crash = false;
    return crash;
  };
}

function update(){
  if(isHit()){
    area.stop();
  }else{
    area.clear();

    player.update();
    player.newPos();

    area.renderTick += 1;
    pushWall();
    updateWalls();

    score.text = '스코어 : '+area.renderTick;
    score.update();
  }
}

function isHit(){
  for(i = 0; i<walls.length; i++){
    if(player.crashWith(walls[i]))return true;
  }
}
function pushWall(){
  var x, minH, maxH, height;
  var minGap, maxGap, gap;
  
  var no = area.renderTick;
  
  if( no == 1 || everyRenderVal(150)){
    x = area.canvas.width;
    minH = 20;
    maxH = 200;
    
    height = Math.floor(Math.random()*(maxH-minH+1) + minH);
    minGap = 50;
    maxGap = 200;
    
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    walls.push(new component(10, height, 'green', x, 0));
    
    walls.push(new component(10, x - height - gap, 'green', x,  height+gap));
  }
}

function updateWalls(){
  for(i = 0; i< walls.length; i++){
    movingWall(i);
    walls[i].update();
  }
}

function everyRenderVal(n){
  if((area.renderTick / n) % 1 == 0) return true;
}

function movingWall(num){
  walls[num].x += -1;
}
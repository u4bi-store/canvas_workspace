/*dev1_index js*/

var player;
var walls = [];
var score;
var background;
var fail;
var music;

function startGame() {
  area.start();
  player = new component(30,30, 'images/smiley.gif', 80, 120, 'image');
  score = new component('30px', 'Consolas', '#fff', 280, 40, 'text');
  background = new component(600, 360, 'images/background.png', 0, 0, 'background');
  fail = new sound('lib/bounce.mp3');
  music = new sound('lib/background.mp3');
  music.play();
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
    window.addEventListener('mousedown', function(e){
      area.clicked = true;
    });
    window.addEventListener('mouseup', function(e){
      area.clicked = false;
    });
    window.addEventListener('touchstart', function(e){
      area.clicked = true;  
    });
    window.addEventListener('touchend', function(e){
      area.clicked = false;
    });
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
  if(type == 'image' || type == 'background'){
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.gravity = 0;
  this.gravitySpeed = 0;
  this.x = x;
  this.y = y;
  
  this.update = function(){
    var ctx = area.context;
    if(this.type == 'image' || this.type == 'background'){
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      
      if(this.type == 'background'){
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    }else if(this.type == 'text'){
      var size = this.width;
      var name = this.height; 
      ctx.font = size + ' ' + name;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }else{
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function() {
    this.x += this.speedX;
    if(this.type == 'background'){
      if(this.x == -(this.width)) this.x = 0;
      this.y += this.speedY;
    }else{
      this.gravitySpeed += this.gravity;
      this.y += this.speedY + this.gravitySpeed;
      this.hitEdge();
    }
  };
  this.hitEdge = function(){
    var top = 0;
    var bottom = area.canvas.height - this.height;
    var result;
    if(this.y < top || this.y > bottom) return result = true;
  };
  this.crashWith = function(obj){
    var left = this.x;
    var right = this.x + (this.width);
    var top = this.y;
    var bottom = this.y + (this.height);
    
    if(!obj) obj=area;
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
    fail.play();
  }else{
    ctrl();
    area.clear();
    
    background.update();
    background.newPos();
    movingBackground();
    
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
  if(player.hitEdge()) return true;
  
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

function movingBackground(){
  background.speedX = -1;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
}

function ctrl(){
  if(area.clicked){
    player.image.src = 'images/angry.gif';
    player.gravity = -0.2;
  }else{
    player.image.src = 'images/smiley.gif';
    player.gravity = 0.1;
  }
}
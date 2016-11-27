/*dev1_index js*/

var player;
var walls = [];
var score =[];
var background;
var fail;
var music;
var intro = [];

var rank = [];

function startGame() {
  area.start();
  player = new component(30,30, 'images/smiley.gif', 80, 120, 'image');
  score[0] = new component('30px', 'Consolas', '#fff', 20, 40, 'text');
  score[1] = new component('15px', 'Consolas', '#fff', 20, 65, 'text');
  background = new component(600, 360, 'images/background.png', 0, 0, 'background');
  intro[0] = new component(600, 360, 'rgba(0,0,0,0.0)', 0, 0);
  intro[1] = new component('50px', 'Consolas', '#fff', 200, 180, 'text');
  intro[2] = new component('30px', 'Consolas', '#fff', 150, 300, 'text');
  intro[3] = new component('30px', 'Consolas', '#fff', 350, 300, 'text');
  intro[4] = new component('15px', 'Consolas', '#fff', 470, 40, 'text');
  
  for(i = 0; i<10; i++){
    rank[i] = new component('7px', 'Consolas', 'rgba(255, 215, 0, 0.6)', 500, 20+(20*i), 'text');
  }
  
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
    this.rennder = setInterval(render, 20);
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
  this.color = color;
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
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
      ctx.fillRect(this.x, this.y, this.width, 'red');
    }else{
      ctx.fillStyle = this.color;
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

function render(){
  if(isHit()){
    dead();
  }else{
    area.clear();
    ctrl();
    
    background.update();
    background.newPos();
    movingBackground();
    
    player.update();
    player.newPos();

    area.renderTick += 1;
    pushWall();
    updateWalls();
  
    score[0].text = '거리 : '+area.renderTick+'m';
    score[0].update();
    score[1].text = '최고기록 : '+'5000점';
    score[1].update();

    for(i = 0; i<10; i++){
      var num = (i+1);
      rank[i].text = (num)+'위 : 홍길동 - '+num+'0000점';
      rank[i].update();
    }
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
    walls.push(new component(10, height, '#fff', x, 0));
    
    walls.push(new component(10, x - height - gap, '#fff', x,  height+gap));
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

function dead(){
  area.stop();
  fail.play();
  intro[0].color = 'rgba(0,0,0,0.6)';
  intro[0].update();
  intro[1].text = '아! 아깝다!';
  intro[1].update();
  intro[2].text = '다시할래?';
  intro[2].update();
  intro[3].text = '순위보기';
  intro[3].update();
  intro[4].text = '페이스북 공유하기';
  intro[4].update();
  score[0].update();
  score[1].update();
}
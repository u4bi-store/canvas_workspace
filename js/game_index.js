/* game_index js*/

var canvas,ctx;
var x, y;

function init(){
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  
  x = canvas.width/2;
  y = canvas.height-30;
  
  setInterval(draw, 10);
}

function draw(){
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();  
}
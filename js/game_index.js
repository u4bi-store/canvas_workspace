/* game_index js*/

var canvas,ctx;

function init(){
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  
  setInterval(draw, 10);
}

function draw(){
}
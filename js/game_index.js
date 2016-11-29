/* game_index js*/

var canvas,ctx;
var x, y;
var dx, dy;
var ballRadius;
var paddleHeight, paddleWidth, paddleX;

function init(){
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  
  x = canvas.width/2;
  y = canvas.height-30;
  
  dx = 2;
  dy = -2;
  
  ballRadius = 15; //반지름
  
  paddleHeight = 10;
  paddleWidth = 75;
  paddleX = (canvas.width-paddleWidth)/2;
  
  setInterval(draw, 10);
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  /* rect(x, y, width, height)  윤곽선만 있는 사각형을 그림 */
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
  
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  /* arc(x, y, radius, startAngle, endAngle, antiClockwise)
     좌표를 중심으로 반지름 크기의 시작점부터 끝나는 점까지 잇는 곡선을 그림 */
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();  
}

function draw(){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  
  var ydy = y+dy;
  var xdx = x+dx;
  
  if(ydy < ballRadius || ydy > canvas.height-ballRadius) dy = -dy; /* 코드 병합 두가지 조건중 하나일 시 반전*/
  
  if(xdx < ballRadius || xdx > canvas.width-ballRadius) dx = -dx; /* left and right bouncing */
  
  /*ballRadius만큼 빼줌으로써 벽안으로 눌러 들어가는 것을 방지해줌*/
  
  x += dx;
  y += dy;
}
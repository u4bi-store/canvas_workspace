/* game_index js*/

var canvas,ctx;
var x, y;
var dx, dy;
var ballRadius;
var paddleHeight, paddleWidth, paddleX;
var rightPressed, leftPressed;
var brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft;
var bricks = [];
var score, lives;

function init(){
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  
  x = canvas.width/2;
  y = canvas.height-30;
  
  dx = 2;
  dy = -2;
  
  ballRadius = 5; //반지름
  
  paddleHeight = 10;
  paddleWidth = 75;
  paddleX = (canvas.width-paddleWidth)/2;
  /* (canvas 가로값 - paddle 가로값) 나누기 2
     paddle이 갈수 있는 limit값을 정하기 위함 */
  
  rightPressed = false;
  leftPressed = false;
  
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  document.addEventListener('mousemove', mouseMoveHandler, false);
  
  brickRowCount = 3;
  brickColumnCount = 10;
  brickWidth = canvas.width/20;
  brickHeight = canvas.height/20;
  brickPadding = 5;
  brickOffsetTop = 10;
  brickOffsetLeft = 20;
  
  for(i=0; i<brickColumnCount; i++){
    bricks[i] =[];
    for(j=0; j<brickRowCount; j++){
      bricks[i][j] = {x: 0, y: 0, status: 1};
    }
  }
  
  score = 0;
  lives = 3;
  
  setInterval(draw, 10);
}

function mouseMoveHandler(e){
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) paddleX = relativeX - paddleWidth/2;
}

function keyDownHandler(e){
  switch(e.keyCode){
    case 39: rightPressed = true; break;
    case 37: leftPressed = true; break;
    default: break;
  }
}
function keyUpHandler(e){
  switch(e.keyCode){
    case 39: rightPressed = false; break;
    case 37: leftPressed = false; break;
    default: break;
  }
}

function drawLives(){
  ctx.font = '0.01rem Consolas';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('생명 : '+lives, canvas.width-40, 9);
}

function drawScore(){
  ctx.font = '0.01rem Consolas';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('점수 : '+score, 0,9);
  
}

function collisionDetection(){
  for(i=0; i<brickColumnCount; i++){
    for(j=0; j<brickRowCount; j++){
      var b = bricks[i][j];
      
      if(b.status == 1){
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickWidth){
        /*  x는 b.x값 보다  크고
            b.x+brickWidth 보다 작음

            y도 동일한 구조

            일 때 dy = -dy 반전
        */
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount * brickColumnCount){
            alert('game win');
            document.location.reload();
          }
        }
      }
      
    }
  }
}

function drawBricks(){
  for(i=0; i<brickColumnCount; i++){
    for(j=0; j<brickRowCount; j++){
      
      if(bricks[i][j].status == 1){
        var brickX = (i* (brickWidth+brickPadding)+brickOffsetLeft);
        var brickY = (j* (brickHeight+brickPadding)+brickOffsetTop);

        bricks[i][j].x =brickX;
        bricks[i][j].y =brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
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
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  
  var ydy = y+dy;
  var xdx = x+dx;
  
  if(xdx < ballRadius || xdx > canvas.width-ballRadius) dx = -dx; /* left and right bouncing */
  /*ballRadius만큼 빼줌으로써 벽안으로 눌러 들어가는 것을 방지해줌*/
  
  if(ydy < ballRadius) dy = -dy;
  else if(ydy > canvas.height-ballRadius){
    /* (canvas 세로값-공의지름) 보다 클때, 즉 캔버스 화면 하단밖으로 나갔을 경우에*/
    if(x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    /* canvas.width/2는 paddleX보다 크고 paddleX+paddleWidth보다 작아야 반전 아니면 게임오버
    
      왼쪽 누르면 paddleX -7씩 감소 오른쪽 키 누르면 paddleX +7씩 증가
      웹 해상도 화면은 0부터 시작 왼쪽에서부터 가로(x)값이 커진다.
    */
    else{
      lives--;
      if(!lives){
        alert('game over');
        document.location.reload();
      }else{
        x = canvas.width/2;
        y = canvas.height-30;
        
        dx = 2;
        dy = -2;
        
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    /* paddleX보다 canvas.width - paddleWidth가 높을때 */
    paddleX += 7;
  }else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  
  x += dx;
  y += dy;
}
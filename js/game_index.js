/* game_index js*/

var canvas;

function init(){
  canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  /* 빨간 네모*/
  ctx.beginPath(); /* 선을 그릴때 시작하는 함수 */
  ctx.rect(20, 40, 50, 50); /* rect는 윤곽선만 있는 사각형을 그리는 함수*/
  ctx.fillStyle = "#FF0000"; /* 색변경 특정 도형의 바탕 화면 뿐만아니라 텍스트에도 적용 가능함*/
  ctx.fill(); /* 경로의 내부를 색으로 채움 */
  ctx.closePath(); /* 선을 그릴때 닫아서 시작점과 잇는 함수*/
  
  /* 초록 원형*/
  ctx.beginPath();
  ctx.arc(240, 100, 20, 0, Math.PI*2, false);
  /*  좌표를 중심으로 반지름 크기의 시작점부터
      끝나는 점까지 잇는 곡선을 그림
      (반시계 또는 시계 방향 설정 가능하다함)*/
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(160, 10, 100, 40);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"; /* 선의 색상*/
  ctx.stroke(); /* stroke 호출함으로써 선 그리기를 종료하는 형태*/
  ctx.closePath();
  
}
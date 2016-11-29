/*rotation_index js*/


var myGamePiece;

function startGame() {
    myGamePiece = new component(30, 30, "red", 80, 75);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.x = x;
    this.y = y;
    this.rotateSpeed = 1; 
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save(); /* 현재 캔버스의 context 객체를 저장함*/
        ctx.translate(this.x, this.y); /* 전체 캔버스를 이동시킴*/
        ctx.rotate(this.angle); /* rotate 메서드를 사용해 회전시킴*/ 
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);      
        /* 그 후 0,0 중심 위치와 함께 그려냄*/
        ctx.restore(); /* 그 후 다시 save 위치로 context 객체를 복원시킴*/
    };
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.angle += myGamePiece.rotateSpeed * Math.PI / 180;
    /* angle +=1 * 파이/180*/ 
    myGamePiece.update();
}

function speed(){
  myGamePiece.rotateSpeed++;
}
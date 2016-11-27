/*dev1_index js*/
function startGame() {
  area.start();
}

var area = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 600;
    this.canvas.height = 360;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
};
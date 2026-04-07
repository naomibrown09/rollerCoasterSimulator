function draw(){
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.arc(50, 50, 30, 0, 2 * Math.PI, true);
  ctx.stroke();
}

draw();

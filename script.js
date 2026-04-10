
function draw(){
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

  // Main path
  ctx.beginPath();
  ctx.moveTo(140, 300);
  ctx.lineTo(560, 395);
  ctx.lineWidth = 15;
  ctx.stroke();
  


  //Support beams every 50 pixels
  for (let i = 1; i <= 9; i++){
    ctx.moveTo(150 + 50 * (i - 1), 300 + 11.11*(i - 1));

    ctx.lineTo(150 + 50 * (i -1), 400);
  }
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();

  const ball = {

    radius: 20,
    x: 200,
    y: 311.11 - (25),
    startAngle: 0,
    endAngle: Math.PI * 2,

    drawBall(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
      ctx.closePath();
      ctx.fillStyle = "blue";
      ctx.fill();
    }
    
  }
  
  ball.drawBall();

}

draw();


//Define Objects

//Ball objects
const ball = {

    radius: 20,
    x: 150,
    y: 200 - 25,
    startAngle: 0,
    endAngle: Math.PI * 2,

    
    
  }

//World object
const canvasHeight = 500;
const world = {
  x1: 150,
  x2: 560,
  y1: 200,
  y2: 395,
  g: 20,
  l: 0,
  h0: canvasHeight - 200,
  cart: {
    velocity: 0,
    s: 0
  }
}

function calcLength(x1, x2, y1, y2){
  length = Math.sqrt(
    (x2 - x1) ** 2 + (y2 - y1) ** 2
  );
  return length;
}

function setUp(){
  world.l = calcLength(world.x1, world.x2, world.y1, world.y2);
  animate();
}


function draw(){
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Main path
  ctx.beginPath();
  ctx.moveTo(world.x1, world.y1);
  ctx.lineTo(world.x2, world.y2);
  ctx.lineWidth = 15;
  ctx.stroke();
  


  //Support beams every 50 pixels
  for (let i = 1; i <= 9; i++){
    ctx.moveTo(150 + 50 * (i - 1), 200 + 23*(i - 1));

    ctx.lineTo(150 + 50 * (i -1), 400);
  }
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();

  ball.x = updateX(world.cart.s);
  ball.y = updateY(world.cart.s);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y - 25, ball.radius, ball.startAngle, ball.endAngle);
  ctx.closePath();
  ctx.fillStyle = "blue";
  ctx.fill();
  

}

function updateVelocity(){
  const dt = 0.016 // 1 frame * (1 sec / 60 frames) gives change in time after each frame
  world.cart.velocity = Math.sqrt(
    2 * world.g * (world.h0 - ball.y * - 1)
  );
  
  if (world.cart.s / world.l <= 1){
  world.cart.s += world.cart.velocity * dt;
  } 
  
}

function updateX(s){
  
  const percentComplete = s / world.l;
  
  return (world.x2 - world.x1) * percentComplete + world.x1;
  
}

function updateY(s){
  const percentComplete = s / world.l;
  return (world.y2 - world.y1) * percentComplete + world.y1;
}

function animate(){
  updateVelocity();
  draw();
  requestAnimationFrame(animate);
}

setUp();




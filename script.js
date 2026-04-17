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
const canvasHeight = 600;
const world = {
  x1: 150,
  x2: 560,
  y1: 200,
  y2: 395,
  height: 195,
  g: 900,
  l: 0,
  ke: 0,
  keh: 0.1,
  pe: 0,
  peh: -300,
  te: 0,
  teh: -300,
  h0: canvasHeight - 190,
  cart: {
    acceleration: 0,
    velocity: 0,
    s: 0
  }
}

function calcLength(x1, x2, y1, y2){
  const length = Math.sqrt(
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

  const percentH = (world.y2 - ball.y) / world.height;
  const percentK = 1 - (((world.y2 - ball.y)) / world.height);
 

  ctx.beginPath();
  ctx.arc(ball.x, ball.y - 25, ball.radius, ball.startAngle, ball.endAngle);
  ctx.closePath();
  ctx.fillStyle = "blue";
  ctx.fill();

  //Energy bars

  ctx.fillRect(800, 395, 75, world.peh * percentH);
  ctx.fillStyle = "red"
  ctx.fillRect(925, 395, 75, world.peh * percentK);

  ctx.fillStyle = "purple";
  ctx.fillRect(1050, 395, 75, -300);

  //Energy labels
  ctx.fillStyle = "black";
  ctx.font = "48px serif";
  ctx.fillText("PE", 810, 435);

  ctx.fillStyle = "black";
  ctx.font = "48px serif";
  ctx.fillText("KE", 930, 435);

  ctx.fillStyle = "black";
  ctx.font = "48px serif";
  ctx.fillText("TE", 1055, 435);
  


}

function updateVelocity(){
  const dt = 0.016 // 1 frame * (1 sec / 60 frames) gives change in time after each frame
  
  /*
  const currY = updateY(world.cart.s);
  const height = canvasHeight - currY;
  const energy = world.h0 - height;

  world.cart.velocity = Math.sqrt(
    2 * world.g * (energy)
  );
  */

  world.cart.acceleration = world.g * ((world.y2 - world.y1) / world.l);
  world.cart.velocity += world.cart.acceleration * dt
  
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


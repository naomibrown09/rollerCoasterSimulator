// =====================
// setup
// =====================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let editing = true;
let frictionForce = true;

// =====================
// ball
// =====================

const ball = {
  radius: 20,
  x: 150,
  y: 200,
};

// =====================
// track (same 3 points)
// =====================

const track = {
  p0: { x: 150, y: 200 },
  p1: { x: 355, y: 400 },
  p2: { x: 560, y: 200 },
};

// =====================
// world
// =====================

const world = {
  g: 500,
  l: 0,
  h0: 0,

  cart: {
    acceleration: 0,
    velocity: 0,
    s: 0,
  },
};

// =====================
// dragging
// =====================

let selectedPoint = null;

function mousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function getPoints() {
  return [track.p0, track.p1, track.p2];
}

canvas.addEventListener("mousedown", (e) => {
  if (!editing) return;

  const m = mousePos(e);

  for (let p of getPoints()) {
    if (Math.hypot(m.x - p.x, m.y - p.y) < 12) {
      selectedPoint = p;
      break;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!selectedPoint || !editing) return;

  const m = mousePos(e);

  // move endpoints freely
  if (selectedPoint === track.p0 || selectedPoint === track.p2) {
    selectedPoint.x = m.x;
    selectedPoint.y = m.y;
  }

  // constrain control point so it stays between endpoints horizontally
  if (selectedPoint === track.p1) {
    const minX = Math.min(track.p0.x, track.p2.x);
    const maxX = Math.max(track.p0.x, track.p2.x);

    selectedPoint.x = Math.max(minX, Math.min(maxX, m.x));
    selectedPoint.y = m.y;
  }

  rebuildTable();
});

canvas.addEventListener("mouseup", () => {
  selectedPoint = null;
});

// =====================
// start sim (locks track)
// =====================

function startSim() {
  editing = false;
  world.cart.s = 0;
  world.cart.velocity = 0;

  // store initial height for energy
  const start = getPoint(0);
  world.h0 = canvas.height - start.y;
}

// =====================
// bezier math (unchanged)
// =====================

function getPoint(t) {
  return {
    x:
      (1 - t) ** 2 * track.p0.x +
      2 * (1 - t) * t * track.p1.x +
      t ** 2 * track.p2.x,

    y:
      (1 - t) ** 2 * track.p0.y +
      2 * (1 - t) * t * track.p1.y +
      t ** 2 * track.p2.y,
  };
}

// =====================
// arc length table
// =====================

let table = [];

function rebuildTable() {
  table = [];

  let prev = getPoint(0);
  let total = 0;

  const steps = 200;
  table.push({ t: 0, s: 0 });

  // track vertical bounds
  let minY = prev.y;
  let maxY = prev.y;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const curr = getPoint(t);

    minY = Math.min(minY, curr.y);
    maxY = Math.max(maxY, curr.y);

    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;

    total += Math.hypot(dx, dy);
    prev = curr;

    table.push({ t, s: total });
  }

  world.l = total;

  // store for energy normalization
  world.minY = minY;
  world.maxY = maxY;
}

function getTfromS(s) {
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];

    if (s >= a.s && s <= b.s) {
      const t = (s - a.s) / (b.s - a.s);
      return a.t + t * (b.t - a.t);
    }
  }

  return 1;
}

// =====================
// physics (your approach kept)
// =====================

function updateVelocity() {
  if (editing) return;

  const T = getTfromS(world.cart.s);
  const pos = getPoint(T);

  const dt = 0.016;
  const dtSmall = 0.001;

  const next = getPoint(T + dtSmall);

  const dx = next.x - pos.x;
  const dy = next.y - pos.y;

  const length = Math.hypot(dx, dy);
  const slope = dy / length;

  const k = 0;
  const friction = 0 //frictionForce ? -k * world.cart.velocity : 0; 

  world.cart.acceleration = world.g * slope + friction;
  world.cart.velocity += world.cart.acceleration * dt;

  world.cart.s += world.cart.velocity * dt;

// clamp + bounce at end
if (world.cart.s > world.l) {
  world.cart.s = world.l;
  world.cart.velocity *= -1; // restitution (bounce loss)
}

// optional: prevent drifting past start too
if (world.cart.s < 0) {
  world.cart.s = 0;
  world.cart.velocity *= -1;
}

  
}

// =====================
// drawing
// =====================

function drawTrack() {
  ctx.beginPath();
  ctx.moveTo(track.p0.x, track.p0.y);
  ctx.quadraticCurveTo(track.p1.x, track.p1.y, track.p2.x, track.p2.y);
  ctx.lineWidth = 12;
  ctx.stroke();
}

function drawPoints() {
  if (!editing) return;

  for (let p of getPoints()) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  }
}

function drawBall() {
  const t = getTfromS(world.cart.s);
  const pos = getPoint(t);

  ball.x = pos.x;
  ball.y = pos.y;

  ctx.beginPath();
  ctx.arc(ball.x, ball.y - 20, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
}

// =====================
// energy bars (back)
// =====================

function drawEnergy() {
  if (editing) return;

  const t = getTfromS(world.cart.s);
  const pos = getPoint(t);

  const range = world.maxY - world.minY;

  // height above lowest point
  const h = world.maxY - pos.y;

  const percentH = h / range;
  const percentK = 1 - percentH;

  ctx.fillStyle = "green"; // PE
  ctx.fillRect(850, 400, 50, -200 * percentH);

  ctx.fillStyle = "red"; // KE
  ctx.fillRect(950, 400, 50, -200 * percentK);

  
}

// =====================
// main loop
// =====================

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrack();
  drawPoints();
  drawBall();
  drawEnergy();
}

function animate() {
  updateVelocity();
  draw();
  requestAnimationFrame(animate);
}

// =====================
// init
// =====================

rebuildTable();
animate();

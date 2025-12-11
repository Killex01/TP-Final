
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1000;
canvas.height = 1000;

const updateRate = 10;
let mouse = {x: 0, y: 0, f: 2};
let heldObject = null;
let objectArray = [];
let particleArray = [];
const canvasPos = canvas.getBoundingClientRect();

class Object {
  constructor(pos, size, img) {
    this.x = pos.x;
    this.y = pos.y;
    this.width = size.w;
    this.height = size.h;
    this.img = img;

    this.velX = 0;
    this.velY = 0;
    this.maxVel = 10;
  }

  draw(ctx) {
    const x = this.x - this.width/2;
    const y = this.y - this.height/2;
    ctx.drawImage(this.img, x, y, this.width, this.height);
  }

  getBorder() {
    return {top: this.y - this.height/2, bottom: this.y + this.height/2, left: this.x - this.width/2, right: this.x + this.width/2};
  }
}

class Particle extends Object {
  constructor(pos, size, img, opacity) {
    super(pos, size, img)
    this.opacity = opacity;
  }

  draw(ctx) {
    const x = this.x - this.width/2;
    const y = this.y - this.height/2;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(this.img, x, y, this.width, this.height);
    this.opacity -= 0.05;
    ctx.restore();
  }
}

const imageAsteroid1 = new Image();
imageAsteroid1.src = "/asteroid_PNG2.png";
const imageAsteroid2 = new Image();
imageAsteroid2.src = "/asteroid_PNG6.png";
const imageSaturn = new Image();
imageSaturn.src = "/Saturn-PNG-Transparent-Image.png";
const imageParticle = new Image();
imageParticle.src = "/placeHolder_Facts.png";

function initialize() {
  objectArray = [];
  particleArray = [];
  addParticle({x: 500, y: 500}, {x: 500, y: 500}, 1000, 1000);
  const objectCrashOut = new Object({x: 100, y: 100}, {w: 200, h: 200}, imageAsteroid1);
  const objectFacts = new Object({x: 800, y: 200}, {w: 100, h: 100}, imageAsteroid2);
  const objectDontAsk = new Object({x: 500, y: 600}, {w: 400, h: 200}, imageSaturn);
  const objectAnotherOne = new Object({x: 900, y: 800}, {w: 300, h: 200}, imageAsteroid1);
  const objectAgain = new Object({x: 100, y: 400}, {w: 100, h: 200}, imageAsteroid2);
  objectArray.push(objectCrashOut, objectFacts, objectDontAsk, objectAnotherOne, objectAgain);
}

function direction(from, to) {
  return {x: to.x - from.x, y: to.y - from.y};
}

function distance(v) {
  const addition = Math.pow(v.x, 2) + Math.pow(v.y, 2);
  return Math.sqrt(addition, 2);
}

function normalized(dir, d) {
  dir.x = d > 0 ? dir.x/d : 0;
  dir.y = d > 0 ? dir.y/d : 0;
  return {x: dir.x, y: dir.y};
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function drawObjects() {
    objectArray.forEach(element => {
    element.draw(ctx);
  });
}

function drawParticles() {
  particleArray.forEach(element => {
    element.draw(ctx);
    if (element.opacity <= 0) particleArray.splice(particleArray.indexOf(element), 1);
  });
}

function addParticle(obj1, obj2, width, height) {
  const dir = direction(obj1, obj2);
  const particlePos = {x: obj1.x + dir.x/2, y: obj1.y + dir.y/2};
  let particle = new Particle(particlePos, {w: width, h: height}, imageParticle, 2);
  particleArray.push(particle);
}

function updateObjects() {
  if (heldObject !== null) {
    let mouseDir = direction({x: heldObject.x, y: heldObject.y}, {x: mouse.x, y: mouse.y});
    mouseDir = normalized(mouseDir, distance(mouseDir));
    heldObject.velX = clamp(heldObject.velX + mouseDir.x * mouse.f, -Math.abs(mouseDir.x * heldObject.maxVel), Math.abs(mouseDir.x * heldObject.maxVel));
    heldObject.velY = clamp(heldObject.velY + mouseDir.y * mouse.f, -Math.abs(mouseDir.y * heldObject.maxVel), Math.abs(mouseDir.y * heldObject.maxVel));
    heldObject.x = mouseDir.x >= 0 ? clamp(heldObject.x + heldObject.velX, -Infinity, mouse.x) : clamp(heldObject.x + heldObject.velX, mouse.x, Infinity);
    heldObject.y = mouseDir.y >= 0 ? clamp(heldObject.y + heldObject.velY, -Infinity, mouse.y) : clamp(heldObject.y + heldObject.velY, mouse.y, Infinity);
  }
  objectArray.forEach(element => {
    if (element == heldObject) {return};
    let velDir = direction({x: 0, y: 0}, {x: element.velX, y: element.velY});
    velDir = normalized(velDir, distance(velDir));
    velDir.x = Math.abs(velDir.x) * 0.1;
    velDir.y = Math.abs(velDir.y) * 0.1;
    element.x += element.velX;
    element.y += element.velY;
    element.velX = element.velX >= 0 ? clamp(element.velX - velDir.x, 0, element.velX) : clamp(element.velX + velDir.x, element.velX, 0);
    element.velY = element.velY >= 0 ? clamp(element.velY - velDir.y, 0, element.velY) : clamp(element.velY + velDir.y, element.velY, 0);
  });
}

function checkCollision() {
  objectArray.forEach(object => {
    let objectBorder = object.getBorder();
    let objectIndex = objectArray.indexOf(object);
    for (let index = objectIndex; index < objectArray.length; index++) {
      let otherObject = objectArray[index+1];
      if (otherObject == null) return;
      let otherBorder = otherObject.getBorder();
      if (objectBorder.right >= otherBorder.left && objectBorder.left <= otherBorder.right && objectBorder.bottom >= otherBorder.top && objectBorder.top <= otherBorder.bottom) {
        console.log("colliding");
        console.log(otherObject.img);
        objectArray.splice(objectArray.indexOf(object), 1);
        objectArray.splice(objectArray.indexOf(otherObject), 1);

        addParticle(object, otherObject, 200, 200);
      }
    }
  });
}

initialize();

function update() {
  window.requestAnimationFrame(update)
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawObjects();
  drawParticles();
  updateObjects();
  checkCollision();
}

update();

document.addEventListener("mousemove", (e) => {mouse.x = e.clientX - canvasPos.left, mouse.y = e.clientY - canvasPos.top});
document.addEventListener("mousedown", () => {
  objectArray.every(object => {
    let border = object.getBorder();
    if (mouse.x >= border.left && mouse.x <= border.right && mouse.y >= border.top && mouse.y <= border.bottom) {
      heldObject = object;
      return false;
    }
    return true;
  });
});
document.addEventListener("mouseup", () => {heldObject = null});
document.addEventListener("keydown", (e) => {if (e.key == "t") initialize()});
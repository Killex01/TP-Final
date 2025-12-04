// grab canvas from html and get "context" to make use of canvas API
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// make canvas full width and height of the screen
canvas.width = 1000;
canvas.height = 1000;

const updateRate = 10;
let mouse = {x: 0, y: 0, f: 5};
let heldObject = null;
let objectArray = [];
const drag = 2;

//Temporary

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
    ctx.fillStyle = "pink";
    ctx.fillRect(x, y, this.width, this.height);
    ctx.drawImage(this.img, x, y, this.width, this.height);
    ctx.fillRect(this.x - 10/2, this.y - 10/2, 10, 10);
  }

  getBorder() {
    return {top: this.y - this.height/2, bottom: this.y + this.height/2, left: this.x - this.width/2, right: this.x + this.width/2};
  }
}

const imageCrashOut = new Image();
imageCrashOut.src = "/placeHolder_CrashOut.png";
const imageFacts = new Image();
imageFacts.src = "/placeHolder_Facts.png";
const imageDontAsk = new Image();
imageDontAsk.src = "/placeHolder_DontAsk.png";

const objectCrashOut = new Object({x: 100, y: 100}, {w: 100, h: 100}, imageCrashOut);
const objectFacts = new Object({x: 800, y: 200}, {w: 100, h: 100}, imageFacts);
const objectDontAsk = new Object({x: 500, y: 600}, {w: 100, h: 100}, imageDontAsk);
objectArray.push(objectCrashOut, objectFacts, objectDontAsk);

function direction(from, to) {
  return {x: to.x - from.x, y: to.y - from.y};
}

function distance(v) {
  const addition = Math.pow(v.x, 2) + Math.pow(v.y, 2);
  return Math.sqrt(addition, 2);
}

function normalized(dir, d) {
  return {x: dir.x/d, y: dir.y/d};
}

function drawObjects() {
    objectArray.forEach(element => {
    element.draw(ctx);
  });
}

function updateObjects() {
  if (heldObject !== null) {
    let mouseDir = direction({x: heldObject.x, y: heldObject.y}, {x: mouse.x, y: mouse.y});
    mouseDir = normalized(mouseDir, distance(mouseDir));
    heldObject.velX += mouseDir.x * mouse.f;
    heldObject.velY += mouseDir.y * mouse.f;
    //heldObject.x = mouse.x;
    //heldObject.y = mouse.y;
  }
  objectArray.forEach(element => {
    element.x += element.velX;
    element.y += element.velY;
    let vel = {x: element.velX, y: element.velY};
    //vel.x *= (1 - drag * .1);
    //vel.y *= (1 - drag * .1);
    console.log(vel.x);
  });
}

function update() {
  window.requestAnimationFrame(update)
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawObjects();
  updateObjects();
}

update();

document.addEventListener("mousemove", (e) => {mouse.x = e.clientX, mouse.y = e.clientY});
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
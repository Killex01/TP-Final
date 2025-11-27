// grab canvas from html and get "context" to make use of canvas API
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// make canvas full width and height of the screen
canvas.style.width = 1000 + "px";
canvas.style.height = 1000 + "px";

const rate = 10

//Temporary
class shape {
  constructor(pos, size, vel, img) {
    this.x = pos.x;
    this.y = pos.y;
    this.velX = vel.x;
    this.velY = vel.y;
    this.width = size.x;
    this.height = size.y;
    this.img = img;
  }

  update(ctx) {
  }
}

class object extends shape {
    constructor(pos, size, vel, img, mass) {
      super(pos, size, vel, img);
      //this.weight = mass;
  }

  update(ctx) {
    super.update(ctx);

    let t = new Image(this.width + "px", this.height + "px");
    t.src = "/public_images/" + this.img;

    ctx.drawImage(t, this.x - center.x, this.y - center.y);

    /* this.x += this.velX;
    this.y += this.velY;
    this.velX = Math.max(0, Math.min(this.velX-0.1, 999)) * (this.velX/Math.abs(this.velX));
    this.velY = Math.max(0, Math.min(this.velY-0.1, 999)) * (this.velY/Math.abs(this.velY)); */
  }
}

class particle extends shape {
    constructor(pos, size, vel, img, fR, instC) {
      super(pos, size, vel, img);

      this.fadeRate = fR;
      this.instanceCount = instC;
  }

  update(ctx) {
    super.update(ctx);
  }
}

function checkCollisions({ col1, col2 }) {
  return (
    col1.x + col1.width >= col2.x - col2.width && // box1 right collides with box2 left
    col2.x + col2.width >= col1.x - col1.width && // box2 right collides with box1 left
    col1.y + col1.height >= col2.y - col2.height && // box1 bottom collides with box2 top
    col2.y + col2.height >= col1.y - col1.height // box1 top collides with box2 bottom
  )
}

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2
}

let w = new object( {x: center.x, y: center.y}, {x: 1, y: 1}, {x: 0, y: 0}, "galaxie background.jpg", 0);

function update() {
  c.fillStyle = 'rgb(39,39,42)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  w.update(c);
}

setInterval(update, rate);
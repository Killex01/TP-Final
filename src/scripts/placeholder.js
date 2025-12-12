
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1600;
canvas.height = 710;

const updateRate = 10;
let mouse = {x: 0, y: 0, f: 2};
let heldObject = null;
let objectArray = [];
let particleArray = [];
const canvasPos = canvas.getBoundingClientRect();

// Object class
class Object {
  constructor(pos, size, img, maxV) {
    this.x = pos.x;
    this.y = pos.y;
    this.width = size.w;
    this.height = size.h;
    this.img = img;

    this.velX = 0;
    this.velY = 0;
    this.maxVel = maxV;
  }

  //Dessiner l'image de l'objet centré sur sa position
  draw(ctx) {
    const x = this.x - this.width/2;
    const y = this.y - this.height/2;
    ctx.drawImage(this.img, x, y, this.width, this.height);
  }

  //Obtenir les bords de l'objet
  getBorder() {
    return {top: this.y - this.height/2, bottom: this.y + this.height/2, left: this.x - this.width/2, right: this.x + this.width/2};
  }
}

// Particle class
class Particle extends Object {
  constructor(pos, size, img, maxV, opacity) {
    super(pos, size, img, maxV)
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

// Images
const imageAsteroid1 = new Image();
imageAsteroid1.src = "asteroid_PNG2.png";

const imageAsteroid2 = new Image();
imageAsteroid2.src = "asteroid_PNG6.png";

const imageSaturn = new Image();
imageSaturn.src = "Saturn-PNG-Transparent-Image.png";

const imageParticle = new Image();
imageParticle.src = "placeHolder_Facts.png";

const imageBackground = new Image();
imageBackground.src = "galaxie_background.png";

// Intialization
function initialize() {
  objectArray = [];
  particleArray = [];
  addParticle({x: 800, y: 355}, {x: 800, y: 355}, 1600, 710);

  // Créer les objets
  const objectAsteroid = new Object({x: 200, y: 100}, {w: 200, h: 200}, imageAsteroid1, 7);
  const objectAsteroid2 = new Object({x: 800, y: 200}, {w: 100, h: 100}, imageAsteroid2, 10);
  const objectSaturn = new Object({x: 500, y: 600}, {w: 400, h: 200}, imageSaturn, 5);
  const objectAsteroid3 = new Object({x: 1000, y: 500}, {w: 300, h: 200}, imageAsteroid1, 6);
  const objectAsteroid4 = new Object({x: 100, y: 400}, {w: 100, h: 200}, imageAsteroid2, 9);
  const objectSaturn2 = new Object({x: 1500, y: 300}, {w: 400, h: 200}, imageSaturn, 5);

  objectArray.push(objectAsteroid, objectAsteroid2, objectSaturn, objectAsteroid3, objectAsteroid4, objectSaturn2);
}

// Obtenire la direction entre deux positions
function direction(from, to) {
  return {x: to.x - from.x, y: to.y - from.y};
}

// Obtenire la distance d'un vecteur
function distance(v) {
  const addition = Math.pow(v.x, 2) + Math.pow(v.y, 2);
  return Math.sqrt(addition, 2);
}

// Normaliser un vecteur
function normalized(dir, d) {
  dir.x = d > 0 ? dir.x/d : 0;
  dir.y = d > 0 ? dir.y/d : 0;
  return {x: dir.x, y: dir.y};
}

// Clamp une valeur entre un min et un max
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// Dessiner chaque objet
function drawObjects() {
    objectArray.forEach(element => {
    element.draw(ctx);
  });
}

// Dessiner chaque particule
function drawParticles() {
  particleArray.forEach(element => {
    element.draw(ctx);
    if (element.opacity <= 0) particleArray.splice(particleArray.indexOf(element), 1);
  });
}

// Ajouter une particule entre deux objets
function addParticle(obj1, obj2, width, height) {
  const dir = direction(obj1, obj2);
  const particlePos = {x: obj1.x + dir.x/2, y: obj1.y + dir.y/2};
  let particle = new Particle(particlePos, {w: width, h: height}, imageParticle, 0, 2);
  particleArray.push(particle);
}

// Mettre à jour la position et la vélocité des objets
function updateObjects() {
  if (heldObject !== null) {
    //Obtenir la direction entre l'objet tenu et la souris
    let mouseDir = direction({x: heldObject.x, y: heldObject.y}, {x: mouse.x, y: mouse.y});
    mouseDir = normalized(mouseDir, distance(mouseDir));

    //Ajouter de la vélocité à l'objet tenu en direction de la souris
    heldObject.velX = clamp(heldObject.velX + mouseDir.x * mouse.f, -Math.abs(mouseDir.x * heldObject.maxVel), Math.abs(mouseDir.x * heldObject.maxVel));
    heldObject.velY = clamp(heldObject.velY + mouseDir.y * mouse.f, -Math.abs(mouseDir.y * heldObject.maxVel), Math.abs(mouseDir.y * heldObject.maxVel));
    heldObject.x = mouseDir.x >= 0 ? clamp(heldObject.x + heldObject.velX, -Infinity, mouse.x) : clamp(heldObject.x + heldObject.velX, mouse.x, Infinity);
    heldObject.y = mouseDir.y >= 0 ? clamp(heldObject.y + heldObject.velY, -Infinity, mouse.y) : clamp(heldObject.y + heldObject.velY, mouse.y, Infinity);
  }

  //Reduire la vélocité de tout objets non tenu avec le temps
  objectArray.forEach(element => {
    if (element == heldObject) {return};
    //Obtenir la direction de la vélocité
    let velDir = direction({x: 0, y: 0}, {x: element.velX, y: element.velY});
    velDir = normalized(velDir, distance(velDir));

    //Appliquer la vélocité réduite
    velDir.x = Math.abs(velDir.x) * 0.1;
    velDir.y = Math.abs(velDir.y) * 0.1;
    element.x += element.velX;
    element.y += element.velY;
    element.velX = element.velX >= 0 ? clamp(element.velX - velDir.x, 0, element.velX) : clamp(element.velX + velDir.x, element.velX, 0);
    element.velY = element.velY >= 0 ? clamp(element.velY - velDir.y, 0, element.velY) : clamp(element.velY + velDir.y, element.velY, 0);
  });
}

// Vérifier les collisions entre les objets
function checkCollision() {
  objectArray.forEach(object => {
    //Obtenir les bords et l'index de l'objet
    let objectBorder = object.getBorder();
    let objectIndex = objectArray.indexOf(object);

    //Vérifier la collision avec les autres objets
    for (let index = objectIndex; index < objectArray.length; index++) {
      //Obtenir l'autre objet
      let otherObject = objectArray[index+1];
      if (otherObject == null) return;
      let otherBorder = otherObject.getBorder();

      //Vérifier la collision entre les deux objets
      if (objectBorder.right >= otherBorder.left && objectBorder.left <= otherBorder.right && objectBorder.bottom >= otherBorder.top && objectBorder.top <= otherBorder.bottom) {
        objectArray.splice(objectArray.indexOf(object), 1);
        objectArray.splice(objectArray.indexOf(otherObject), 1);
        heldObject = object || otherObject == heldObject ? null : heldObject;

        addParticle(object, otherObject, 200, 200);
      }
    }
  });
}

//Première initialisation
initialize();

// Boucle de mise à jour
function update() {
  window.requestAnimationFrame(update)
  ctx.fillRect(0 - canvasPos.left, 0 - canvasPos.top, canvas.width, canvas.height);
  ctx.drawImage(imageBackground, 0, 0, 1600, 710);
  drawObjects();
  drawParticles();
  updateObjects();
  checkCollision();
}

// Démarrer la boucle de mise à jour
update();

// Obtenir la position de la souris
document.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left, mouse.y = e.clientY - rect.top;
});

// Gérer le clic de la souris pour attraper ou lâcher un objet
document.addEventListener("mousedown", () => {
  if (heldObject !== null) {
    heldObject = null;
    return;
  }

  objectArray.every(object => {
    let border = object.getBorder();
    if (mouse.x >= border.left && mouse.x <= border.right && mouse.y >= border.top && mouse.y <= border.bottom) {
      heldObject = object;
      return false;
    }
    return true;
  });
});
// Réinitialiser le jeu
document.addEventListener("keydown", (e) => {if (e.key == "t") initialize()});
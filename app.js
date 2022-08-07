//TODO: RESIZE

const ORIGINAL_WIDTH = 1024;
const ORIGINAL_HEIGHT = 768;
let _w = window.innerWidth;
let _h = window.innerHeight;
let _wRatio = _w / ORIGINAL_WIDTH;
let _hRatio = _h / ORIGINAL_HEIGHT;
let _scaleRatio = _hRatio > _wRatio ? _wRatio : _hRatio;
let _canvas = document.getElementById("idFireworkCanvas");
let _start = 0;
const APP = new PIXI.autoDetectRenderer({
  view: _canvas,
  width: _w,
  height: _h,
  resolution: window.devicePixelRatio,
  //autoDensity: true,
  //autoResize: true,
});

window.addEventListener("resize", resize);

function resize() {
  APP.resize(window.innerWidth, window.innerHeight);
  _w = window.innerWidth;
  _h = window.innerHeight;
  stage.position.y = _h / 2;
  stage.position.x = _w / 2;

  _wRatio = _w / ORIGINAL_WIDTH;
  _hRatio = _h / ORIGINAL_HEIGHT;

  _scaleRatio = _hRatio > _wRatio ? _wRatio : _hRatio;

  if (_fireworks.length) {
    _fireworks.forEach((firework) => {
      firework.resize();
    });
  }
  console.log("resize");
}

let _loopId;

let _entities = [];
let _fireworks = [];
const GRAVITY = 600;
const WARNING_MESSAGE =
  "Something is wrong with your Fireworks! Please check your XML file.";
const FIREWORK_ERROR_MESSAGE = `Something is wrong with one of your Fireworks! Please check your XML file.`;

const checkOutOfBounds = (objectPosition, textureScale) => {
  return (
    -textureScale.x - _w / 2 > objectPosition.x ||
    objectPosition.x > _w / 2 + textureScale.x ||
    -textureScale.y - _h / 2 > objectPosition.y ||
    objectPosition.y > _h / 2 + textureScale.y
  );
};

const ticker = new PIXI.Ticker();
ticker.maxFPS = 60;
const stage = new PIXI.Container();
stage.position.y = APP.height / 2;
stage.position.x = APP.width / 2;
stage.scale.y = -1;
stage.scale.x = -1;

document.body.appendChild(APP.view);

const particleTexture = PIXI.Texture.from("../assets/particle.png");

const rocketTexture = PIXI.Texture.from("../assets/rocket.png");

const fountainTexture = PIXI.Texture.from("../assets/fountain.png");

class Particle {
  constructor(colour) {
    this.sprite = new PIXI.Sprite(particleTexture);
    this.sprite.tint = colour;
    this.realScale = { x: 0.4 * _scaleRatio, y: 0.4 * _scaleRatio };
    this.sprite.scale = this.realScale;
    this.sprite.anchor.set(0.5);
    this.velocity = { x: 0, y: 0 };
    this.alive = true;
    this.realPosition = { x: 0, y: 0 };
  }

  setPosition(pos) {
    this.realPosition.x = pos.x;
    this.realPosition.y = pos.y;

    this.setRelativePosition();
  }

  setRelativePosition() {
    this.sprite.position.x = this.realPosition.x * _wRatio;
    this.sprite.position.y = this.realPosition.y * _hRatio;
  }

  setVelocity(vel) {
    this.velocity = vel;
  }

  //uses deltaTime from last frame to calculate new position
  update(deltaTime) {
    if (
      checkOutOfBounds(this.sprite.position, {
        x: this.sprite.width,
        y: this.sprite.height,
      })
    ) {
      this.sprite.alpha = 0;
      this.alive = false;
      console.log("out");
    } else {
      //divides by 1000 because velocity is in pixels per second, and deltatime is in miliseconds
      this.realPosition.x += (this.velocity.x * deltaTime) / 1000;
      this.realPosition.y += (this.velocity.y * deltaTime) / 1000;
      this.velocity.y -= (GRAVITY * deltaTime) / 1000;

      this.setRelativePosition();
    }
  }

  resize() {
    this.sprite.scale = {
      x: this.realScale.x * _scaleRatio,
      y: this.realScale.y * _scaleRatio,
    };
  }
}

class Firework {
  constructor(begin, duration, colour, position, type, texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5, 0.5);
    this.realScale = { x: 0.5 * _scaleRatio, y: 0.5 * _scaleRatio };
    this.sprite.scale = this.realScale;
    this.sprite.tint = colour;
    this.sprite.alpha = 0;
    this.particles = [];
    this.timeToBegin = begin;
    this.remainingLifetime = duration;
    this.colour = colour;
    this.type = type;
    this.realPosition = { x: 0, y: 0 };
    this.setPosition(position);
    this.hasStarted = false;
    this.hasExpired = false;
    stage.addChild(this.sprite);
  }

  update(
    deltaTime //Possible TODO: change all those booleans into an enum with states: PREPARING, FLYING, EXPIRED
  ) {
    if (!this.hasExpired) {
      if (!this.hasStarted) {
        this.updateNotStarted(deltaTime);
      } else {
        this.updateDefault(deltaTime);
      }
    } else {
      this.updateParticles(deltaTime);
    }
  }

  updateNotStarted(deltaTime) {
    this.timeToBegin -= deltaTime;

    if (this.timeToBegin <= 0) this.start();
  }

  updateDefault(deltaTime) {
    this.remainingLifetime -= deltaTime;

    if (this.remainingLifetime > 0) this.updatePhysics(deltaTime);
    else this.expire();
  }

  updatePhysics(deltaTime) {
    this.setRelativePosition();
  }

  start() {
    this.hasStarted = true;
    this.sprite.alpha = 1;
  }

  setPosition(pos) {
    this.realPosition.x = pos.x;
    this.realPosition.y = pos.y;
    this.setRelativePosition();
  }

  setRelativePosition() {
    this.sprite.position.x = this.realPosition.x * _wRatio;
    this.sprite.position.y = this.realPosition.y * _hRatio;
  }

  expire() {
    this.hasExpired = true;
  }

  updateParticles(deltaTime) {
    this.particles = this.particles.filter((particle) => {
      return particle.alive;
    });
    this.particles.forEach((particle) => {
      particle.update(deltaTime);
    });
  }

  resize() {
    this.sprite.scale = {
      x: this.realScale.x * _scaleRatio,
      y: this.realScale.y * _scaleRatio,
    };
    this.particles.forEach((particle) => {
      particle.resize();
    });
  }
}

class Rocket extends Firework {
  constructor(begin, duration, colour, position, velocity) {
    super(begin, duration, colour, position, "Rocket", rocketTexture);
    this.velocity = velocity;
  }

  setVelocity(vel) {
    this.velocity = vel;
  }

  explode() {
    const steps = 10;
    const radius = 4;
    const position = {
      x: this.realPosition.x,
      y: this.realPosition.y,
    };
    for (let i = 0; i < steps; i++) {
      // get velocity
      const x = radius * Math.cos((2 * Math.PI * i) / steps) * 100;
      const y = radius * Math.sin((2 * Math.PI * i) / steps) * 100;
      // add particle
      const particle = new Particle(this.colour);
      particle.setPosition(position);
      particle.setVelocity({ x, y });
      stage.addChild(particle.sprite);
      this.particles.push(particle);
      _entities.push(this.particles);
      this.sprite.alpha = 0;
    }
  }

  updatePhysics(deltaTime) {
    //divides by 1000 because velocity is in pixels per second, and deltatime is in miliseconds
    this.realPosition.x += (this.velocity.x * deltaTime) / 1000;
    this.realPosition.y += (this.velocity.y * deltaTime) / 1000;
    this.velocity.y -= (GRAVITY * deltaTime) / 1000;

    super.updatePhysics(deltaTime);
  }

  expire() {
    console.log("BOOM");
    this.explode();
    super.expire();
  }
}

class Fountain extends Firework {
  constructor(begin, duration, colour, position) {
    super(begin, duration, colour, position, "Fountain", fountainTexture);
  }

  createParticles() {
    if(this.particles.length >= 20){
      return;
    }
    let randomParticleNumber = Math.floor(Math.random() * (6 - 3 + 1) + 1);
    const position = {
      x: this.realPosition.x,
      y: this.realPosition.y,
    };
    if (this.particles.length + randomParticleNumber > 20) {
      randomParticleNumber = randomParticleNumber - this.particles.length
    }
    randomParticleNumber = 10;
    for (let i = 0; i < randomParticleNumber; i++) {
      /*const x =
          Math.floor(
            Math.random() *
              (Math.cos((7 * Math.PI) / 12) - Math.cos(Math.PI / 4) + 1) +
              1
          ) * 100;
        const y =
          Math.floor(
            Math.random() *
              (Math.sin((7 * Math.PI) / 12) - Math.sin(Math.PI / 4) + 1) +
              1
          ) * 100;*/
      const x = 4 * Math.cos((2 * Math.PI * i) / randomParticleNumber) * 100;
      const y = 4 * Math.sin((2 * Math.PI * i) / randomParticleNumber) * 100;
      const particle = new Particle();
      particle.setPosition(position);
      particle.setVelocity({ x, y });
      particle.sprite.alpha = 1;
      stage.addChild(particle.sprite);
      this.particles.push(particle);
      _entities.push(this.particles);
    }
  }

  update(
    deltaTime //Possible TODO: change all those booleans into an enum with states: PREPARING, FLYING, EXPIRED
  ) {
    if (!this.hasExpired) {
      if (!this.hasStarted) {
        this.updateNotStarted(deltaTime);
      } else {
        this.createParticles();
        this.updateDefault(deltaTime);
        if(this.particles.length){
          console.log("Update particles: ", this.particles)
          this.updateParticles(deltaTime);
        }
      }
    }
  }
}

const createFirework = (begin, duration, colour, position, type, velocity) => {
  let firework;
  if (type === "Rocket") {
    firework = new Rocket(begin, duration, colour, position, velocity);
  } else {
    firework = new Fountain(begin, duration, colour, position);
  }
  _entities.push(firework);
  _fireworks.push(firework);
};

const startFireworks = () => {
  _start = 0;
  ticker.add(loop);
  ticker.start();
};

const clearFireworks = () => {
  _fireworks = _fireworks.filter(
    (firework) =>
      !firework.hasExpired ||
      (firework.hasExpired && firework.particles.length > 0)
  );
};

const loop = (timestamp) => {
  // _start += ticker.elapsedMS;

  // console.log(ticker.elapsedMS/10);
  //TODO: increment ticker.elapsedMS
  //_loopId = requestAnimationFrame(loop);
  if (!_fireworks.length) {
    _start = 0;
    stage.removeChildren();
    ticker.stop();
    ticker.remove(loop);
    //cancelAnimationFrame(_loopId);
    //_start = -1;
    loadXMLDoc();
  } else {
    _fireworks.forEach((firework) => {
      firework.update(ticker.elapsedMS);
    });
    clearFireworks();
  }
  APP.render(stage);
};

function loadXMLDoc() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      XMLToFireworks(this);
    }
  };
  xmlhttp.open("GET", "fireworks.xml", true);
  xmlhttp.send();
}

function getFireworkAttribute(fireworkInfo, tag, index, elementTag) {
  if (fireworkInfo === undefined) {
    throw new Error(
      `Something is wrong with ${elementTag} of your Fireworks nº${
        index + 1
      }! Please check your XML file.`
    );
  } else {
    let attrib = fireworkInfo.getAttribute(tag);
    if (attrib === null) {
      throw new Error(
        `Something is wrong with ${tag} of your Fireworks nº${
          index + 1
        }! Please check your XML file.`
      );
    } else {
      return attrib;
    }
  }
}

function XMLToFireworks(xml) {
  var i, xmlDoc;
  xmlDoc = xml.responseXML;
  let fireworks = xmlDoc.getElementsByTagName("Firework");
  if (fireworks.length === 0) {
    alert(WARNING_MESSAGE);
    return;
  }
  for (i = 0; i < fireworks.length; i++) {
    try {
      let fireworkInfo = fireworks[i];
      let begin = getFireworkAttribute(fireworkInfo, "begin", i);
      let duration = getFireworkAttribute(fireworkInfo, "duration", i);
      let colour = getFireworkAttribute(fireworkInfo, "colour", i);
      let position = {
        x: parseInt(
          getFireworkAttribute(
            fireworkInfo.getElementsByTagName("Position")[0],
            "x",
            i,
            "Position"
          )
        ),
        y: parseInt(
          getFireworkAttribute(
            fireworkInfo.getElementsByTagName("Position")[0],
            "y",
            i,
            "Position"
          )
        ),
      };
      let type = fireworkInfo.getAttribute("type");
      let velocity;

      if (type === "Rocket") {
        velocity = {
          x: parseInt(
            getFireworkAttribute(
              fireworkInfo.getElementsByTagName("Velocity")[0],
              "x",
              i,
              "Velocity"
            )
          ),
          y: parseInt(
            getFireworkAttribute(
              fireworkInfo.getElementsByTagName("Velocity")[0],
              "y",
              i,
              "Velocity"
            )
          ),
        };
      }
      if (
        begin === null ||
        duration === null ||
        colour === null ||
        position === null ||
        type === null ||
        (velocity === null && type === "Rocket")
      ) {
      }
      createFirework(begin, duration, colour, position, type, velocity);
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  }
  startFireworks();
  console.log(fireworks);
}

loadXMLDoc();

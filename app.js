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
}

let _loopId;

let _entities = [];
let _fireworks = [];
const GRAVITY = 300;
const MISSING_XML_MESSAGE =
  "Couldn't find your Fireworks! Please check your XML file's name is \"fireworks\" or if it's missing.";
const WARNING_MESSAGE =
  "Something is wrong with your Fireworks! Please check your XML file.";
const FIREWORK_ERROR_MESSAGE = `Something is wrong with one of your Fireworks! Please check your XML file.`;

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

const startApp = () => {
  //Loading xml
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        XMLToFireworks(this);
      } else if (this.status == 404) {
        alert(MISSING_XML_MESSAGE);
      }
    }
  };
  xmlhttp.open("GET", "fireworks.xml", true);
  xmlhttp.send();
};

const XMLToFireworks = (xml) => {
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
      alert(e.message);
    }
  }
  startFireworks();
};

const startFireworks = () => {
  _start = 0;
  ticker.add(loop);
  ticker.start();
};

const loop = (timestamp) => {
  if (!_fireworks.length) {
    _start = 0;
    stage.removeChildren();
    ticker.stop();
    ticker.remove(loop);
    startApp();
  } else {
    _fireworks.forEach((firework) => {
      firework.update(ticker.elapsedMS);
    });
    clearFireworks();
  }
  APP.render(stage);
};

startApp();

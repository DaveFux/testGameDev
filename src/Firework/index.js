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

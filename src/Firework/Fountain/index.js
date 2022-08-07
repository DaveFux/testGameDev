class Fountain extends Firework {
  constructor(begin, duration, colour, position) {
    super(begin, duration, colour, position, "Fountain", fountainTexture);
  }

  createParticles() {
    const steps = 20;
    const radius = 1;
    const position = {
      x: this.realPosition.x,
      y: this.realPosition.y,
    };
    for (let i = 0; i < steps; i++) {
      // get velocity
      const randomForceUp = Math.floor(Math.random() * (450 - 300 + 1) + 300);
      const randomForceSides = Math.floor(Math.random() * (100 - 50 + 1) + 50);
      const x =
        radius *
        Math.cos(Math.PI / 4 + (Math.PI * i) / 2 / steps) *
        randomForceSides;
      const y =
        radius *
        Math.sin(Math.PI / 4 + (Math.PI * i) / 2 / steps) *
        randomForceUp;
      // add particle
      const particle = new Particle(this.colour);
      particle.setPosition(position);
      particle.setVelocity({ x, y });
      particle.fade = true;
      stage.addChild(particle.sprite);
      this.particles.push(particle);
      _entities.push(particle);
      this.sprite.alpha = 0;
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
      }
    }
    if (this.particles.length) {
      this.updateParticles(deltaTime);
    }
  }
}

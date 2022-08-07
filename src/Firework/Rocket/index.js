class Rocket extends Firework {
  constructor(begin, duration, colour, position, velocity) {
    super(begin, duration, colour, position, "Rocket", rocketTexture);
    this.velocity = velocity;
  }

  setVelocity(vel) {
    this.velocity = vel;
  }

  explode() {
    const steps = Math.floor(Math.random() * (100 - 80 + 1) + 80);
    const radius = 4;
    const position = {
      x: this.realPosition.x,
      y: this.realPosition.y,
    };
    for (let i = 0; i < steps; i++) {
      // get velocity
      const randomForce = Math.floor(Math.random() * (6 - 2 + 1) + 1);
      const x = radius * Math.cos((2 * Math.PI * i) / steps) * 10 * randomForce;
      const y = radius * Math.sin((2 * Math.PI * i) / steps) * 10 * randomForce;
      // add particle
      const particle = new Particle(this.colour);
      particle.setPosition(position);
      particle.setVelocity({ x, y });
      stage.addChild(particle.sprite);
      this.particles.push(particle);
      _entities.push(particle);
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
    this.explode();
    super.expire();
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
}

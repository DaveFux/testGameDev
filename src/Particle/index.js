class Particle {
  constructor(colour) {
    this.sprite = new PIXI.Sprite(particleTexture);
    this.sprite.tint = colour;
    this.realScale = { x: 0.4 * _scaleRatio, y: 0.4 * _scaleRatio };
    this.sprite.scale = this.realScale;
    this.sprite.anchor.set(0.5);
    this.velocity = { x: 0, y: 0 };
    this.fade = false;
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
    } else {
      if (this.fade && this.velocity.y <= 0) {
        this.sprite.alpha = 0;
        this.alive = false;
      }
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

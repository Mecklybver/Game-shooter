// [Refactoring, please wait...]
import { Bullet } from "./bullet.js";
import { debugScript } from "./events.js";


export class Enemy {
  constructor(context, x, y, radius, color, velocity, angle, angle2, debug) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.radians = 0;
    this.center = {
      x: 0,
      y: 0
    };
    this.color = color;
    this.velocity = velocity;
    this.context = context;
    this.angle = angle;
    this.debug = debug
    this.angle2 = angle2;
    this.amplitudeMin = Math.random() * 2.5 + 1
    this.amplitudeMax = Math.random() * 8  + 3
   

    // this.movement = "homing" //testing purpose

    this.movement =
      Math.random() < 0.8
        ? "linear"
        : Math.random() < 0.8
        ? "spinning"
        : "homing";
    if (this.movement == "homing") this.radius -= 15;
    if (this.movement == "spinning") this.radius += 15;
    if (this.radius < 10) this.radius = 10;
    this.timeBetweenShots = Math.random() * 2000 + 2000;
    this.lastShotTime = 0;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  Image() {
    let img;
    if (this.movement == "linear") {
      img = new Image();
      img.src = "./images/asteroid.png";

      this.context.save();
      this.context.translate(this.x, this.y);
      const randomAngle =
        Math.random() * (Math.PI * 2) * Math.random() * 2 + 0.2;
      this.context.rotate(randomAngle);
      this.context.drawImage(
        img,
        -this.radius,
        -this.radius,
        this.radius * 2,
        this.radius * 2
      );
      this.context.restore();
    } else if (this.movement == "spinning") {
      img = new Image();
      Math.random() < 0.7
        ? (img.src = "./images/spiral.png")
        : (img.src = "./images/colors.png");

      this.context.save();
      this.context.translate(this.x, this.y);
      //SPINNING MOVEMENT

      const randomAngle =
        Math.random() * (Math.PI * 2) * Math.random() * 2 + 0.1;
      this.context.rotate(randomAngle);
      //

      // CRAZY MOVEMENT
      //
      //           const time = Date.now();
      // const rotationSpeed = 0.002;
      // const rotationAngle = Math.sin(time * rotationSpeed) * Math.PI * 2;
      // const translationSpeed = 0.01;
      // const translationDistance = Math.sin(time * translationSpeed) * 50;
      // const translationDirection = Math.sin(time * translationSpeed * 2) > 0 ? 1 : -1;
      // const translationX = Math.cos(rotationAngle) * translationDistance * translationDirection;
      // const translationY = Math.sin(rotationAngle) * translationDistance * translationDirection;
      // this.context.translate(translationX, translationY);
      // this.context.rotate(rotationAngle);

      // */
      this.context.drawImage(
        img,
        -this.radius,
        -this.radius,
        this.radius * 2,
        this.radius * 2
      );
      this.context.restore();
    } else if (this.movement == "homing") {
      img = new Image();
      img.src = "./images/alien.png";
      this.context.save();
      this.context.translate(this.x, this.y);
      const randomAngle =
        Math.random() * (Math.PI * 2) * Math.random() * 0.04 + 0.01;
      this.context.rotate(randomAngle);
      this.context.drawImage(
        img,
        -this.radius - 20,
        -this.radius,
        this.radius * 2 + 40,
        this.radius * 2 + 10
      );
      this.context.restore();
    }
  }

  shooting(player, bullets) {
    const time = new Date().getTime();
    if (this.movement === "homing") {
      const timeSinceLastShot = time - this.lastShotTime;
      if (timeSinceLastShot >= this.timeBetweenShots) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        const velocity = {
          x: Math.cos(angle) * 5,
          y: Math.sin(angle) * 5
        };
        bullets.push(
          new Bullet(this.context, this.x, this.y, 5, "green", velocity)
        );
        this.lastShotTime = time;
      }
    }
  }

  // const angle = Math.atan2(player.y - this.y, player.x - this.x)
  // const speed = 2
  // this.velocity.x = Math.cos(angle) * speed
  // this.velocity.y = Math.sin(angle) * speed
  // this.x += this.velocity.x
  // this.y += this.velocity.y
  update(player, bullets) {
    if (this.movement == "linear") {
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    } else if (this.movement == "homing") {
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      const speed = Math.random() * 1 + 0.2;
      this.velocity.x = Math.cos(angle) * speed;
      this.velocity.y = Math.sin(angle) * speed;
      this.x = this.x + this.velocity.x + Math.sin(this.y * 0.1) * 1.5;
      this.y = this.y + this.velocity.y + Math.sin(this.x * 0.8) * 1.5;
      this.timeBetweenShots = Math.random() * 5000 + 1000;
      this.shooting(player, bullets);
    } else if (this.movement == "spinning") {
      this.radians += 0.1;
      this.velocity.x = Math.cos(this.angle);
      this.velocity.y = Math.sin(this.angle);
      this.center.x = this.x + this.velocity.x;
      this.center.y = this.y + this.velocity.y;
      
      //this make the spinning movement change its circle radius
       
        let amplitude =
          ((this.amplitudeMax - this.amplitudeMin) / 2) * Math.sin(Date.now() / 1000) +
          (this.amplitudeMax + this.amplitudeMin) / 2;
        this.x = this.center.x + Math.cos(this.radians) * amplitude;
        this.y = this.center.y + Math.sin(this.radians) * amplitude;
    
 
    }

    this.Image();
    if (this.debug) this.draw();
  }

  static spawnEnemies(enemies, time, enemyIntervalId, canvas, ctx, debug) {
    this.enemies = enemies;
    this.time = time;
    this.enemyIntervalId = enemyIntervalId;
    this.canvas = canvas;
    this.ctx = ctx
    this.debug = debug
    clearInterval(this.enemyIntervalId);
    setInterval(() => {

      
      const radius = Math.random() * 25 + 15;

      let x;
      let y;

      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      }

      const color = `rgba(${Math.random() * 360}, ${Math.random() * 360}, ${
        Math.random() * 360
      }, 0.6)`;

      const angle = Math.atan2(
        (Math.random() * canvas.height) / 2 - y,
        (Math.random() * canvas.width) / 2 - x
      );
    
      const velocity2 = Math.random() * 3 + 1;

      let velocity = {
        x: Math.cos(angle) * velocity2,
        y: Math.sin(angle) * velocity2
      };
      this.enemies.push(new Enemy(ctx, x, y, radius, color, velocity, angle, debugScript));
    }, time);
  }
}

// else  if (!this.Homing || !this.isLinear)) {
//     this.x = this.x + this.velocity.x + Math.sin(this.y * 0.1) * 1.5
//     this.y = this.y + this.velocity.y + Math.sin(this.x * 0.8) * 1.5

// }
// }

// this.velocity.x = Math.cos(this.angle)
// this.velocity.y = Math.sin(this.angle)

//     if (this.isLinear) {
// this.x = this.x + this.velocity.x
// this.y = this.y + this.velocity.y

//     } else {
//         this.x = this.x + this.velocity.x + Math.sin(this.y * 0.1) * 1.5
//         this.y = this.y + this.velocity.y + Math.sin(this.x * 0.8) * 1.5
//     }

// }

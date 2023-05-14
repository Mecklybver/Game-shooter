export class Bullet {
    constructor(context, x, y, radius, color, velocity, shooterIndex) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
      this.context = context;
      this.shooterIndex = shooterIndex;
      this.timer = 0
    }
    
    draw() {
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.context.fillStyle = this.color;
      this.context.fill();
    }
    
    update(player) {
      this.draw();
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.timer++
  
    
      }
    }
  
  
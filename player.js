import { Particle } from './particles.js'


export class Player {
  constructor(context, x, y, radius, color, debug) {
    this.x = x
    this.y = y
    this.radius = radius
    this.context = context
    this.gameOver = false;
    this.debug = debug
    this.color = color
    this.visible = true;
    this.velocity = {
      x: 0,
      y: 0
    }

  }
  
  draw() {
    if (this.visible){
    this.context.beginPath()
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.context.fillStyle = this.color
    this.context.fill()}
  }
   drawImage() {
    if (this.visible){
    const img = new Image();
    img.src = "./images/player.png"; //adding player
    
    this.context.save();
    this.context.translate(this.x, this.y);
    const randomAngle = Math.random() * (Math.PI * 2) * Math.random() * 0.04 + 0.01;
    this.context.rotate(randomAngle);
    
    this.context.drawImage(
      img,
      -this.radius -20,
      -this.radius -10,
      this.radius * 2 +40,
      this.radius * 2 +20
    );
    // this.context.drawImage(img, this.x - this.radius -10, this.y - this.radius -10, this.radius * 2 +20, this.radius * 2 +20);

    this.context.restore();}
  }
  update() {
    this.drawImage()
    if (this.debug == true) {
      this.draw()
    }

    
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y


  }
  
  
}

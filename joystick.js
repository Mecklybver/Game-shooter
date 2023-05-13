export class Joystick {
    constructor(canvas, ctx , x, y, r, type) {
      this.canvas = canvas;
      this.ctx = ctx
      this.x = x;
      this.y = y;
      this.r = r;
      this.velocity = 4;
      this.dx = 0;
      this.dy = 0;
      this.fillColor = "lightblue";
      this.pressed = false;
      this.X = this.x;
      this.Y = this.y;
      this.R = this.r + 20;
      this.type = type
    }

    draw() {
        let active_dist, overlap, overlapX, overlapY, X, Y;
        if (this.type === "analog") {
          //new vector cordinates (X,Y);
          X = this.x - this.X;
          Y = this.y - this.Y;
          //actove_dist is the distance between large circle center to small circle center
          active_dist = Math.sqrt(X * X + Y * Y);
          if (X && Y) {
            this.dx = X / active_dist;
            this.dy = Y / active_dist;
          }
    
          //if dynamic circle is oit of static circle run these code
          if (active_dist > this.R) {
            overlap = Math.abs(active_dist - this.R);
            overlapX = overlap * this.dx;
            overlapY = overlap * this.dy;
            //overlap is a vector which is needed to bright back dynamic circle to its position
            //or limiting the dynymic circle within the raidus of fixed circle
            this.x -= overlapX;
            this.y -= overlapY;
          }
          //draw dynamic circle
          this.ctx.beginPath();
          this.ctx.save();
          this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          this.ctx.fillStyle = this.fillColor;
          this.ctx.fill();
          this.ctx.stroke();
          this.ctx.closePath();
          this.ctx.restore();
    
          //draw fixed circle
          this.ctx.beginPath();
          this.ctx.arc(this.X, this.Y, this.R, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();
        } else if (this.type === "button") {
          //if button type is not analog
          this.ctx.beginPath();
          this.ctx.arc(this.X, this.Y, this.r, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
      addEventListeners() {
        //when you touch the screen it triggers 'touchstart'
        this.canvas.addEventListener("touchstart", (e) => {
          e.preventDefault();
          for (let i = 0; i < e.touches.length; i++) {
            switch (this.type) {
              case "analog":
                if (this.type === "analog") {
                  if (e.touches[i].clientX < this.canvas.width / 2) {
                    this.x = e.touches[i].clientX;
                    this.y = e.touches[i].clientY;
                    this.id = e.touches[i].identifier;
                    this.pressed = true;
                  }
                }
                break;
              case "button":
                if (
                  e.touches[i].clientX <= this.x + this.r &&
                  e.touches[i].clientX >= this.x - this.r &&
                  e.touches[i].clientY <= this.y + this.r &&
                  e.touches[i].clientY >= this.y - this.r
                ) {
                  this.x = e.touches[i].clientX;
                  this.y = e.touches[i].clientY;
                  this.id = e.touches[i].identifier;
                  this.pressed = true;
                }
                break;
            }
          }
        });
    
        //when you touch the screen it triggers 'touchmove'
        this.canvas.addEventListener("touchmove", (e) => {
          e.preventDefault();
          for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === this.id) {
              this.x = e.touches[i].clientX;
              this.y = e.touches[i].clientY;
              break;
            }
          }
        });
    
        //when you leave the screen or move the finger out of element it triggers 'touchend'
        this.canvas.addEventListener("touchend", (e) => {
          e.preventDefault();
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.id) {
              this.x = this.X;
              this.y = this.Y;
              this.pressed = false;
              break;
            }
          }
        });
      }
    
      update() {
        this.draw();
      }
    }
        
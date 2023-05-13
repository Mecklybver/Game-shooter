export class EndGame {
    constructor( canvas, ctx, score, animation, projectiles, enemies, bullets, player) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.player = player;
      this.bullets = bullets;
      this.enemies = enemies;
      this.projectiles = projectiles;
      this.animation = null;
      this.score = 0;
    }   
  
    // other methods...
  
    endGame() {
      cancelAnimationFrame(this.animation);
      this.ctx.save();
      this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = "180px Helvetica";
      this.ctx.fillStyle = "white";
      this.ctx.lineWidth = 5;
      this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 100);
      this.ctx.strokeStyle = "red";
      this.ctx.strokeText(
        `Your score is `,
        this.canvas.width / 2,
        this.canvas.height / 2 + 50
      );
      this.ctx.strokeText(`${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 100 * 2);
      this.ctx.restore();
  
      const self = this;
  
      setTimeout(() => {
        let game = prompt("Would you like to play again?").toLowerCase();
  
        if (game === "yes" || game === "y") {
          self.projectiles.length = 0;
          self.enemies.length = 0;
          self.bullets.length = 0;
          self.score = 0;
          self.player.x = self.canvas.width / 2;
          self.player.y = self.canvas.height / 2;
          self.player.velocity = {
            x: 0,
            y: 0
          };
          self.animation = requestAnimationFrame(self.animate.bind(self));
        } else if (game === "no" || game === "n") {
          self.ctx.save();
          self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
          self.ctx.fillStyle = "rgba(0, 0, 0, 0)";
          self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
          self.ctx.textAlign = "center";
          self.ctx.textBaseline = "middle";
          self.ctx.font = "180px Helvetica";
          self.ctx.fillStyle = "white";
          self.ctx.fillText("BYE-BYE!", self.canvas.width / 2, self.canvas.height / 2);
          self.ctx.restore();
          alert("Thank you for playing! \n You can close this tab now.");
        } else {
          alert("Please enter a valid answer.");
          self.endGame();
        }
      }, 2000);
    }
  }
  
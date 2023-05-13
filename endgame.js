import { shooting, moving } from "./events.js";
import { Particle } from "./particles.js";


export class EndGame {
  constructor(
    canvas,
    ctx,
    score,
    animation,
    projectiles,
    enemies,
    bullets,
    player,
    moving,
    shooting
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.score = score;
    this.animation = animation;
    this.projectiles = projectiles;
    this.enemies = enemies;
    this.bullets = bullets;
    this.player = player;

    removeEventListener("click", shooting);
removeEventListener("keydown", moving);
removeEventListener("keyup", moving);
removeEventListener("keypress", moving);
    this.projectiles.length = 0;
    this.enemies.length = 0;
    this.bullets.length = 0;
    this.player = null;


    ctx.clearRect(0, 0, canvas.width, canvas.height);


    this.animation = cancelAnimationFrame(this.animation);

    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "180px Helvetica";
    this.ctx.fillStyle = "white";
    this.ctx.lineWidth = 5;
    this.ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - 100
    );
    this.ctx.strokeStyle = "red";
    this.ctx.strokeText(
      `Your score is `,
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
    this.ctx.strokeText(
      `${score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 100 * 2
    );
    this.ctx.restore();
  }
}

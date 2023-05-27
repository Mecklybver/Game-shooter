import { animate } from "./script.js";

export class Restart {
  constructor(animation, canvas, player) {
    this.animation = animation;
    this.canvas = canvas;
    this.player = player;
    this.player.x = canvas.width * 0.5;
    this.player.y = canvas.height * 0.5;
    this.score = 0;
    this.projectiles = [];
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.player.visible = true;

    this.animateCallback = () => {
      animate(0);
      requestAnimationFrame(this.animation);
    };

    this.animateCallback();
  }
}

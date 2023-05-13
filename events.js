import { Projectile } from "./projectile.js";

export function shooting(projectiles, player, ctx) {
  addEventListener("click", event => {
    const angle = Math.atan2(
      event.clientY - player.y,
      event.clientX - player.x
    );
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    };
    projectiles.push(
      new Projectile(ctx, player.x, player.y, 5, "red", velocity)
    );
  });
}

function handleF2(player, enemies) {
  player.debug = !player.debug;
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].debug = player.debug;
  }
}

export function moving(player, enemies, debug) {
  addEventListener("keydown", e => {
    switch (e.key) {
      case "ArrowUp":
        player.velocity.y = -5;
        break;
      case "ArrowDown":
        player.velocity.y = +5;
        break;
      case "ArrowLeft":
        player.velocity.x = -5;
        break;
      case "ArrowRight":
        player.velocity.x = +5;
        break;
      case "F2":
        handleF2(player, enemies);
        break;
    }
  });

  addEventListener("keyup", e => {
    player.velocity.x = 0;
    player.velocity.y = 0;
  });

  addEventListener("keypress", e => {
    switch (e.key) {
      case "w":
        player.velocity.y = -5;
        break;
      case "s":
        player.velocity.y = +5;
        break;
      case "a":
        player.velocity.x = -5;
        break;
      case "d":
        player.velocity.x = +5;
        break;
      case "F2":
        handleF2(player, enemies);
        break;
    }
  });
}

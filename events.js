import { Projectile } from "./projectile.js";
import { canvas } from "./script.js";

export function shooting(projectiles, player, ctx) {
  addEventListener("click", (event) => {
    const angle = Math.atan2(
      event.clientY - player.y,
      event.clientX - player.x
    );
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    };
    if (player.visible) {
      projectiles.push(
        new Projectile(ctx, player.x, player.y, 5, "red", velocity)
      );
    }
  });

  //mobile things

  addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    const angle = Math.atan2(
      touch.clientY - player.y,
      touch.clientX - player.x
    );
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    };
    if (player.visible) {
      projectiles.push(
        new Projectile(ctx, player.x, player.y, 5, "red", velocity)
      );
    }
  });
}
export let debugScript;
function handleF2(player, enemies) {
  debugScript = false;
  player.debug = !player.debug;
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].debug = player.debug;
    debugScript = player.debug;
  }
}

export function moving(player, enemies) {
  addEventListener("keydown", (e) => {
    if (player.visible) {
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
    }
  });

  addEventListener("keyup", (e) => {
    player.velocity.x = 0;
    player.velocity.y = 0;
  });

  addEventListener("keypress", (e) => {
    if (player.visible) {
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
    }
  });

  // Mobile touch control
  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);
  canvas.addEventListener("touchend", handleTouchEnd);

  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (player.visible) {
      player.velocity.x = deltaX / 10;
      player.velocity.y = deltaY / 10;
    }
  }

  function handleTouchEnd() {
    player.velocity.x = 0;
    player.velocity.y = 0;
  }
}

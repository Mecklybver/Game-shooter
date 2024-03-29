// [Refactoring, please wait...]
//TODO: add touch joystick for mobiles
// TODO: to make enemies follow player movement

// https://www.youtube.com/watch?v=H-I87RpdnBU&t=3s
//https://www.youtube.com/watch?v=Wcml7OF6DNI
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { shooting, moving } from "./events.js";
import { Particle } from "./particles.js";
import { EndGame } from "./endgame.js";
import { Restart } from "./restart.js";
import { debugScript } from "./events.js";

let game;
// let ratio = window.devicePixelRatio;
let initiate = confirm("Welcome to the game! \n Would you like to play?");
if (initiate) game = "yes";
export const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// console.log(ratio)
// canvas.style.width = `${canvas.widht}px`;
// canvas.style.height = `${canvas.height}px`;
// ctx.scale(ratio, ratio)

// player coordinates
const x = canvas.width / 2;
const y = canvas.height / 2;

// const joystick = new Joystick(canvas,ctx, 50, canvas.height - 50, 10, "analog" );

let debug = debugScript

const player = new Player(ctx, x, y, 15, "white", debug);
const projectiles = [];
const bullets = [];
const enemies = [];
const particles = [];

let angle2;
let velocity;
let time = Math.random() * 2800 + 800;
let enemyIntervalId = null;

let startTime = new Date().getTime() / 1000;

function clock() {
  let x = canvas.width - 150;
  let y = 20;
  let currentTime = new Date().getTime() / 1000;
  let timePassed = Math.floor(currentTime - startTime);

  let minutes = Math.floor(timePassed / 60);
  let seconds = timePassed % 60;
  let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  ctx.save();
  ctx.font = "50px Helvetica";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`${formattedTime}`, x, y);
  ctx.restore();
}

let background =
  "https://i.pinimg.com/originals/18/91/7d/18917daf305de90a97aa2707f4cc34eb.jpg";
let deltaTime = 0;
let lastTime = 0;
let score = 0;
let scoreColor = "white";
export let animation;
let end = false;


let bx =  0
let by = 0;

export function animate(stampTime) {
  ////ANIMATE FUNCTION IS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  debug = debugScript
  deltaTime = stampTime - lastTime;
  lastTime = stampTime;
  ctx.save();
  ctx.fillStyle = scoreColor;
  ctx.font = "48px Helvetica";
  ctx.fillText(`Score: ${score}`, 10, 50);
  ctx.restore();
  animation = requestAnimationFrame(animate);
 
 

  ctx.save();
  ctx.globalAlpha = 0.1; // set the globalAlpha to 0.5 for 50% transparency
  Math.random() * (Math.PI * 2) * (0.00095 * (Math.random() + 0.5));

  let bg = new Image();
  bg.src = background
  if (player.debug){
     ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  }

  else if(!player.debug){ 
    ctx.drawImage(bg, bx, by, canvas.width, canvas.height);
    ctx.drawImage(bg, bx, by + canvas.height, canvas.width, canvas.height);
  }
  by -= 0.02
  if (by + canvas.height <= 0 ) by = 0;

  ctx.restore();

  projectiles.forEach((projectile) => {
    projectile.update();
    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y - projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    )
      setTimeout(() => {
        projectiles.splice(projectile, 1);
      }, 0);
  });

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  enemies.forEach((enemy, index) => {
    if (enemy.movement == "homing") velocity = Math.random() * 6 + 3;

    enemy.update(player, bullets);
    projectiles.forEach((projectile, projectilesIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6)
              },
              ctx
            )
          );
        }

        enemies.splice(index, 1);
        projectiles.splice(projectilesIndex, 1);
        score++;
        // player.radius ++
        scoreColor = enemy.color;
        if (enemy.movement == "homing") {
          score++;
        }
      }
    });

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (
        enemy.x < -enemy.radius * 4 || // left
        enemy.x > canvas.width + enemy.radius * 4 || // right
        enemy.y < -enemy.radius * 4 || // top
        enemy.y > canvas.height + enemy.radius * 4 // bottom
      ) {
        enemies.splice(i, 1);
        i--;
      }
    }

    bullets.forEach((bullet, index) => {
      const dist = Math.hypot(bullet.x - player.x, bullet.y - player.y);
      if (player.visible && dist - player.radius - bullet.radius < 1) {
        player.visible = false;

        for (let j = 0; j < 5; j++) {
          for (let i = 0; i < player.radius * 10; i++) {
            particles.push(
              new Particle(
                player.x,
                player.y,
                Math.random() * 1.5,
                `hsl(${Math.random() * 55 + 30}, 100%, ${
                  Math.random() * 30 + 60
                }%)`,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 10), // it makes it more impressive
                  y: (Math.random() - 0.5) * (Math.random() * 10)
                },
                ctx
              )
            );
          }
        }
        end = true;

        // endGame();
        setTimeout(() => {
          if (end) {
            new EndGame(
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
            );
          }
        }, 5000);

        // gameover();
        // restart();
      }
    });

    if (
      player.visible &&
      Math.hypot(enemy.x - player.x, enemy.y - player.y) <
        enemy.radius + player.radius
    ) {
      player.visible = false;
      for (let a = 0; a < 5; a++) {
        for (let i = 0; i < player.radius * 20; i++) {
          particles.push(
            new Particle(
              player.x,
              player.y,
              Math.random() * 1.5,
              `hsl(${Math.random() * 55 + 30}, 100%, ${
                Math.random() * 30 + 60
              }%)`,
              {
                x: (Math.random() - 0.5) * (Math.random() * 20),
                y: (Math.random() - 0.5) * (Math.random() * 20)
              },
              ctx
            )
          );
        }
      }
      end = true;

      // endGame();
      setTimeout(() => {
        if (end) {
          new EndGame(
            canvas,
            ctx,
            score,
            animation,
            projectiles,
            enemies,
            bullets,
            player
          );
        }
      }, 5000);

      setTimeout(() => {
        let confirmation = confirm("Would you like to play");

        if (end && confirmation) {
          new Restart(animation, canvas, player);
          end = false;
        }
      }, 9000);
    }
  });

  player.update();

  bullets.forEach((bullet, index) => {
    bullet.update();

    if (
      bullet.x + bullet.radius < 0 ||
      bullet.x - bullet.radius > canvas.width ||
      bullet.y + bullet.radius < 0 ||
      bullet.y - bullet.radius > canvas.height
    ) {
      bullets.splice(index, 1);
    }
  });
  enemies.forEach((enemy) => {
    enemy.update(player, bullets);
  });
  // joystick.update()

  // make enemies explode when the collide each other

  for (let a = 0; a < enemies.length; a++) {
    for (let b = a + 1; b < enemies.length; b++) {
      if (
        enemies[a].movement != "spinning" &&
        enemies[b].movement != "spinning" &&
        Math.hypot(enemies[a].x - enemies[b].x, enemies[a].y - enemies[b].y) <
          enemies[a].radius + enemies[b].radius
      ) {
        for (let i = 0; i < enemies[a].radius * 5; i++) {
          particles.push(
            new Particle(
              enemies[a].x,
              enemies[a].y,
              Math.random() * 1.5,
              enemies[a].color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 20),
                y: (Math.random() - 0.5) * (Math.random() * 20)
              },
              ctx
            )
          );
          particles.push(
            new Particle(
              enemies[b].x,
              enemies[b].y,
              Math.random() * 1.5,
              enemies[b].color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 20),
                y: (Math.random() - 0.5) * (Math.random() * 20)
              },
              ctx
            )
          );
        }
        enemies.splice(b, 1);
        enemies.splice(a, 1);
        a--;
        b--;
      }
    }
  }

  //make enemies explode when colliding from alien's bullets
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      if (
        Math.hypot(enemies[i].x - bullets[j].x, enemies[i].y - bullets[j].y) <
          enemies[i].radius &&
        bullets[j].timer > 20
      ) {
        for (let k = 0; k < enemies[i].radius * 3; k++) {
          particles.push(
            new Particle(
              enemies[i].x,
              enemies[i].y,
              Math.random() * 1.5,
              `hsl(${Math.random() * 55 + 30}, 100%, ${
                Math.random() * 30 + 60
              }%)`,
              {
                x: (Math.random() - 0.5) * (Math.random() * 20),
                y: (Math.random() - 0.5) * (Math.random() * 20)
              },
              ctx
            )
          );
        }
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        i--;
        break;
      }
    }
  }

  clock();
}

// joystick.addEventListeners()
if (game === "yes" || game === "y") {
  addEventListener("load", function () {
    animate(0);
  });
}

let vary = Math.floor(Math.random() * 3 + 1);
for (let i = 0; i < vary; i++) {
  Enemy.spawnEnemies(
    enemies,
    time,
    enemyIntervalId,
    canvas,
    ctx,
    player,
    debug
  );
}

shooting(projectiles, player, ctx);

moving(player, enemies, debug);

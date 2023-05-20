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

let game;
let ratio = window.devicePixelRatio
let initiate = confirm("Welcome to the game! \n Would you like to play?");
if (initiate) game = "yes";
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = innerWidth
canvas.height = innerHeight
// canvas.style.width = `${window.innerWidth}px`;
// canvas.style.height = `${window.innerHeight}px`;
// ctx.scale(ratio, ratio)


// player coordinates
const x = canvas.width / 2;
const y = canvas.height / 2;

// const joystick = new Joystick(canvas,ctx, 50, canvas.height - 50, 10, "analog" );

export let debug = false;

const player = new Player(ctx, x, y, 15, "white", debug);
const projectiles = [];
const bullets = [];
const enemies = [];
const particles = [];

let angle2;
let velocity;
let time = Math.random() * 1500 + 500;
let enemyIntervalId = null;

let startTime = new Date().getTime() / 1000;

function clock() {
  let x = canvas.width - 150;
  let y = 20;
  let currentTime = new Date().getTime() / 1000;
  let timePassed = Math.floor(currentTime - startTime);

  let minutes = Math.floor(timePassed / 60);
  let seconds = timePassed % 60;
  let formattedTime = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  ctx.save();
  ctx.font = "50px Helvetica";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`${formattedTime}`, x, y);
  ctx.restore();
}

let background =
  "https://mir-s3-cdn-cf.behance.net/project_modules/1400/d9d7ad104360973.5f6142500e188.png";
let deltaTime = 0;
let lastTime = 0;
let score = 0;
let scoreColor = "white";
let animation;
let end = false;

function animate(stampTime) {
  ////ANIMATE FUNCTION IS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  deltaTime = stampTime - lastTime;
  lastTime = stampTime;
  ctx.save();
  ctx.fillStyle = scoreColor;
  ctx.font = "48px Helvetica";
  ctx.fillText(`Score: ${score}`, 10, 50);
  ctx.restore();
  animation = requestAnimationFrame(animate);
  // ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  let img;
  if (!debug) {
    img = new Image();
    img.src = background;
  } else {
    img.src = null;
  }
  ctx.save();
  ctx.globalAlpha = 0.1; // set the globalAlpha to 0.5 for 50% transparency
  Math.random() * (Math.PI * 2) * (0.00095 * (Math.random() + 0.5));

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  ctx.restore();

  projectiles.forEach(projectile => {
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
        
       for ( let j = 0; j <5 ; j++){
          for (let i = 0; i < player.radius * 10; i++) {
            particles.push(
              new Particle(
                player.x,
                player.y,
                Math.random() * 1.5,
                `hsl(${Math.random() * 55 + 30}, 100%, ${Math.random() * 30 + 60}%)`,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 10), // it makes it more impressive
                  y: (Math.random() - 0.5) * (Math.random() * 10)
                },
                ctx
              )
            );
          }}
          
        



        // endGame();
        setTimeout(() => {
        if (end){
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
        );}
      }, 5000);

        // gameover();
        // restart();
      }
    });

    if (
      player.visible &&
      Math.hypot(enemy.x - player.x, enemy.y - player.y) <
      enemy.radius + player.radius
    ){
      player.visible = false;
      for (let a = 0; a < 5; a++){
        for (let i = 0; i < player.radius * 20; i++) {
          particles.push(
            new Particle(
              player.x,
              player.y,
              Math.random() * 1.5,
              `hsl(${Math.random() * 55 + 30}, 100%, ${Math.random() * 30 + 60 }%)`,
              {
                x: (Math.random() - 0.5) * (Math.random() * 20),
                y: (Math.random() - 0.5) * (Math.random() * 20)
              },
              ctx
            )
          );
        }}
        end = true
      
      

      // endGame();
      setTimeout(() => {
      if (end){
      new EndGame(
        canvas,
        ctx,
        score,
        animation,
        projectiles,
        enemies,
        bullets,
        player
      );}
    }, 5000);
      // gameover();
      // restart();
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
  enemies.forEach(enemy => {
    enemy.update(player, bullets);

  });
  // joystick.update()
 

  // make enemies explode when the collide each other
  
  for (let a = 0; a < enemies.length; a++) {
    for (let b = a + 1; b < enemies.length; b++) {
      if (enemies[a].movement !="spinning" 
      && enemies[b].movement !="spinning" 
      && Math.hypot(enemies[a].x - enemies[b].x, enemies[a].y - enemies[b].y)
       < enemies[a].radius + enemies[b].radius) 
       {
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
      if (Math.hypot(enemies[i].x - bullets[j].x, enemies[i].y - bullets[j].y) < enemies[i].radius 
      && bullets[j].timer > 20  ) {
        for (let k = 0; k < enemies[i].radius * 3; k++) {
          particles.push(
            new Particle(
              enemies[i].x,
              enemies[i].y,
              Math.random() * 1.5,
              `hsl(${Math.random() * 55 + 30}, 100%, ${Math.random() * 30 + 60 }%)`,
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
if (game == "yes" || "y") addEventListener("load", animate(0));

Enemy.spawnEnemies(enemies, time, enemyIntervalId, canvas, ctx, player, debug);

shooting(projectiles, player, ctx);

moving(player, enemies, debug);

// function gameover(){
//   animation = cancelAnimationFrame(animation);
//   clearInterval(enemyIntervalId);
//   ctx.save()
//   ctx.font = "bold 180px Helvetica"
//   ctx.fillStyle = "white";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.fillText(`Game Over`, canvas.width / 2 , canvas.height / 2);
//   ctx.fillText(`Score: ${score}`, canvas.width / 2 , canvas.height / 2 + 150);
//   ctx.restore()
//   removeEventListener("keydown", moving);
//   removeEventListener("keyup", moving);
//   player.velocity= {x: 0, y: 0};
// }

// function restart() {
//   cancelAnimationFrame(animation);

//   score = 0;
//   projectiles.length = 0;
//   bullets.length = 0;
//   enemies.length = 0;
//   particles.length = 0;
//   player.x = canvas.width / 2;
//   player.y = canvas.height / 2;
//   player.radius = 15;
//   setTimeout(() => {
//   initiate = confirm("Would you like to play again?");}, 0);
//   if (initiate) {
//     game = "yes";
//     startTime = 0;
//     enemyIntervalId = setInterval(() => {
//       const radius = Math.random() * (30 - 4) + 4;
//       let x;
//       let y;
//       if (Math.random() < 0.5) {
//         x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
//         y = Math.random() * canvas.height;
//       } else {
//         x = Math.random() * canvas.width;
//         y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
//       }
//       const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
//       const angle = Math.atan2(player.y - y, player.x - x);
//       const angle2 = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
//       const velocity = { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 };
//       // const movement =
//       //   Math.random() < 0.5 ? "straight" : "homing";
//       const enemy = new Enemy(ctx, x, y, radius, color, velocity, angle, angle2, debug);
//       enemies.push(enemy);
//     }, time);
//     addEventListener("load", animate()) ;
//   } else {
//     cancelAnimationFrame(animation);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   }

// }

// GAME OVER

// function endGame() {

//   cancelAnimationFrame(animation);
//   ctx.save();
//     ctx.fillStyle = "rgba(0, 0, 0, 1)";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.font = "180px Helvetica";
//     ctx.fillStyle = "white";
//     ctx.lineWidth = 5;
//     ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 100);
//     ctx.strokeStyle = "red";
//     ctx.strokeText(
//       `Your score is `,
//       canvas.width / 2,
//       canvas.height / 2 + 50
//     );
//     ctx.strokeText(`${score}`, canvas.width / 2, canvas.height / 2 + 100 * 2);
//     ctx.restore();

//   setTimeout(() => {

//     let game = prompt("Would you like to play again?").toLowerCase();

//     if (game === "yes" || game === "y") {
//       projectiles.length = 0;
//       enemies.length = 0;
//       bullets.length = 0;
//       score = 0;
//       player.x = canvas.width / 2;
//       player.y = canvas.height / 2;
//       player.velocity = {
//         x: 0,
//         y: 0
//       }
//       animation = requestAnimationFrame(animate);
//     } else if (game === "no" || game === "n") {
//       ctx.save();
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = "rgba(0, 0, 0, 0)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.font = "180px Helvetica";
//       ctx.fillStyle = "white";
//       ctx.fillText("BYE-BYE!", canvas.width / 2, canvas.height / 2);
//       ctx.restore();
//       alert("Thank you for playing! \n You can close this tab now.");
//     } else {
//       alert("Please enter a valid answer.");
//       endGame( canvas, ctx, score, animation, projectiles, enemies, bullets, player);
//     }
//   }, 2000);

// }

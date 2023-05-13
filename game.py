import pygame
import random
import math

pygame.init()

# Set up the screen
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Shooter Game")

# Define colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)

class Player:
    def __init__(self, x, y, radius, color):
        self.x = x
        self.y = y
        self.radius = radius
        self.color = color

    def draw(self):
        pygame.draw.circle(screen, self.color, (self.x, self.y), self.radius)

class Projectile:
    def __init__(self, x, y, radius, color, velocity):
        self.x = x
        self.y = y
        self.radius = radius
        self.color = color
        self.velocity = velocity

    def draw(self):
        pygame.draw.circle(screen, self.color, (self.x, self.y), self.radius)

    def update(self):
        self.draw()
        self.x += self.velocity[0]
        self.y += self.velocity[1]

class Enemy:
    def __init__(self, x, y, radius, color, velocity):
        self.x = x
        self.y = y
        self.radius = radius
        self.color = color
        self.velocity = velocity

    def draw(self):
        pygame.draw.circle(screen, self.color, (self.x, self.y), self.radius)

    def update(self):
        self.draw()
        self.x += self.velocity[0]
        self.y += self.velocity[1]

# Create the player object
player = Player(screen_width // 2, screen_height // 2, 15, WHITE)

# Initialize lists to hold projectiles and enemies
projectiles = []
enemies = []

# Spawn enemies every second
ENEMY_SPAWN_EVENT = pygame.USEREVENT + 1
pygame.time.set_timer(ENEMY_SPAWN_EVENT, 1000)

def spawn_enemy():
    radius = random.randint(8, 30)
    color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    spawn_location = random.choice(["top", "bottom", "left", "right"])
    if spawn_location == "top":
        x = random.randint(0 + radius, screen_width - radius)
        y = 0 - radius
    elif spawn_location == "bottom":
        x = random.randint(0 + radius, screen_width - radius)
        y = screen_height + radius
    elif spawn_location == "left":
        x = 0 - radius
        y = random.randint(0 + radius, screen_height - radius)
    else:
        x = screen_width + radius
        y = random.randint(0 + radius, screen_height - radius)
    angle = math.atan2(screen_height / 2 - y, screen_width / 2 - x)
    speed = random.uniform(0.1, 0.5)
    velocity = [math.cos(angle) * speed, math.sin(angle) * speed]
    # Draw the enemy
    enemy = Enemy(x, y, radius, color, velocity)
    enemy.draw()
    # Add the enemy to the list of enemies
    enemies.append(enemy)


# Run the game loop
running = True
while running:
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == ENEMY_SPAWN_EVENT:
            spawn_enemy()
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1: # Left mouse button
                # Get the position of the mouse click
                mouse_x, mouse_y = pygame.mouse.get_pos()
                # Calculate the velocity of the projectile based on the distance from the player to the mouse click
                dx = mouse_x - player.x
                dy = mouse_y - player.y
                distance = math.sqrt(dx ** 2 + dy ** 2)
                speed = 1
                velocity = [dx / distance * speed, dy / distance * speed]
                # Create the projectile object and add it to the list of projectiles
                projectiles.append(Projectile(player.x, player.y, 5, RED, velocity))
        # Update the display
    pygame.display.update()


    # Fill the screen with black
    screen.fill(BLACK)

    # Draw the player
    player.draw()

    # Update and draw the projectiles
    for projectile in projectiles:
        projectile.update()
        # Remove the projectile if it goes off-screen
        if projectile.x < 0 or projectile.x > screen_width or projectile.y < 0 or projectile.y > screen_height:
            projectiles.remove(projectile)

    # Update and draw the enemies
    for enemy in enemies:
        enemy.update()
        # Remove the enemy if it goes off-screen
        if enemy.x < 0 - enemy.radius or enemy.x > screen_width + enemy.radius or enemy.y < 0 - enemy.radius or enemy.y > screen_height + enemy.radius:
            enemies.remove(enemy)

    # Check for collisions between projectiles and enemies
    for enemy in enemies:
        for projectile in projectiles:
            distance = math.sqrt((projectile.x - enemy.x) ** 2 + (projectile.y - enemy.y) ** 2)
            if distance < enemy.radius + projectile.radius:
                enemies.remove(enemy)
                projectiles.remove(projectile)

    # Update the display
    pygame.display.update()

# Quit the game
pygame.quit()

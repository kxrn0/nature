- [Introduction](#introduction)
- [User's perspective](#users-perspective)
- [Bird's eye view](#birds-eye-view)
- [Roadmap](#roadmap)
- [Log](#log)

# Introduction

The task is described vervatim as follows

> Create a simulation of an object (think about a vehicle) that accelerates when you press the up arrow and brakes when you press the down arrow.

this is after introducing the concept of vectors and the relations between position, velocity, and acceleration.

Doing this doesn't sound too complicated, but it's a bit ambiguous. I'll interpret it as building something like the spaceship from asteroids. And while I'm at it, I may as well code a simple version of the game.

# User's Perspective

The user is greeted with a screen that invites them to click on it to start the game. The player starts in the middle of the canvas. \
The game is played on a 1500x900 canvas. \
Pressing on the arrow keys accelerates the user in the direction the arrows point.
Pressing on the s key shoots a projectile forward. The player and the asteroids are bound by the canvas, and bounce off its edges if they collide on them. \
The player experiences a drag when moving so that if acceleration is only applied once, the player will eventually come to a halt. The asteroids don't experience such drag. \
The asteroids spawn from a point at the top middle of the canvas. \
The player is constantly losing energy, which can be replenished by destroying the asteroids. When an asteroid is destroyed it leaves behind an energy source the player can collect if their energy reserves are low enough. \
The player can only collect the source if it's no larger than 1.5 the player's energy deficiency. \
When a projectile hits an asteroid, both, the projectile and the asteroid are destroyed. \
Shooting a projectile costs energy. \
The game is over when the player collides with an asteroid. The user is presented with the choice to play again. \
The user can pause the game.

# Bird's eye view

I will need two main functions, an initialization function, and a game loop. \
There are four types of entities in the game; the player, the asteroids, the fuel sources, and the projectiles. The player, asteroids, and projectiles all move, so they will probably be descendants of a generic object that moves. The energy source can be of a different type. \
The asteroids don't interact with each other, or with the sources, only the player interacts with them. The projectiles only interact with the asteroids. \
The game will have four states; `start`, `playing`, `paused`, and `over`. The `start`, `paused`, and `over` are very similar, and when active the game loop won't be running. The `start` state is set by the initializing function. \
When the user loads the app, they will be greeted with the start screen. After clicking on the screen the state of the game will change to `playing`, the player will be initialized on the middle of the screen, with 100% health, and the game loop will start. The asteroids, sources, and projectiles will have to be kept in an array, which will be initialized empty. To know when to move the player there will be a variable that will keep track of when the player is pressing an arrow key, call this `isAccelerating`. The player, asteroids, and projectiles are derived from a generic mover object that can be given an acceleration which is added to the mover's velocity when updated.

A mover is an object with a position and a velocity. It has a `move` method that adds the velocity to the position, and optionally reduces the velocity by a drag factor after this. It also has a `react` method that adds an acceleration vector to the velocity. \

When the app loads, the state of the game is set to `start`. When the user clicks the screen the player is created and initialized at the center of the screen. The arrays for asteroids and projectiles are initialized to empty arrays. For every frame the player loses a bit of energy, say n. When the player is accelerating they lose a bit more of energy, say 1.5n. \
For every iteration of the loop we first check if any projectile is colliding with any asteroid, if so we destroy both, which entails removing them from the array, and creating a source and placing it on the last position of the projectile.
If the player runs out of energy it cannot longer move, and will have to wait to be killed. \
The game is paused when the user presses on the p key. A variable that keeps track of the animation frame id will be used to cancel the loop. We can resume the game by just callign `requestAnimationFrame` with the loop function.\
After checking if any projectile is colliding with any asteroid we check if any asteroid is colliding with the player.

This will go on until the player dies.

# Roadmap

First we need to create the basic game loop. That is easy, we create two functions; `init`, and `anime`, and set the up like this

```javascript
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let prevTime;

function anime(timestamp) {
  const dt = timestamp - prevTime;

  context.clearRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(anime);
}

function init() {
  prevTime = 0;

  requestAnimationFrame(anime);
}
```

That looks like the basic structure of a game loop. Next we need to consider the variables we will need to keep track of during the game. We need to keep track of the player, the asteroids, the sources, the projectiles, and the state of the game. \
Since the player, asteroids, and projectiles move, we need to build the mover object, and the vector that it will use. \
Assuming we've bult the basic objects, we'll derive the player, asteroids, and projectiles from them. Once derived we'll focus on managing the `state` variable of the game to allow for starting, pausing, resuming, and playing again. \
At this point we'll be able to change the state of the game, and would have the basics of the various elements implemented, but at this point there would still be nothing on the screen. We can next add a player, asteroids, and let the player shoot projectiles, but the elements would still not interact with each other. Next comes interaction. All elements are idealized as circles, so finding out whether or not they've collided is easy, but handling that is not as simple. The collision of a player with an asteroid will end the game, and that's the behaviour we'll code first. After that we'll add code for destroying asteroids with the projectiles, and finally code for making the user interact with energy sources. Once done we'll add code to decrease the user's energy consumption for every frame, and when shooting and moving takes place.

# Log

We have the loop ready. We'll first code the Vector and mover objects. For our purpose I think the following implementation of a vector will be enough. The `add` function may not even be necessary, since we'll need to be checking that the object doesn't go beyond the edges of the canvas, so we'll probably need to do more than just add a vector to another. I decided to not derive the player from the mover, or rather, I had already written the player after completely forgetting the mover, despite writting it no more than five minutes earlier.

```javascript
export default function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function (other) {
    this.x += other.x;
    this.y += other.y;
  };

  this.scale = function (n) {
    this.x *= n;
    this.y *= n;
  };

  this.get_angle = function () {
    return Math.atan2(this.y, this.x);
  };
}
```

Since each entity has its own appearance, the mover is only responsible for moving, and not for drawing anything, so it can look like this

```javascript
export default function Mover(position, velocity, drag) {
  this.position = position;
  this.velocity = velocity;
  this.drag = drag;

  this.react = function (to) {
    this.velocity.add(to);
  };

  this.move = function () {
    this.position.add(velocity);
    this.velocity.scale(this.drag);
  };
}
```

What is a player? A player is an entity with a position, velocity, drag factor, and radius. It's something that can draw itself on the screen, so it needs a canvas. It's something that is constrained to the canvas. It can respond to keyboard events as well.

I think this implementation of the player is in the right direction, but I still need to test it.

```javascript
import Vector from "./Vector";

export default function Player(position, velocity, drag, acc, canvas, radius) {
  this.position = position;
  this.velocity = velocity;
  this.drag = drag;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.radius = radius;
  this.boundaries = {
    x: { min: radius, max: canvas.width - radius },
    y: { min: radius, max: canvas.height - radius },
  };
  this.directions = {
    ArrowUp: new Vector(0, -acc),
    ArrowRight: new Vector(acc, 0),
    ArrowDown: new Vector(0, acc),
    ArrowLeft: new Vector(-acc, 0),
  };
  this.direction = new Vector(0, 0);

  this.draw = function () {
    const angle = this.velocity.get_angle();

    this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fill();

    this.context.beginPath();
    this.context.fillStyle = "yellow";
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(angle);
    this.context.moveTo(this.radius, 0);
    this.context.lineTo(-this.radius, -this.radius);
    this.context.lineTo(-this.radius, this.radius);
    this.context.fill();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  this.move = function (dt) {
    const x = this.position.x + this.velocity.x;
    const y = this.position.y + this.velocity.y;

    if (this.boundaries.x.min < x && x < this.boundaries.x.max) {
      this.position.x = x;

      this.velocity.x *= this.drag;
    } else {
      if (x < this.boundaries.x.min) this.position.x = this.boundaries.x.min;
      else this.position.x = this.boundaries.x.max;

      this.velocity.x *= -this.drag;
    }

    if (this.boundaries.y.min < y && y < this.boundaries.y.max) {
      this.position.y = y;

      this.velocity.y *= this.drag;
    } else {
      if (y < this.boundaries.y.min) this.position.y = this.boundaries.y.min;
      else this.position.y = this.boundaries.y.max;

      this.velocity.y *= -this.drag;
    }
  };

  this.update = function (dt) {
    if (this.direction) this.velocity.add(this.direction);

    this.move();
    this.draw();
  };

  window.addEventListener("keydown", (event) => {
    const v = this.directions[event.key];

    if (v) this.direction = v;
  });

  window.addEventListener("keyup", () => (this.direction = null));
}
```

It kind of works, but if I press an arrow key, let go, and quickly press another, the object makes a brief pause, and then continues in the new direction. I think I need a stack. I should not set the direction to `null` when there's a `keyup` event, but when this stack is empty. I think it may not even have to be an array, just a variable that keeps track of how many times a key has been pressed without releasing it, and once this variable is zero, the direction is set to null.

Doing this is not as simple since if the user holds the key for an extended period of time the event triggers again and again, making it so that the variable that is supposed to keep track of the number of times there has been a key press keeps increasing thus making its value useless. I think I may be able to fix this by having a check on the `keydown` event handler. If the selected vector is the same as the current direction, then skip increasing the stack value. The updated code looks as follows

```javascript
export default function Player(/* ... */) {
  // ...
  this.directions = {
    ArrowUp: new Vector(0, -acc),
    ArrowRight: new Vector(acc, 0),
    ArrowDown: new Vector(0, acc),
    ArrowLeft: new Vector(-acc, 0),
  };
  this.direction = new Vector(0, 0);
  this.sxarp = 0;

  this.update = function () {
    if (this.direction) this.velocity.add(this.direction);
  };

  window.addEventListener("keydown", (event) => {
    const v = this.directions[event.key];

    if (v === this.direction) return;

    if (v) {
      this.direction = v;
      this.sxarp++;
    }
  });

  window.addEventListener("keyup", (event) => {
    const v = this.directions[event.key];

    if (v) this.sxarp--;

    if (!this.sxarp) this.direction = null;
  });
}
```

I also added code for reducing the health with every frame, and doing it 1.5 times faster when the user is accelerating. Where should the health be drawn? should the player itself draw its health, or should it have a getter so the main function decides how to draw it? On this simple game I will make the user itself draw its energy, but on a more complex appit may be better to have something external take care of it.

I'll remove the timestamp and associated code for now to simplify things.

What do we have so far? we have a player that can be moved around the screen by clicking on the arrow keys. It bounces off the edges of the screen, and its energy is constantly decreasing. I need the player to be able to shoot projectiles, collide with asteroids, and collect energy sources. Let's focus on the projectiles first.

What is a projectile? A projectile is something with a position, and fixed velocity that never changes trajectory. It is destroyed when colliding with the walls and asteroids. I could add an array to the player to keep track of the projectiles, but I think it would be better if the player is created with a function that it calls when it wants to release a projectile to the world, and not be concerned with it afterwards.

Now I have a player that can be moved around, its energy is constantly decreasing, and it can shoot projectiles, which are destroyed when they collide with the walls.

I will now create the asteroids. I didn't want to have them interact with each other, but now I think the game would be really lacking if they didn't. Also, just multiplying their velocities by minus one to reverse them wouldn't be appropriate, it would be better if they moved in a more realistic manner.

Now what? A simplified way to calculate what vector to add to the velocities of two colliding objects consists of these steps:

- Assume you have two objects that collide, a, and b with velocities v<sub>a</sub> and v<sub>b</sub>, and positions p<sub>a</sub> and p<sub>b</sub> respectively.
- First calculate p<sub>d</sub> = p<sub>b</sub> - p<sub>a</sub>, and then the normal of this resulting vector, c<sub>n</sub>.
- Then calculate the relative velocity with v<sub>r</sub> = v<sub>a</sub> - v<sub>b</sub>.
- Calculate the speed by taking the dot product of v<sub>n</sub> and v<sub>r</sub>.
- If the speed is less than zero, return.
- Calculate the impulse as twice the speed divided by the sum of the objects' masses.
- Add to a the result of scaling c<sub>n</sub> by the impulse times the negative of b's mass.
- Follow an analogous procedure with b, but with a's positive mass value.

I'm not going to pretend I understand this algorithm, but according to the recipe I found online it's supposed to work. Rather than making it an object's functionality I'll delegate it to an external function.

Now I'll implement collision detection between the asteroids and the projectiles, and then between asteroids and the player.

A collision between an asteroid and the player would end the game. What does this mean? Earlier we said that the game's states would be `start`, `playing`, `paused`, and `over`, but I think only `paused`, `playing`, and `over` would be enough. When the app loads, the state of the game is initially `paused`. A function `mount` is called which draws a message on the screen inviting the player to click the canvas to start the game. `mount` also calls a function `init` which initializes the player, and the arrays of entities. When the user clicks on the canvas the state of the game is set to `playing`, and the animation is started, which means calling the `anime` function. If the user then presses p, the game will be paused, which means that the id of the current frame will be used to cancel the animation, the state of the game is set to `paused`. If the user presses p again, or clicks on the canvas the game will be resumed, which means that the state of the game will be set to `playing`, and the `anime` function will be called. If the user runs out of energy, or collides with an asteroid the game will be over, and a game over message will be drawn on the screen, which invites the player to click on the canvas to play again. For this to happen the state of the game will be changed to `over`, the animation will be stopped, and function will be called to draw the message. Maybe we can get rid of the `over` state by calling `init` on game over.

Is it even possible to pause? Since the player can be controlled with the keyboard we need to find a way to tell it to ignore the keyboard when the game is paused. A pause variable should be enough.

Which functions do we need to create, and how will they control the state of the game? 

When the game loads we want to draw a message on the screen, create the player and initialize the arrays of entities. Also set the state of the game to `paused`. We can make a function for this, call it `mount`.

```javascript
function mount() {
  message("Click to start", "purple", "yellow");
  init();
}
```

where `message` draws a message on the middle of the canvas, and `init` initializes the player, the arrays, and the state variable.

Next the user is expected to click on the screen, or press p. In this case we need to functions; one for handling clicks on the screen, and another for handling key presses. 

Let's consider the first one first. Clicking on the screen starts the game or resumes it. The function has to check the state of the game. If the user clicks on the screen, and the state is not `paused`, then nothing will be happen. Otherwise we need to unpause the player, set the state to `playing`, and call `anime`.

For the second function, we only do something if the pressed key is p. If the state is `playing`, then we pause the player, change the state to `paused`, cancel the animation, and draw a semi transparent rectangle over the screen with a message indicating that the user can resume by clicking on the screen or pressing p again. If the state is `paused`, then we resume the player, change the state to `playing`, and call `anime`.

If the user runs out of energy, or collides with an asteroid, the game is over. The state of the game is changed to `paused`, the animation is cancelled, and everything is reset. The player killed and a new one is created with a paused value set to true.

The game kind of works now, I think there's a bug.

I'll stop here. The point of this exercice was to get familiar with vectors, not to build an entire game, so I'm way past the original goal.
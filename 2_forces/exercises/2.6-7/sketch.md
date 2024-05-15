How does tossing around work? I would like to do more than just setting the center of the circle to the mouse's coordinates when moving it.

When I intent to move the mouse, I press it down, a variable is changed that tracks this. The mouse is first at (a, b), one moment later it's at (c, d). I would like to pull the circle in this direction. Maybe draw a line between the mouse and the center of the circle to make it look like I'm pulling the circle with a rope. I have two coordinates, I can find the difference between them, and apply this as a force to the mover.

The player has a position, and that position is used as reference to draw the images that compose it, which in this case is the base and the barrel. The base is drawn so that the center of the player is at the center of the image. The barrel is above and to the right of the center of the player.
The base and the barrel will need a box to make it easy to tell if the player is hit by an enemy projectile.




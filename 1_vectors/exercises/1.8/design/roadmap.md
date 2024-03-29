- [Introduction](#introduction)
- [User's perspective](#users-perspective)
- [Overview](#overview)
- [Roadmap](#roadmap)
- [Log](#log)

# Introduction

The task consists of creating an object that it's affected by a force in an analogous way to how objects are affected by gravitational acceleration.

# User's perspective

There will be two types of entities in the simulation; movers, and attractors. Movers can move freely, and can be affected by external forces. Attractors remain in a fixed position, and attract the movers.

The movers can also interact with each other by bouncing off each other when colliding.

The user can mover the attractors by grabbing them and dragging them around.

The app has two modes; adding, and moving. When the app is in adding mode the user can add entities by clicking on the screen. There's a toggle to decide which type of entity to add, a mover or an attractor. When the app is in move mode the user can move the attractors around.

A checkbox is used to keep track of the current mode, and a set of two radio buttons is used to keep track of which entity is added on adding mode.

# Overview

I will need two variables to keep track of the UI state, `mode` which will be either `"moving"`, or `"adding"`, `entity`, which will be either `"mover"` or `"attractor"`.

The canvas will be set to occupy the entire screen, and the controls will be positioned absolutely on the screen.

The mover will be relatively simple, with just a position, and velocity. It will have a push function which will receive a vector and add it to its velocity.

The attractor object will have a position, attraction force, and a function that gets a mover and applies a force to it.

There will be a dedicated function that takes two movers, and checks if they collide. If they do, they will be made bounce off each other.

The movers will be confined to the screen boundaries.

# Roadmap

I'll first set up the loop. I've been having trouble with delta time lately, so I'd like to make sure I use it properly, so first I'll make the mover class, make it so that movers are created when the canvas is clicked, and make it so that the movers are attracter to the mouse. Once I make sure I'm using delta time correctly I'll then code the attractor, and code the logic for switching between adding movers and attractors.

Once I can add movers and attractors I'll add the code for making the movers bounce off each other.

Lastly I'll implement the functionality to reposition the attractors.

# Log

I'll set up the loop first.

I've confirmed that delta time can be used safely.

Currently the movers and attractors seem to be working properly, I'll now move to collisions.

The collisions have been handled.

How do I move an attractor? I need a variable to tell when I'm moving an attractor. One for indicating when a click on the screen is supposed to start a drag, and not add another entity. I can use a boolean, `isMoving` for the second case, and an object `currentTractor` for the second one. When a `mousedown` is detected, if it happens inside of an attractor, `currentTractor` will be set to that attractor. Then, on `mousemove` if `currentTractor` is not null, the position of the attractor referenced by `currentTractor` will be updated. On `mouseup` `currentTractor` will be set to null.
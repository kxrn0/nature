# Adaptive Draggable

I want to build a draggable component. It can be dragged around the screen from a handle. It is positioned fixed, so it can never exit the viewport. The component is mainly a container that contains children, the component takes care of being properly dragged around the screen. It's adaptive because when the size of the chidren change the component adapts to that. No part of the container may ever leave the viewport.

Should the component itself contain the handle, or should it search for one in the children? I'll do both.

When dragging, if there are any other draggables, the one currently being dragged will take on the highest z-index and overlap all others. The z-index hierarchy will persist even after the one being dragged is dropped, until a new one is dragged again.

![](./stone.jpg)

How do I deal with z-indices? I want the item that is currently being dragged to have the highest index. A naive way would be to loop through all draggables, find the one with the highest index, and set the index of the current one to that plus one;

```javascript
const draggables = Array.from(document.querySelectorAll(".draggable"));
const highest = draggables.reduce((highest, current) => {
  const index = Number(current.style.zIndex);

  if (index > highest) highest = index;

  return highest;
}, 0);

current.style.zIndex = highest + 1;
```

but then with each drag the highest index would keep increasing until it becomes higher than the index of something that should always be on top of everything else, like a modal. I could do something like set the index of the one currently being dragged to one, and to zero the one of every other draggable, but then if I'm using the draggable component in a game or something, and the user put an item A above another one B that comes before A in the DOM tree, resetting their indices would put A behind B, which would disrupt the user's workflow, or juts make it impossible. I think setting the z-index of a positioned element creates a new static context or whatever, so I think I could somehow use this so that no matter how high the z-indices of the draggables become, they'll never collide with those of other elements like modals. I think I should simply not care, and go with the naive solution since nothing about this has anything to do with physic libraries.

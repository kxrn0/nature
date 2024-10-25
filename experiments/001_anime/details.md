# Animation

Animating things in javaScript is straightforward with `requestAnimationFrame`. The basic layout for it is as follows

```javascript
function anime() {
  //draw the current animation frame

  requestAnimationFrame(anime);
}

function init() {
  //initialize stuff here

  anime();
}

init();
```

A working example can be seen in [here](./basic.html).

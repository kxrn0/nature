# Oscillating a value between a minimum and a maximum

Title. For example, assume I want an animation of a pulsating circle on the screen where the radius of the circle oscillates between a minimum of 50, and a maximum of 100. I can use the sine or cosine for that.

```javascript
function compute(min, max, t) {
  const range = max - min;

  return Math.abs(Math.sin(t)) * range + min;
}
```

The function above is the most straighforward way to do it, but since we are taking the absolute value of the sine, the function feels slower as we approach the maximum, and faster on the minimum. A better way to do it is by not taking the absolute value of the sine, then everything would feel balanced. A straightforward way of doing that would be to map the result of sine to [min, max] with a helper function

```javascript
function map(value, minFrom, maxFrom, minTo, maxTo) {
  return minTo + ((maxTo - minTo) * (value - minFrom)) / (maxFrom - minFrom);
}

function compute(min, max, t) {
  return map(Math.sin(t), -1, 1, min, max);
}
```

`map` is a common utility we'll often use elsewhere, so I don't see the need to decouple `compute` from it.

The current solution works, but it still feels incomplete. The larger the value of `t`, the faster the function will be
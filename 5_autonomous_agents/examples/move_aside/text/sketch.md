# Move Aside

I want to build an app where the user can add circles to the screen by clicking on the canvas. When the user clicks on the canvas a circle is added. I want to make it so that the circles won't intersect. For this demo the user can only do two things; add circles to the canvas, and drag them around. We'll first focus on what to do when adding them.

## Addition
Assume there's only one circle in the canvas. To prevent overlap, if the user clicks close enogh to the circle already in the canvas, call it A, we first find a vector from A's center to the point the user clicks on, call it P. We then find how much the circles would overlap by substracting the length of this vector from the sum of their radii. We set the magnitude of the previously calculated vector to the overlap value, and finally we add the resulting vector to P.

This works fine if there's only one circle in the canvas already, but if there are more the shifting of P may land it in such a location that it may overlap with another circle as shown below.
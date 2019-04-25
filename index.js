/**
 * Draw a rectange
 * @param {number} width - the width of the rectangle
 * @param {number} height - the height of the rectangle
 * @param {number} x - the x coordinate of the rectangle
 * @param {number} y - the y coordinate of the rectangle
 * @param {HTMLElement} container - the svg container on which to draw the rectangle
 * @returns the newly drawn rectangle
 */
function drawRectangle( width, height, x, y, container ) {
    var rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectangle.setAttribute( "x", x );
    rectangle.setAttribute( "y", y );
    rectangle.setAttribute( "width", width );
    rectangle.setAttribute( "height", height );
    container.appendChild( rectangle );
    return rectangle;
}

/**
 * Draw a line
 * @param {number} x1 - the x coordinate of the start of the line
 * @param {number} y1 - the y coordinate of the start of the line
 * @param {number} x2 - the x coordinate of the end of the line
 * @param {number} y2 - the y coordinate of the end of the line
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns the newly drawn line
 */
function drawLine( x1, y1, x2, y2, container ) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute( "x1", x1 );
    line.setAttribute( "y1", y1 );
    line.setAttribute( "x2", x2 );
    line.setAttribute( "y2", y2 );
    container.appendChild( line );
    return line;
}

/**
 * Draw a circle
 * @param {number} x - the x coordinate of the center of the circle
 * @param {number} y - the y coordinate of the center of the circle
 * @param {*} r - the radius of the circle
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns the newly drawn circle
 */
function drawCircle( x, y, r, container ) {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute( "cx", x );
    circle.setAttribute( "cy", y );
    circle.setAttribute( "r", r );
    container.appendChild( circle );
    return circle;
}

/**
 * Draw a straight path
 * @param {Array<Array<number>>} coordinates - An array of coordinate pairs for the path
 * @param {HTMLElement} container - the svg container on which to draw
 * @param {boolean} connectAtEnd - whether to connect the lines at the end
 * @returns the newly drawn path
 */
function drawPath( coordinates, container, connectAtEnd ) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    if( coordinates.length > 0 ) {
        d.push("M " + coordinates[0][0] + " " + coordinates[0][1]);
    }
    for( var i=1; i<coordinates.length; i++ ) {
        d.push("L " + coordinates[i][0] + " " + coordinates[i][1]);
    }
    if( connectAtEnd ) {
        d.push("Z");
    }
    path.setAttribute("d", d);
    container.appendChild( path );
    return path;
}

/**
 * Draw a building
 * @param {number} width - the width of the building
 * @param {number} height - the height of the building
 * @param {number} x - the x coordinate of the left side of the building 
 * @param {number} y - the y coordinate of the top of the building
 * @param {number} houseNumber - the number of the house to write on the door
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns the house number of the new building and the roof height and width
 */
function drawBuilding( width, height, x, y, container, houseNumber ) {
    var rectangle = drawRectangle( width, height, x, y, container );
    rectangle.classList.add( "building" );
    rectangle.style.fill = getRandomColor();

    var brickHouse = Math.floor(Math.random() * 2);
    var brickWidth = brickHouse ? 20 : 100;
    var brickHeight = brickHouse ? 10 : 30;
    var windowWidth = 30 + Math.floor(Math.random() * 10) - 5;
    var windowHeight = 40 + Math.floor(Math.random() * 10) - 5;
    var windowSpacingHorizontal = 40 + Math.floor(Math.random() * 10) - 5;
    var windowSpacingVertical = 40 + Math.floor(Math.random() * 10) - 5;
    // Offer some padding restrictions for windows, just use width and height for no padding
    var windowsAreaWidth = width - 20;
    var windowsAreaHeight = height - 20;
    // Center the windows
    var xWindowOffset = (windowsAreaWidth - /*Get the num of windows*/(Math.round(windowsAreaWidth/(windowWidth+windowSpacingHorizontal)) * /*Multiply it by width each one will take up*/(windowWidth+windowSpacingHorizontal) - /*Don't need the last spacing*/windowSpacingHorizontal))/2;
    var yWindowOffset = (windowsAreaHeight - /*Get the num of windows*/(Math.round(windowsAreaHeight/(windowHeight+windowSpacingVertical)) * /*Multiply it by width each one will take up*/(windowHeight+windowSpacingVertical) - /*Don't need the last spacing*/windowSpacingVertical))/2;
    var roofOut = 20 + Math.floor(Math.random() * 10) - 5;
    var roofHeight = 40 + Math.floor(Math.random() * 40) - 20;
    var doorWidth = 50 + Math.floor(Math.random() * 10) - 5;
    var doorHeight = 60 + Math.floor(Math.random() * 10) - 5;
    var doorHandleRadius = 3;
    var doorX = x+width/2 - doorWidth/2;
    var doorY = y+height - doorHeight;

    var roof = drawPath( [ [x,y], [x-roofOut, y], [x, y-roofHeight], [x+width, y-roofHeight], [x+width+roofOut, y], [x+width, y] ], container);
    roof.classList.add("roof");
    roof.style.fill = getRandomColor();

    drawBricks( width, height, x, y, container, brickWidth, brickHeight );
    drawWindows( windowsAreaWidth-xWindowOffset, windowsAreaHeight-yWindowOffset, x+xWindowOffset+(width-windowsAreaWidth)/2, y+yWindowOffset+(height-windowsAreaHeight)/2, container, windowWidth, windowHeight, windowSpacingHorizontal, windowSpacingVertical, doorX, doorY, doorWidth, doorHeight);
    var door = drawDoor( doorWidth, doorHeight, doorX, doorY, container, doorHandleRadius, houseNumber );

    return { roofHeight: roofHeight, roofWidth: width + roofOut*2, roofOut: roofOut, door: { x1: doorX, y1: doorY, x2: doorX+doorWidth, y2: doorY+doorHeight, shape: door } };
}

/**
 * Get a random color
 * Soure: https://stackoverflow.com/questions/1484506/random-color-generator
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 15)];
    }
    // Keep generating random colors until we get one light (unlike background color)
    if( isLightColor(color) ) {
        return getRandomColor();
    }
    return color;
}

/**
 * Make sure a color has a lightness over 0.85, (background [006633] = 0.4166666666666667)
 * Idea from here: https://stackoverflow.com/questions/13586999/color-difference-similarity-between-two-values-with-js
 * @param {string} hex1 - hexadecimal of the color
 */
function isLightColor(hex1) {
    var rgb1 = hexToRgb(hex1);
    var hsv1 = rgbToHsv(rgb1.r, rgb1.g, rgb1.b);
    if( hsv1[2] < 0.85 && hsv1[1] < 50 && hsv1[0] < 50 ) return true; // We only want light colors
    return false;
}

/**
* Taken from here: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
* Converts an RGB color value to HSV. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSV_color_space.
* Assumes r, g, and b are contained in the set [0, 255] and
* returns h, s, and v in the set [0, 1].
*
* @param   Number  r       The red color value
* @param   Number  g       The green color value
* @param   Number  b       The blue color value
* @return  Array           The HSV representation
*/
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

/**
 * Hex to rgb
 * Taken from here: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/5624139
 * @param {string} hex - hexidecimal of the color
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Generate a house number not currently taken up by any other houses
 * @returns - the house number
 */
function generateHouseNumber() {
    find:
    while(true) {
        var houseNumber = Math.floor(Math.random() * 100) + 1;
        for( var i=0; i<objects.length; i++ ) {
            if( objects[i].houseNumber == houseNumber ) {
                continue find;
            }
        }
        return houseNumber;
    }
}

/**
 * Draw a door
 * @param {number} width - the width of the door
 * @param {number} height - the height of the door
 * @param {number} x - the x coordinate of the left side of the building 
 * @param {number} y - the y coordinate of the top of the building
 * @param {HTMLElement} container - the svg container on which to draw
 * @param {number} doorHandleRadius - the radius of the door handle
 * @param {number} houseNumber - the number of the house to put on the door
 * @returns an svg containing the door element
 */
function drawDoor( width, height, x, y, container, doorHandleRadius, houseNumber ) {
    var doorGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    doorGroup.classList.add("door-group");
    doorGroup.style.transform = "translate(" + x + "px," + y + "px)";

    var doorInside = drawRectangle( width, height, x, y, container );
    doorInside.classList.add("door-inside"); 

    x = 0;
    y = 0;
    var rectangle = drawRectangle( width, height, x, y, doorGroup );
    rectangle.classList.add("door"); 
    rectangle.style.fill = getRandomColor();
    drawCircle( x+width-width/9, y+height/2, doorHandleRadius, doorGroup );
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.classList.add("door-text");
    text.setAttribute("x", x+width/2);
    text.setAttribute("y", y+height/2 - 8);
    text.innerHTML = houseNumber;

    container.appendChild(doorGroup);
    doorGroup.appendChild(text);

    var textWidth = text.getBBox().width;
    text.setAttribute("x", x+width/2 - textWidth/2);

    return doorGroup;
}

/**
 * Open a door
 * @param {HTMLElement} doorGroup - the group element containing a door
 */
function openDoor(doorGroup) {
    // at scaleX = 0, the skew would be 90deg, at 1, 0 deg
    doorGroup.style.transform += "scaleX(0.8)skew(0, 18deg)"; 
}

/**
 * Close a door
 * @param {HTMLElement} doorGroup - the group element containing a door
 */
function closeDoor(doorGroup) {
    doorGroup.style.transform = doorGroup.style.transform.replace(/scaleX.*/,"");
}

// Draw a recntangle below the house
function drawMat(door, container) {
   var matHeight = 10;
   var mat = document.querySelector(".mat");
   if( mat ) {
       mat.parentElement.removeChild(mat);
   }
   mat = drawRectangle( door.x2 - door.x1, matHeight, door.x1, door.y2, container );
   mat.classList.add("mat");
}

/**
 * Test for a collision between two boxes
 * @param {object} obj1 - an object with x1, y1, x2, and y2 values 
 * @param {object} obj2  - an object with x1, y1, x2, and y2 values 
 * An object looks like the following
 * (x1,y1)-------(x2,y1)
 *    |             |
 *    |             |
 *    |             |
 *    |             |
 *    |             |
 * (x1,y2)-------(x2,y2)
 */
function collisionTest( obj1, obj2 ) {
    if( obj1.x1 < obj2.x2 && obj1.x2 > obj2.x1 && obj1.y1 < obj2.y2 && obj1.y2 > obj2.y1 ) {
        return true;
    }
    return false;
}

/**
 * Draw windows on a building
 * @param {number} width - the width of the window area (note: this is not the building width)
 * @param {number} height - the height of the window area (note: this is not the building height)
 * @param {number} x - the x coordinate of the left side of first column of windows
 * @param {number} y - the y coordinate of the top of the first row of windows
 * @param {HTMLElement} container - the svg container on which to draw
 * @param {number} windowWidth - the width to make each window
 * @param {number} windowHeight - the height to make each window
 * @param {number} windowSpacingHorizontal - the horizontal spacing between each window
 * @param {number} windowSpacingVertical - the vertical spacing between each window
 * @param {number} doorX - the x coordinate of the door (needed to make sure no window overlaps with the door)
 * @param {number} doorY - the y coordinate of the door
 * @param {number} doorWidth - the width of the door
 * @param {number} doorHeight - the height of the door
 */
function drawWindows( width, height, x, y, container, windowWidth, windowHeight, windowSpacingHorizontal, windowSpacingVertical, doorX, doorY, doorWidth, doorHeight) {
    var yPos = y;
    while( yPos < y + height - windowHeight ) {
        var xPos = x;
        while( xPos < x + width - windowWidth ) {
            // If the left side of the window is to the left of right side of the door
            // and the right side of the window is to the right of the left side of the door
            // and the top of the window is above the bottom of the door
            // and the bottom of the window is below the top of the door
            // we have an overlap, and we shouldn't draw a window
            if( !collisionTest( { x1: xPos, y1: yPos, x2: xPos+windowWidth, y2: yPos+windowHeight }, { x1: doorX, y1: doorY, x2: doorX+doorWidth, y2: doorY+doorHeight} ) ) {
                var window = drawRectangle( windowWidth+10, windowHeight+10, xPos-5, yPos-5, container );
                window.classList.add( "window" );
                window = drawRectangle( windowWidth, windowHeight, xPos, yPos, container );
                window.classList.add( "window" );

                var line = drawLine( xPos, yPos + windowHeight/2, xPos+windowWidth, yPos + windowHeight/2, container );
                line.classList.add("window-pane");
                line = drawLine( xPos + windowWidth/2, yPos, xPos+windowWidth/2, yPos+windowHeight, container );
                line.classList.add("window-pane");
            }

            xPos += windowSpacingHorizontal + windowWidth;
        }
        yPos += windowSpacingVertical + windowHeight;
    }
}

/**
 * Draw bricks on a building
 * @param {number} width - the width of the building
 * @param {number} height - the height of the building
 * @param {number} x - the x coordinate of the left side of the building
 * @param {number} y - the y coordinate of the top of the building
 * @param {HTMLElement} container - the svg container on which to draw
 * @param {number} brickWidth - the width of the bricks
 * @param {number} brickHeight - the height of the bricks
 */
function drawBricks( width, height, x, y, container, brickWidth, brickHeight ) {
    var yPos = y;
    var count = 0;
    while( yPos < y + height ) {
        var xPos = x - ( (brickWidth/2) * (count%2) );
        while( xPos < x + width ) {

            var curBrickWidth = xPos + brickWidth < x + width ? xPos < x ? brickWidth - (x - xPos) : brickWidth : (x + width) - xPos;
            var curBrickHeight = yPos + brickHeight < y + height ? brickHeight : (y + height) - yPos;
            var curXPos = Math.max(x,xPos);
            if( curBrickHeight > 3 && curBrickWidth > 3 ) {
                var brick = drawRectangle( curBrickWidth, curBrickHeight, curXPos, yPos, container );
                brick.classList.add( "brick" );
            }

            xPos += brickWidth;
        }
        yPos += brickHeight;
        count ++;
    }
}

/**
 * Draw the dog (still)
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDog(x, y, container) {

    var legOffsets = [8, 46];
    for(var i=0; i<legOffsets.length; i++) {
        var legOffset = legOffsets[i];
        drawDogLeg(x, y, legOffset, container);
    }

    drawDogBody(container);

    var legOffsets = [0, 54];
    for(var i=0; i<legOffsets.length; i++) {
        var legOffset = legOffsets[i];
        drawDogLeg(x, y, legOffset, container);
    }
}

/**
 * Draw the 1st frame of the running dog
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFrame1(x, y, container) {

    var rotationYModifier = -3;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+6;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+40) + "," + (31+legOffset) + " " + (y+50) + "," + (32+legOffset) + " " + (y+54));
    d.push("C " + (32+legOffset) + " " + (y+54) + "," + (22+legOffset) + " " + (y+62) + "," + (34+legOffset) + " " + (y+60));
    d.push("C " + (34+legOffset) + " " + (y+60) + "," + (35+legOffset) + " " + (y+60) + "," + (38+legOffset) + " " + (y+55));
    d.push("C " + (36+legOffset) + " " + (y+45) + "," + (31+legOffset) + " " + (y+45) + "," + (31+legOffset) + " " + (y+28));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+45;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+38) + "," + (25+legOffset) + " " + (y+44));
    d.push("C " + (25+legOffset) + " " + (y+44) + "," + (22+legOffset) + " " + (y+48) + "," + (20+legOffset) + " " + (y+50));
    d.push("C " + (20+legOffset) + " " + (y+50) + "," + (18+legOffset) + " " + (y+52) + "," + (22+legOffset) + " " + (y+54));
    d.push("C " + (22+legOffset) + " " + (y+56) + "," + (32+legOffset) + " " + (y+56) + "," + (26+legOffset) + " " + (y+50));
    d.push("C " + (27+legOffset) + " " + (y+48) + "," + (39+legOffset) + " " + (y+40) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    var body = drawDogBody(container);
    body.style.transform = "rotate(-6deg)";

    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x;
    d.push("M " + (19+legOffset) + " " + (y+27));
    d.push("C " + (19+legOffset) + " " + (y+40) + "," + (31+legOffset) + " " + (y+52) + "," + (32+legOffset) + " " + (y+54));
    d.push("C " + (32+legOffset) + " " + (y+54) + "," + (36+legOffset) + " " + (y+57) + "," + (40+legOffset) + " " + (y+55));
    d.push("C " + (41+legOffset) + " " + (y+53) + "," + (41+legOffset) + " " + (y+50.5) + "," + (36+legOffset) + " " + (y+50));
    d.push("C " + (36+legOffset) + " " + (y+50) + "," + (31+legOffset) + " " + (y+45) + "," + (29+legOffset) + " " + (y+28));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x + 52;
    d.push("M " + (15+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+38) + "," + (25+legOffset) + " " + (y+44));
    d.push("C " + (27+legOffset) + " " + (y+46) + "," + (22+legOffset) + " " + (y+53) + "," + (25+legOffset) + " " + (y+55));
    d.push("C " + (25+legOffset) + " " + (y+55) + "," + (25+legOffset) + " " + (y+55) + "," + (27+legOffset) + " " + (y+57));
    d.push("C " + (27+legOffset) + " " + (y+57) + "," + (33+legOffset) + " " + (y+57) + "," + (29+legOffset) + " " + (y+51));
    d.push("C " + (29+legOffset) + " " + (y+51) + "," + (34+legOffset) + " " + (y+40) + "," + (27+legOffset) + " " + (y+37));
    d.push("C " + (27+legOffset) + " " + (y+35.9) + "," + (25+legOffset) + " " + (y+40) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;
}

/**
 * Draw the 2nd frame of the running dog
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFrame2(x, y, container) {

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2.5;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (27+legOffset) + " " + (y+34) + "," + (22+legOffset) + " " + (y+44) + "," + (38+legOffset) + " " + (y+55));
    d.push("C " + (42+legOffset) + " " + (y+55) + "," + (42+legOffset) + " " + (y+50) + "," + (38+legOffset) + " " + (y+48));
    d.push("C " + (35+legOffset) + " " + (y+48) + "," + (28+legOffset) + " " + (y+32) + "," + (28+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+52;
    d.push("M " + (18+legOffset) + " " + (y+27));
    d.push("C " + (7+legOffset) + " " + (y+34) + "," + (9+legOffset) + " " + (y+44) + "," + (legOffset) + " " + (y+50));
    d.push("C " + (legOffset) + " " + (y+50) + "," + (-8+legOffset) + " " + (y+56) + "," + (legOffset) + " " + (y+56));
    d.push("C " + (legOffset) + " " + (y+58) + "," + (legOffset+27) + " " + (y+32) + "," + (22+legOffset) + " " + (y+24));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    drawDogBody(container);
    
    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (17+legOffset) + " " + (y+38) + "," + (22+legOffset) + " " + (y+44));
    d.push("C " + (23+legOffset) + " " + (y+44) + "," + (19+legOffset) + " " + (y+53) + "," + (22+legOffset) + " " + (y+55));
    d.push("C " + (22+legOffset) + " " + (y+55) + "," + (22+legOffset) + " " + (y+56) + "," + (27+legOffset) + " " + (y+56));
    d.push("C " + (27+legOffset) + " " + (y+56) + "," + (32+legOffset) + " " + (y+53) + "," + (26+legOffset) + " " + (y+51));
    d.push("C " + (26+legOffset) + " " + (y+51) + "," + (29+legOffset) + " " + (y+40) + "," + (28+legOffset) + " " + (y+37));
    d.push("C " + (27+legOffset) + " " + (y+37) + "," + (27+legOffset) + " " + (y+32) + "," + (28+legOffset) + " " + (y+28));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x + 52;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+38) + "," + (17+legOffset) + " " + (y+44));
    d.push("C " + (17+legOffset) + " " + (y+44) + "," + (7+legOffset) + " " + (y+46) + "," + (7+legOffset) + " " + (y+46));
    d.push("C " + (legOffset) + " " + (y+46) + "," + (legOffset) + " " + (y+50) + "," + (7+legOffset) + " " + (y+51));
    d.push("C " + (7+legOffset) + " " + (y+51) + "," + (17+legOffset) + " " + (y+50) + "," + (27+legOffset) + " " + (y+46));
    d.push("C " + (28+legOffset) + " " + (y+45) + "," + (26+legOffset) + " " + (y+44) + "," + (25+legOffset) + " " + (y+43));
    d.push("C " + (23+legOffset) + " " + (y+37) + "," + (29+legOffset) + " " + (y+40) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");
}

/**
 * Draw the 3rd frame of the running dog
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFrame3(x, y, container) {

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2.5;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (27+legOffset) + " " + (y+34) + "," + (20+legOffset) + " " + (y+52) + "," + (30+legOffset) + " " + (y+53));
    d.push("C " + (36+legOffset) + " " + (y+52) + "," + (33+legOffset) + " " + (y+48) + "," + (30+legOffset) + " " + (y+48));
    d.push("C " + (29+legOffset) + " " + (y+48) + "," + (26+legOffset) + " " + (y+32) + "," + (35+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+52;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (7+legOffset) + " " + (y+34) + "," + (9+legOffset) + " " + (y+44) + "," + (8+legOffset) + " " + (y+55));
    d.push("C " + (2+legOffset) + " " + (y+56) + "," + (2+legOffset) + " " + (y+62) + "," + (12+legOffset) + " " + (y+60));
    d.push("C " + (13+legOffset) + " " + (y+58) + "," + (legOffset+19) + " " + (y+32) + "," + (22+legOffset) + " " + (y+24));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    drawDogBody(container);
    
    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+4;
    d.push("M " + (17+legOffset) + " " + (y+25));
    d.push("C " + (15+legOffset) + " " + (y+32) + "," + (13+legOffset) + " " + (y+32) + "," + (17+legOffset) + " " + (y+40));
    d.push("C " + (17+legOffset) + " " + (y+44) + "," + (12+legOffset) + " " + (y+44) + "," + (10+legOffset) + " " + (y+46));
    d.push("C " + (8+legOffset) + " " + (y+48) + "," + (10+legOffset) + " " + (y+52) + "," + (10+legOffset) + " " + (y+52.5));
    d.push("C " + (11+legOffset) + " " + (y+54) + "," + (14+legOffset) + " " + (y+54) + "," + (15+legOffset) + " " + (y+49));
    d.push("C " + (15+legOffset) + " " + (y+49) + "," + (19+legOffset) + " " + (y+48) + "," + (24+legOffset) + " " + (y+42));
    d.push("C " + (25+legOffset) + " " + (y+42) + "," + (23+legOffset) + " " + (y+32) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x + 52;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+38) + "," + (17+legOffset) + " " + (y+44));
    d.push("C " + (17+legOffset) + " " + (y+45) + "," + (20+legOffset) + " " + (y+46) + "," + (17+legOffset) + " " + (y+47.5));
    d.push("C " + (15+legOffset) + " " + (y+49) + "," + (4+legOffset) + " " + (y+54) + "," + (8+legOffset) + " " + (y+58));
    d.push("C " + (8+legOffset) + " " + (y+58) + "," + (18+legOffset) + " " + (y+56) + "," + (26.5+legOffset) + " " + (y+46));
    d.push("C " + (26.5+legOffset) + " " + (y+46) + "," + (28+legOffset) + " " + (y+45) + "," + (26+legOffset) + " " + (y+43.5));
    d.push("C " + (23+legOffset) + " " + (y+37) + "," + (29+legOffset) + " " + (y+40) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");
}

/**
 * Draw the 4th frame of the running dog
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFrame4(x, y, container) {

    var rotationYModifier = -2.5;
    y = y + rotationYModifier;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+10;
    d.push("M " + (19+legOffset) + " " + (y+25));
    d.push("C " + (15+legOffset) + " " + (y+30) + "," + (11+legOffset) + " " + (y+32) + "," + (17+legOffset) + " " + (y+40));
    d.push("C " + (18+legOffset) + " " + (y+42) + "," + (12+legOffset) + " " + (y+43) + "," + (8+legOffset) + " " + (y+45));
    d.push("C " + (6+legOffset) + " " + (y+47) + "," + (6+legOffset) + " " + (y+50) + "," + (9+legOffset) + " " + (y+53));
    d.push("C " + (10+legOffset) + " " + (y+53) + "," + (13+legOffset) + " " + (y+54) + "," + (12.5+legOffset) + " " + (y+49));
    d.push("C " + (13+legOffset) + " " + (y+48) + "," + (20+legOffset) + " " + (y+46) + "," + (22+legOffset) + " " + (y+43));
    d.push("C " + (24+legOffset) + " " + (y+40) + "," + (23+legOffset) + " " + (y+32) + "," + (24+legOffset) + " " + (y+29));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;
    
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+57.5;//x+59;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (7+legOffset) + " " + (y+34) + "," + (10+legOffset) + " " + (y+38) + "," + (17+legOffset) + " " + (y+43));
    d.push("C " + (19+legOffset) + " " + (y+44) + "," + (26+legOffset) + " " + (y+55) + "," + (21+legOffset) + " " + (y+55.5));
    d.push("C " + (14+legOffset) + " " + (y+55.5) + "," + (19+legOffset) + " " + (y+61) + "," + (23+legOffset) + " " + (y+60));
    d.push("C " + (27+legOffset) + " " + (y+60) + "," + (30+legOffset) + " " + (y+58) + "," + (26+legOffset) + " " + (y+43));
    d.push("C " + (21+legOffset) + " " + (y+37) + "," + (23+legOffset) + " " + (y+30) + "," + (20+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    var body = drawDogBody(container);
    body.style.transform = "rotate(5deg)";
    
    y = y + rotationYModifier;

    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2;
    d.push("M " + (19+legOffset) + " " + (y+25));
    d.push("C " + (15+legOffset) + " " + (y+30) + "," + (13.5+legOffset) + " " + (y+32) + "," + (17+legOffset) + " " + (y+40));
    d.push("C " + (19+legOffset) + " " + (y+42) + "," + (12+legOffset) + " " + (y+42) + "," + (6+legOffset) + " " + (y+43));
    d.push("C " + (4+legOffset) + " " + (y+44) + "," + (2+legOffset) + " " + (y+50) + "," + (4+legOffset) + " " + (y+51));
    d.push("C " + (4+legOffset) + " " + (y+51) + "," + (8+legOffset) + " " + (y+54) + "," + (9+legOffset) + " " + (y+48));
    d.push("C " + (15+legOffset) + " " + (y+46) + "," + (19+legOffset) + " " + (y+48) + "," + (24.5+legOffset) + " " + (y+42));
    d.push("C " + (28+legOffset) + " " + (y+40) + "," + (23+legOffset) + " " + (y+32) + "," + (28+legOffset) + " " + (y+29));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+50.5;//x + 52;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+38) + "," + (17+legOffset) + " " + (y+44));
    d.push("C " + (17+legOffset) + " " + (y+44) + "," + (20+legOffset) + " " + (y+46) + "," + (17+legOffset) + " " + (y+49));
    d.push("C " + (17+legOffset) + " " + (y+49) + "," + (13+legOffset) + " " + (y+55) + "," + (8+legOffset) + " " + (y+55));
    d.push("C " + (5+legOffset) + " " + (y+55) + "," + (2+legOffset) + " " + (y+60) + "," + (8+legOffset) + " " + (y+60));
    d.push("C " + (9+legOffset) + " " + (y+62) + "," + (32+legOffset) + " " + (y+49) + "," + (25+legOffset) + " " + (y+44));
    d.push("C " + (23+legOffset) + " " + (y+37) + "," + (29+legOffset) + " " + (y+40) + "," + (27.5+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");
}

/**
 * Draw the 5th frame of the running dog
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFrame5(x, y, container) {

    var rotationYModifier = -2.5;
    y = y + rotationYModifier;

    // This leg is somewhat fake
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+5;
    d.push("M " + (19+legOffset) + " " + (y+28));
    d.push("C " + (19+legOffset) + " " + (y+28) + "," + (-5+legOffset) + " " + (y+31) + "," + (-2+legOffset) + " " + (y+38));
    d.push("C " + (-2+legOffset) + " " + (y+38) + "," + (legOffset) + " " + (y+40) + "," + (19+legOffset) + " " + (y+31));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+57.5;//x+59;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (7+legOffset) + " " + (y+34) + "," + (10+legOffset) + " " + (y+38) + "," + (17+legOffset) + " " + (y+43));
    d.push("C " + (19+legOffset) + " " + (y+44) + "," + (21+legOffset) + " " + (y+55) + "," + (23+legOffset) + " " + (y+55));
    d.push("C " + (25+legOffset) + " " + (y+56) + "," + (27+legOffset) + " " + (y+56) + "," + (28.5+legOffset) + " " + (y+55));
    d.push("C " + (31+legOffset) + " " + (y+54) + "," + (28.5+legOffset) + " " + (y+50) + "," + (26+legOffset) + " " + (y+50.5));
    d.push("C " + (25+legOffset) + " " + (y+50.5) + "," + (25+legOffset) + " " + (y+43) + "," + (23+legOffset) + " " + (y+41));
    d.push("C " + (23+legOffset) + " " + (y+41) + "," + (20+legOffset) + " " + (y+38) + "," + (20+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    var body = drawDogBody(container);
    body.style.transform = "rotate(5deg)";

    y = y + rotationYModifier;
    
    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2;
    d.push("M " + (19+legOffset) + " " + (y+22));
    d.push("C " + (14+legOffset) + " " + (y+28) + "," + (21+legOffset) + " " + (y+37) + "," + (legOffset) + " " + (y+38));
    d.push("C " + (-1+legOffset) + " " + (y+34.5) + "," + (-5+legOffset) + " " + (y+32.5) + "," + (-5+legOffset) + " " + (y+39));
    d.push("C " + (-4.5+legOffset) + " " + (y+39) + "," + (-6+legOffset) + " " + (y+42) + "," + (legOffset) + " " + (y+43.5));
    d.push("C " + (31+legOffset) + " " + (y+40) + "," + (26+legOffset) + " " + (y+33) + "," + (29+legOffset) + " " + (y+26));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+50.5;//x + 52;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+38) + "," + (17+legOffset) + " " + (y+44));
    d.push("C " + (17+legOffset) + " " + (y+44) + "," + (18+legOffset) + " " + (y+46) + "," + (18+legOffset) + " " + (y+47));
    d.push("C " + (19+legOffset) + " " + (y+50) + "," + (21+legOffset) + " " + (y+53) + "," + (19.5+legOffset) + " " + (y+55));
    d.push("C " + (19.5+legOffset) + " " + (y+55) + "," + (11+legOffset) + " " + (y+56) + "," + (18+legOffset) + " " + (y+60));
    d.push("C " + (28+legOffset) + " " + (y+61) + "," + (24+legOffset) + " " + (y+46) + "," + (24+legOffset) + " " + (y+44));
    d.push("C " + (23+legOffset) + " " + (y+37) + "," + (29+legOffset) + " " + (y+40) + "," + (27.5+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");
}

/**
 * Draw the 6th frame of the running dog
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFrame6(x, y, container) {

    var rotationYModifier = -1.25;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2.5;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (27+legOffset) + " " + (y+24) + "," + (20+legOffset) + " " + (y+22) + "," + (legOffset-1) + " " + (y+40.1));
    d.push("C " + (-3+legOffset) + " " + (y+40) + "," + (-5+legOffset) + " " + (y+38) + "," + (legOffset-6) + " " + (y+42));
    d.push("C " + (-3+legOffset) + " " + (y+49) + "," + (2+legOffset) + " " + (y+46) + "," + (legOffset+9.5) + " " + (y+39));
    d.push("C " + (12+legOffset) + " " + (y+36) + "," + (42+legOffset) + " " + (y+30) + "," + (42+legOffset) + " " + (y+30));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+52;
    d.push("M " + (20+legOffset) + " " + (y+27));
    d.push("C " + (legOffset) + " " + (y+30) + "," + (35+legOffset) + " " + (y+25) + "," + (39.5+legOffset) + " " + (y+37));
    d.push("C " + (46+legOffset) + " " + (y+37) + "," + (44+legOffset) + " " + (y+41) + "," + (44+legOffset) + " " + (y+42));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    var body = drawDogBody(container);
    body.style.transform = "rotate(-2.5deg)";
    
    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x;
    d.push("M " + (17+legOffset) + " " + (y+26));
    d.push("C " + (17+legOffset) + " " + (y+38) + "," + (30+legOffset) + " " + (y+39) + "," + (17+legOffset) + " " + (y+55));
    d.push("C " + (12+legOffset) + " " + (y+56) + "," + (12+legOffset) + " " + (y+60) + "," + (17+legOffset) + " " + (y+60));
    d.push("C " + (26+legOffset) + " " + (y+59) + "," + (27.5+legOffset) + " " + (y+46) + "," + (30+legOffset) + " " + (y+40));
    d.push("C " + (31+legOffset) + " " + (y+39) + "," + (27+legOffset) + " " + (y+30) + "," + (29+legOffset) + " " + (y+27))
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x + 52;
    d.push("M " + (17+legOffset) + " " + (y+29));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (12+legOffset) + " " + (y+38) + "," + (28+legOffset) + " " + (y+40));
    d.push("C " + (39+legOffset) + " " + (y+42) + "," + (38+legOffset) + " " + (y+49) + "," + (42+legOffset) + " " + (y+47));
    d.push("C " + (49+legOffset) + " " + (y+44) + "," + (48+legOffset) + " " + (y+40) + "," + (41+legOffset) + " " + (y+41));
    d.push("C " + (23+legOffset) + " " + (y+30) + "," + (29+legOffset) + " " + (y+25) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;
}

/**
 * Draw the 7th frame of the running dog
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFrame7(x, y, container) {

    var rotationYModifier = -4.25;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2.5;
    d.push("M " + (17+legOffset) + " " + (y));
    d.push("C " + (22+legOffset) + " " + (y) + "," + (19+legOffset) + " " + (y+33.5) + "," + (legOffset+3) + " " + (y+44.3));
    d.push("C " + (1+legOffset) + " " + (y+43.5) + "," + (-5+legOffset) + " " + (y+44) + "," + (legOffset) + " " + (y+49));
    d.push("C " + (legOffset) + " " + (y+49) + "," + (5.5+legOffset) + " " + (y+53) + "," + (legOffset+14) + " " + (y+41));
    d.push("C " + (15+legOffset) + " " + (y+39) + "," + (35+legOffset) + " " + (y+30) + "," + (35+legOffset) + " " + (y+30));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+48.5;
    d.push("M " + (14+legOffset) + " " + (y+24));
    d.push("C " + (17+legOffset) + " " + (y+29) + "," + (8+legOffset) + " " + (y+43) + "," + (25+legOffset) + " " + (y+40));
    d.push("C " + (27+legOffset) + " " + (y+43) + "," + (22+legOffset) + " " + (y+50) + "," + (25+legOffset) + " " + (y+51));
    d.push("C " + (25+legOffset) + " " + (y+51) + "," + (26+legOffset) + " " + (y+51.5) + "," + (27+legOffset) + " " + (y+51.5));
    d.push("C " + (32+legOffset) + " " + (y+52) + "," + (35+legOffset) + " " + (y+47.5) + "," + (29.5+legOffset) + " " + (y+46.5));
    d.push("C " + (29+legOffset) + " " + (y+48) + "," + (34+legOffset) + " " + (y+37) + "," + (27+legOffset) + " " + (y+34));
    d.push("C " + (27+legOffset) + " " + (y+32.9) + "," + (25+legOffset) + " " + (y+37) + "," + (27+legOffset) + " " + (y+24));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    var body = drawDogBody(container);
    body.style.transform = "rotate(-8.5deg)";
    
    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+4;
    d.push("M " + (17+legOffset) + " " + (y+26));
    d.push("C " + (17+legOffset) + " " + (y+27) + "," + (13+legOffset) + " " + (y+33) + "," + (19+legOffset) + " " + (y+43));
    d.push("C " + (20+legOffset) + " " + (y+44) + "," + (24+legOffset) + " " + (y+50) + "," + (19+legOffset) + " " + (y+55));
    d.push("C " + (15+legOffset) + " " + (y+54) + "," + (11+legOffset) + " " + (y+60) + "," + (19+legOffset) + " " + (y+60));
    d.push("C " + (26+legOffset) + " " + (y+59) + "," + (31+legOffset) + " " + (y+46) + "," + (27+legOffset) + " " + (y+43));
    d.push("C " + (26+legOffset) + " " + (y+42) + "," + (25+legOffset) + " " + (y+36) + "," + (26+legOffset) + " " + (y+29));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x + 52;
    d.push("M " + (14+legOffset) + " " + (y+27));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+38) + "," + (25+legOffset) + " " + (y+43));
    d.push("C " + (27+legOffset) + " " + (y+46) + "," + (22+legOffset) + " " + (y+53) + "," + (25+legOffset) + " " + (y+54));
    d.push("C " + (25+legOffset) + " " + (y+54) + "," + (26+legOffset) + " " + (y+54.5) + "," + (27+legOffset) + " " + (y+54.5));
    d.push("C " + (32+legOffset) + " " + (y+55) + "," + (35+legOffset) + " " + (y+50.5) + "," + (29.5+legOffset) + " " + (y+49.5));
    d.push("C " + (29+legOffset) + " " + (y+51) + "," + (34+legOffset) + " " + (y+40) + "," + (27+legOffset) + " " + (y+37));
    d.push("C " + (27+legOffset) + " " + (y+35.9) + "," + (25+legOffset) + " " + (y+40) + "," + (27+legOffset) + " " + (y+26));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;
}

/**
 * Draw the 8th frame of the running dog
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFrame8(x, y, container) {

    var rotationYModifier = -3;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2;
    d.push("M " + (17+legOffset) + " " + (y+26));
    d.push("C " + (17+legOffset) + " " + (y+27) + "," + (13+legOffset) + " " + (y+33) + "," + (19+legOffset) + " " + (y+43));
    d.push("C " + (20+legOffset) + " " + (y+44) + "," + (22+legOffset) + " " + (y+50) + "," + (19+legOffset) + " " + (y+55));
    d.push("C " + (15+legOffset) + " " + (y+54) + "," + (11+legOffset) + " " + (y+60) + "," + (19+legOffset) + " " + (y+60));
    d.push("C " + (26+legOffset) + " " + (y+59) + "," + (28+legOffset) + " " + (y+46) + "," + (27+legOffset) + " " + (y+43));
    d.push("C " + (26+legOffset) + " " + (y+42) + "," + (25+legOffset) + " " + (y+36) + "," + (26+legOffset) + " " + (y+29));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x + 47;
    d.push("M " + (15+legOffset) + " " + (y+27));
    d.push("C " + (15+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+39) + "," + (25+legOffset) + " " + (y+43));
    d.push("C " + (27+legOffset) + " " + (y+44) + "," + (22+legOffset) + " " + (y+46) + "," + (21+legOffset) + " " + (y+47));
    d.push("C " + (20+legOffset) + " " + (y+47.5) + "," + (23+legOffset) + " " + (y+53) + "," + (26+legOffset) + " " + (y+48));
    d.push("C " + (39+legOffset) + " " + (y+50) + "," + (30+legOffset) + " " + (y+42) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    var body = drawDogBody(container);
    body.style.transform = "rotate(-6deg)";
    
    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2;
    d.push("M " + (17+legOffset) + " " + (y+28));
    d.push("C " + (18+legOffset) + " " + (y+32) + "," + (23+legOffset) + " " + (y+39) + "," + (27+legOffset) + " " + (y+41));
    d.push("C " + (30+legOffset) + " " + (y+42) + "," + (33+legOffset) + " " + (y+41) + "," + (38+legOffset) + " " + (y+51));
    d.push("C " + (45+legOffset) + " " + (y+53) + "," + (47+legOffset) + " " + (y+44.5) + "," + (42+legOffset) + " " + (y+45.5));
    d.push("C " + (39+legOffset) + " " + (y+44) + "," + (39+legOffset) + " " + (y+38) + "," + (34.5+legOffset) + " " + (y+36.5));
    d.push("C " + (32+legOffset) + " " + (y+34) + "," + (32+legOffset) + " " + (y+31) + "," + (29+legOffset) + " " + (y+28));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x + 52;
    d.push("M " + (15+legOffset) + " " + (y+27));
    d.push("C " + (15+legOffset) + " " + (y+32) + "," + (8+legOffset) + " " + (y+39) + "," + (25+legOffset) + " " + (y+43));
    d.push("C " + (27+legOffset) + " " + (y+44) + "," + (22+legOffset) + " " + (y+46) + "," + (19+legOffset) + " " + (y+48));
    d.push("C " + (17+legOffset) + " " + (y+49) + "," + (17+legOffset) + " " + (y+52) + "," + (20+legOffset) + " " + (y+54));
    d.push("C " + (20+legOffset) + " " + (y+54) + "," + (24+legOffset) + " " + (y+56) + "," + (23.5+legOffset) + " " + (y+51));
    d.push("C " + (26+legOffset) + " " + (y+50) + "," + (38+legOffset) + " " + (y+42) + "," + (27+legOffset) + " " + (y+37));
    d.push("C " + (27+legOffset) + " " + (y+35.9) + "," + (25+legOffset) + " " + (y+40) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;
}

/**
 * Draw the flying frame of the dog - mix between frame 5 (front legs) and frame 6 (back legs)
 * @param {number} x - the x coordinate of the left side of the dog
 * @param {number} y - the y coordinate of the top of the dog
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogFlying(x, y, container) {

    var rotationYModifier = -2.5;
    y = y + rotationYModifier;

    // This leg is somewhat fake
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+5;
    d.push("M " + (19+legOffset) + " " + (y+28));
    d.push("C " + (19+legOffset) + " " + (y+28) + "," + (-5+legOffset) + " " + (y+31) + "," + (-2+legOffset) + " " + (y+38));
    d.push("C " + (-2+legOffset) + " " + (y+38) + "," + (legOffset) + " " + (y+40) + "," + (19+legOffset) + " " + (y+31));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    rotationYModifier = -1.25;
    y = y + rotationYModifier;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+52;
    d.push("M " + (20+legOffset) + " " + (y+27));
    d.push("C " + (legOffset) + " " + (y+30) + "," + (35+legOffset) + " " + (y+25) + "," + (39.5+legOffset) + " " + (y+37));
    d.push("C " + (46+legOffset) + " " + (y+37) + "," + (44+legOffset) + " " + (y+41) + "," + (44+legOffset) + " " + (y+42));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    var body = drawDogBody(container);
    //body.style.transform = "rotate(5deg)";

    rotationYModifier = -2.5;
    y = y + rotationYModifier;
    
    // Front
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+2;
    d.push("M " + (19+legOffset) + " " + (y+22));
    d.push("C " + (14+legOffset) + " " + (y+28) + "," + (21+legOffset) + " " + (y+37) + "," + (legOffset) + " " + (y+38));
    d.push("C " + (-1+legOffset) + " " + (y+34.5) + "," + (-5+legOffset) + " " + (y+32.5) + "," + (-5+legOffset) + " " + (y+39));
    d.push("C " + (-4.5+legOffset) + " " + (y+39) + "," + (-6+legOffset) + " " + (y+42) + "," + (legOffset) + " " + (y+43.5));
    d.push("C " + (31+legOffset) + " " + (y+40) + "," + (26+legOffset) + " " + (y+33) + "," + (29+legOffset) + " " + (y+26));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;

    rotationYModifier = -1.25;
    y = y + rotationYModifier;

    // Back
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x + 52;
    d.push("M " + (17+legOffset) + " " + (y+29));
    d.push("C " + (17+legOffset) + " " + (y+32) + "," + (12+legOffset) + " " + (y+38) + "," + (28+legOffset) + " " + (y+40));
    d.push("C " + (39+legOffset) + " " + (y+42) + "," + (38+legOffset) + " " + (y+49) + "," + (42+legOffset) + " " + (y+47));
    d.push("C " + (49+legOffset) + " " + (y+44) + "," + (48+legOffset) + " " + (y+40) + "," + (41+legOffset) + " " + (y+41));
    d.push("C " + (23+legOffset) + " " + (y+30) + "," + (29+legOffset) + " " + (y+25) + "," + (27+legOffset) + " " + (y+27));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y - rotationYModifier;
}

/**
 * Draw the body of the dog
 * Note: the body includes everything on the dog but the legs
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns a group element containing the dog body
 */
function drawDogBody(container) {
    var bodyGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var x = playerCanvasX;
    var y = playerCanvasY;

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    d.push("M " + (x+5) + " " + (y+10));
    d.push("C " + (x) + " " + (y+10) + "," + (x-5) + " " + (y) + "," + (x+5) + " " + y);
    d.push("C " + (x+5) + " " + (y) + "," + (x+10) + " " + (y) + "," + (x+10) + " " + (y-5));
    d.push("C " + (x+10) + " " + (y-5) + "," + (x+12) + " " + (y-10) + "," + (x+20) + " " + (y-10));
    d.push("C " + (x+20) + " " + (y-10) + "," + (x+34) + " " + (y-10) + "," + (x+32) + " " + (y+7));
    d.push("C " + (x+37) + " " + (y+20) + "," + (x+50) + " " + (y+10) + "," + (x+70) + " " + (y+15));
    d.push("C " + (x+80) + " " + (y+20) + "," + (x+85) + " " + (y+35) + "," + (x+70) + " " + (y+35));
    d.push("C " + (x+70) + " " + (y+35) + "," + (x+55) + " " + (y+40) + "," + (x+30) + " " + (y+35));
    d.push("C " + (x+5) + " " + (y+35) + "," + (x+28) + " " + (y+15) + "," + (x+5) + " " + (y+10));
    path.setAttribute("d", d);
    bodyGroup.appendChild( path );
    path.classList.add("dog");

    drawCircle(x + 13, y-2, 1, bodyGroup);
    drawCircle(x+2, y+3, 3, bodyGroup);

    var ear = document.createElementNS("http://www.w3.org/2000/svg", "path");
    d = [];
    d.push("M " + (x+18) + " " + (y-5));
    d.push("C " + (x+22) + " " + (y+5) + "," + (x+22) + " " + (y+5) + "," + (x+26) + " " + (y-5));
    ear.setAttribute("d", d);
    bodyGroup.appendChild( ear );
    ear.classList.add("dog");

    var tail = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    d.push("M " + (x+70) + " " + (y+15));
    d.push("C " + (x+70) + " " + (y+15) + "," + (x+78) + " " + (y+21) + "," + (x+96) + " " + (y+15));
    d.push("C " + (x+96) + " " + (y+15) + "," + (x+86) + " " + (y+22) + "," + (x+77) + " " + (y+21));
    tail.setAttribute("d", d);
    bodyGroup.appendChild( tail );
    tail.classList.add("dog");

    // These are all for white space between the body and the tail.
    var cover = drawLine(x+76.3, y+20, x+76.3, y+24, bodyGroup);
    cover.classList.add("dog-cover");
    cover.setAttribute("stroke-width", "1.5");
    cover = drawLine(x+71.3, y+18.05, x+76.3, y+20, bodyGroup);
    cover.classList.add("dog-cover");
    cover.setAttribute("stroke-width", "2");

    container.appendChild(bodyGroup);
    bodyGroup.classList.add("dog-body");

    return bodyGroup;
}

/**
 * Draw a dog leg
 * @param {number} x - the x coordinate of the left side of the DOG
 * @param {number} y - the y coordinate of the left side of the DOG
 * @param {number} legOffset - the x offset for this particular leg
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawDogLeg(x, y, legOffset, container) {
    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = legOffset + x;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (12+legOffset) + " " + (y+40) + "," + (22+legOffset) + " " + (y+50) + "," + (15+legOffset) + " " + (y+54));
    d.push("C " + (15+legOffset) + " " + (y+54) + "," + (7+legOffset) + " " + (y+56) + "," + (15+legOffset) + " " + (y+60));
    d.push("C " + (15+legOffset) + " " + (y+60) + "," + (24+legOffset) + " " + (y+60) + "," + (23+legOffset) + " " + (y+55));
    d.push("C " + (23+legOffset) + " " + (y+45) + "," + (26+legOffset) + " " + (y+40) + "," + (25+legOffset) + " " + (y+25));
    leg.setAttribute("d", d);
    container.appendChild( leg );
    leg.classList.add("dog");
}

/**
 * Draw the ice cream the dog will deliver
 * @param {number} x - the x coordinate of the left side of the ice cream
 * @param {number} y - the y coordinate of the BOTTOM of the ice cream
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the ice cream
 */
function drawIceCream(x, y, container) {
    // Note how y is the BOTTOM here, since that is more useful with the cone
    // and varying heights due to different scoops
    var iceCreamGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    iceCreamGroup.classList.add("ice-cream");

    var coneHeight = 10;
    var scoopRadius = 4;
    var coneWidth = (scoopRadius+1) * 2;
    var maxScoops = 4;

    var numScoops = Math.floor(Math.random() * maxScoops) + 1;

    for( var i=0; i<numScoops; i++ ) {
        var scoopY = -scoopRadius*1.75*i;
        var scoop = drawCircle( scoopRadius+1, scoopY, scoopRadius, iceCreamGroup );
        scoop.style.fill = getRandomColor();
        scoop.classList.add("scoop");
    }

    var cone = drawPath( [ [0, 0], [coneWidth/2, coneHeight], [coneWidth, 0] ] , iceCreamGroup, true );
    cone.classList.add("cone");

    iceCreamGroup.setAttribute("x", x);
    iceCreamGroup.setAttribute("y", y);

    if( container ) {
        container.appendChild(iceCreamGroup);
    }

    return iceCreamGroup;
}

/**
 * Draw an enemy (tennis ball)
 * @param {number} x - the x coordinate of the CENTER of the enemy
 * @param {number} y - the y coordinate of the CENTER of the enemy
 * @param {number} radius - the radius of the enemy
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the enemy
 */
function drawEnemy(x, y, radius, container) {
    var enemyGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    enemyGroup.classList.add("enemy");

    // Since the enemy is mainly a circle, we'll have the x and y coordinates of the group
    // correspond to the center of the circle, not the top left like usual
    var enemy = drawCircle(0, 0, radius, enemyGroup);

    var rightTopCoordinates = getPointOnCircumference(0, 0, radius, -Math.PI/4);
    var rightBottomCoordinates = getPointOnCircumference(0, 0, radius, Math.PI/4);
    var leftTopCoordinates = getPointOnCircumference(0, 0, radius, -3*Math.PI/4);
    var leftBottomCoordinates = getPointOnCircumference(0, 0, radius, Math.PI*3/4);

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    d.push("M " + (rightTopCoordinates[0]) + " " + (rightTopCoordinates[1]));
    d.push("C " + (rightTopCoordinates[0]-6) + " " + (rightTopCoordinates[1]+5) + "," + (rightBottomCoordinates[0]-6) + " " + (rightBottomCoordinates[1]-5) + "," + (rightBottomCoordinates[0]) + " " + (rightBottomCoordinates[1]));
    path.setAttribute("d", d);
    enemyGroup.appendChild( path );

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    d.push("M " + (leftTopCoordinates[0]) + " " + (leftTopCoordinates[1]));
    d.push("C " + (leftTopCoordinates[0]+6) + " " + (leftTopCoordinates[1]+5) + "," + (leftBottomCoordinates[0]+6) + " " + (leftBottomCoordinates[1]-5) + "," + (leftBottomCoordinates[0]) + " " + (leftBottomCoordinates[1]));
    path.setAttribute("d", d);
    enemyGroup.appendChild( path );

    container.appendChild(enemyGroup);
    enemyGroup.setAttribute("x", x);
    enemyGroup.setAttribute("y", y);

    return enemyGroup;
}

/**
 * Get the point on the circumference of a circle given a center point, radius, and radians
 * @param {number} cx - the x coordinate of the center of the circle
 * @param {number} cy - the y coordinate of the center of the circl 
 * @param {number} radius - the radius of the circle
 * @param {number} radians - the rotation of the angle in radians
 * @returns a coordinate pair for the point on the circumference
 */
function getPointOnCircumference(cx, cy, radius, radians) {
    return [ cx + radius * Math.cos(radians), cy + radius * Math.sin(radians) ];
}

/**
 * Draw the world
 */
function drawWorld() {
    var container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    container.classList.add("world");
    document.body.appendChild(container);
    // Temporarily add an object for the player
    var playerObject = { x1: playerX - 20, y1: playerY - 20, x2: playerX + playerWidth + 20, y2: playerY + playerHeight + 20 };

    for( var i=0; i<numBuildings; i++ ) {
        var object;
        while( true ) {
            var x = Math.floor(Math.random() * (canvasWidth-600)/10) * 10 + 250;
            var y = Math.floor(Math.random() * (canvasHeight-600)/10) * 10 + 250;
            var height = Math.random() * 200 + 100;
            var width = Math.random() * 150 + 100;
            
            object = { x1: x, y1: y, x2: x+width, y2: y+height-playerAllowedHouseOverlap };
            // This is for checking for overlap when generating the town, so no buldings are too close
            var overlapObject = { x1: object.x1-80, y1: object.y1-110, x2: object.x2+80, y2: object.y2+playerAllowedHouseOverlap+110 };
            var overlaps = false;
            for(var i=0; i<objects.length; i++) {
                var curOverlapObject = { x1: objects[i].x1-80, y1: objects[i].y1-110, x2: objects[i].x2+80, y2: objects[i].y2+playerAllowedHouseOverlap+110 };
                if( collisionTest(overlapObject, curOverlapObject) ) {
                    overlaps = true;
                }
            }
            if( collisionTest(playerObject, overlapObject) ) {
                overlaps = true;
            }
            if( !overlaps ) {
                objects.push(object);
                enemyBuildings.push(JSON.parse(JSON.stringify(object)));
                enemyBuildings[enemyBuildings.length-1].y2 += playerAllowedHouseOverlap;
                break;
            }
        }
    }

    objects.sort( function(a,b) {
        if( a.y1 < b.y1 ) return -1;
        if( a.y1 > b.y1 ) return 1;
        if( a.x1 < b.x1 ) return -1;
        if( a.x1 > b.x1 ) return 1;
        return 0;
    } );

    var houseNumber = 1;
    for( var i=0; i<numBuildings; i++ ) {
        var buildingResponse = drawBuilding( objects[i].x2 - objects[i].x1, objects[i].y2-objects[i].y1+playerAllowedHouseOverlap, objects[i].x1, objects[i].y1, container, houseNumber );
        // Add the roof to the objects
        objects.push( { x1: objects[i].x1 - buildingResponse.roofOut, y1: objects[i].y1 - buildingResponse.roofHeight, x2: objects[i].x2 + buildingResponse.roofOut, y2: objects[i].y1 } );
        enemyBuildings[i].x1 = enemyBuildings[i].x1 - buildingResponse.roofOut;
        enemyBuildings[i].x2 = enemyBuildings[i].x2 + buildingResponse.roofOut;
        enemyBuildings[i].y1 = enemyBuildings[i].y1 - buildingResponse.roofHeight;
        objects[i].houseNumber = houseNumber;
        objects[i].door = buildingResponse.door;
        houseNumber ++;
    }

    spawnEnemies(numEnemies, container);
    spawnPowerups(numPowerups, container);
    //drawMat(objects[currentBuilding].door, container);
    openDoor(objects[currentBuilding].door.shape);

    // We have a seperate container for the player
    container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    container.classList.add("player");
    document.body.appendChild(container);
    drawDog(playerCanvasX, playerCanvasY, container);
    drawIceCream(-1, 0, container);

    drawBar();
    drawMenu();
}

/**
 * Spawn enemies
 * @param {number} enemyCount - the number of enemies to add
 * @param {HTMLElement} container - the svg canvas to add the enemies to
 */
function spawnEnemies(enemyCount, container) {
    var playerObject = { x1: playerX - 20, y1: playerY - 20, x2: playerX + playerWidth + 20, y2: playerY + playerHeight + 20 };

    for( var i=0; i<enemyCount; i++ ) {

        var enemy;
        while( true ) {
            var x = Math.floor(Math.random() * (canvasWidth-600)/10) * 10 + 300;
            var y = Math.floor(Math.random() * (canvasHeight-600)/10) * 10 + 300;

            enemy = { x1: x - enemyRadius, y1: y - enemyRadius, x2: x + enemyRadius, y2: y+enemyRadius };
            var overlaps = false;
            for(var i=0; i<objects.length; i++) {
                var curOverlapObject = { x1: objects[i].x1-30, y1: objects[i].y1-60, x2: objects[i].x2+30, y2: objects[i].y2+playerAllowedHouseOverlap+20 };
                if( collisionTest(enemy, curOverlapObject) ) {
                    overlaps = true;
                }
            }
            // Add the extra spacing to the current enemy here, since all the enemies are the same size
            var overlapEnemy = { x1: enemy.x1 - 50, y1: enemy.y1 - 50, x2: enemy.x1 + 50, y2: enemy.y2 + 50 };
            for(var i=0; i<enemies.length; i++) {
                if( collisionTest(overlapEnemy, enemies[i]) ) {
                    overlaps = true;
                }
            }
            // Really don't get close to the player
            overlapEnemy = { x1: enemy.x1 - enemySightedDistance - 50, y1: enemy.y1 - enemySightedDistance - 50, x2: enemy.x1 + enemySightedDistance + 50, y2: enemy.y2 + enemySightedDistance + 50 };
            if( collisionTest(playerObject, overlapEnemy) ) {
                overlaps = true;
            }
            if( !overlaps ) {
                var enemyShape = drawEnemy(x, y, enemyRadius, container);
                enemy.shape = enemyShape;
                enemies.push(enemy);
                break;
            }
        }
    }
}

/**
 * Move horizontally
 * @param {number} amount - the number of pixels to move
 */
function moveHorizontal(amount) {
    var world = document.querySelector(".world");
    var player = document.querySelector(".player");

    if( amount < 0 ) {
        player.classList.add("player-flipped");
        // If the player is scaled, we'll have to update the transform manually
        if( player.style.transform.indexOf("scale") != -1 && player.style.transform.indexOf("scaleX") == -1 ) {
            player.style.transform = player.style.transform + "scaleX(-1)";
        }
    }
    else {
        player.classList.remove("player-flipped");
        // If the player is scaled, we'll have to update the transform manually
        if( player.style.transform.indexOf("scale") != -1 ) {
            player.style.transform = player.style.transform.replace("scaleX(-1)","");
        }
    }

    var playerObject = { x1: playerX - amount, y1: playerY, x2: playerX + playerWidth - amount, y2: playerY + playerHeight };
    var colliding = false;
    if( playerX + playerWidth - amount > canvasWidth || playerX - amount < 0 ) {
        colliding = true;
    }
    else {
        if( !isFlying ) {
            for(var i=0; i<objects.length;i++) {
                if( collisionTest(objects[i], playerObject) ) {
                    colliding = true;
                    break;
                }
            }
        }
    }
    if( !colliding ) {
        worldHorizontalOffset -= amount;
        // Make sure this matches the css
        world.style.left = "calc(100% / 2 - " + (canvasWidth/2+worldHorizontalOffset) + "px)";
        playerX -= amount;
    }
}

/**
 * Move vertically
 * @param {number} amount - the number of pixels to move
 */
function moveVertical(amount) {
    var world = document.querySelector(".world");

    var playerObject = { x1: playerX, y1: playerY - amount, x2: playerX + playerWidth, y2: playerY + playerHeight - amount };
    var colliding = false;
    if( playerY + playerHeight - amount > canvasHeight || playerY - amount < 0 ) {
        colliding = true;
    }
    else {
        if( !isFlying ) {
            for(var i=0; i<objects.length;i++) {
                if( collisionTest(objects[i], playerObject) ) {
                    colliding = true;
                    break;
                }
            }
        }
    }
    if( !colliding ) {
        worldVerticalOffset -= amount;
        // Make sure this matches the css
        world.style.top = "calc( 100% / 2 - " + (canvasHeight/2+worldVerticalOffset) + "px)";
        playerY -= amount;
    }
}

/**
 * Tick (basically mimicing frames)
 */
function tick() {
    if( !stopped ) {
        var curPlayerX = playerX;
        var curPlayerY = playerY;


        var curMoveAmount = movementAmount * (powerups["speed"] ? 2 : 1);

        if( keyDown['up'] ) {
            moveVertical(curMoveAmount);
        }
        if( keyDown['down'] ) {
            moveVertical(-curMoveAmount);
        }
        if( keyDown['left'] ) {
            moveHorizontal(curMoveAmount);
        }
        if( keyDown['right'] ) {
            moveHorizontal(-curMoveAmount);
        }
        
        if( playerX != curPlayerX || playerY != curPlayerY ) {
            if( !playTimeout ) {
                play();
            }
        }
        else {
            if( playTimeout ) {
                
                clearTimeout(playTimeout);
                playTimeout = null;
            }
        }

        existEnemies();
        existPowerups();

        // Take time off powerups
        var powerupKeys = Object.keys(powerups);
        for( var i=0; i<powerupKeys.length; i++ ) {
            // We need this to be 1 here, so we don't keep doing it (once at 0), but it'll hit this on the last loop
            if( powerups[powerupKeys[i]] <= 1 && powerups[powerupKeys[i]] > 0 ) {
                if( powerupKeys[i] == "big" || powerupKeys[i] == "small" ) {
                    changeWhenSafe.size = { "multiplier": 1, "function": function() {changePlayerSize(1);} };
                }
                else if( powerupKeys[i] == "invincible" ) {
                    // It's OK to not check for if the being invincible after being hit timeout is still
                    // going, since that timeout is less than powerup tick frames and will have expired by
                    // the time the invincibility powerup expires 
                    document.querySelector(".player").classList.remove("player-invincible");
                }
                else if( powerupKeys[i] == "fly" ) { 
                    changeWhenSafe.fly = { "multiplier": powerups.big ? 1.5 : powerups.small ? 0.5 : 1, "function": function() {isFlying = false;} };
                }
            }
            if( powerups[powerupKeys[i]] > 0 ) {
                powerups[powerupKeys[i]] --;
            }
            else {
                powerups[powerupKeys[i]] = 0;
            }
        }

        if(changeWhenSafe.size) {
            if( powerupIsSafe(changeWhenSafe.size.multiplier) ) {
                changeWhenSafe.size["function"]();
                changeWhenSafe.size = null;
            }
        }
        if(changeWhenSafe.fly) {
            if( powerupIsSafe(changeWhenSafe.fly.multiplier, true) ) {
                changeWhenSafe.fly["function"]();
                changeWhenSafe.fly = null;
            }
        }

        updateBar();

        anglePointer();

        // Deliver if we can 
        deliver();

        tickTimeoutSet = Date.now();
        tickTimeout = setTimeout(tick, tickRate);
    }
}

/**
 * Play the dog moving
 */
function play() {
    if( !stopped ) {
        draw();
    }
    playTimeout = setTimeout(play, dogMoveRate);
}

/**
 * Draw the dog's correct frame
 */
function draw() {
    var player = document.querySelector(".player");

    // We must always have an ice cream and always should
    var iceCream = document.querySelector(".ice-cream");

    player.innerHTML = "";

    if( !isFlying ) {
        window["drawDogFrame" + frame](playerCanvasX, playerCanvasY, player);
    }
    else {
        drawDogFlying(playerCanvasX, playerCanvasY, player);
    }

    player.appendChild(iceCream);

    if( !isFlying ) {
        if( frame == 1 ) {
            document.querySelector(".ice-cream").setAttribute("x", -3.5);
            document.querySelector(".ice-cream").setAttribute("y", 4);
        }
        if( frame == 2 ) {
            document.querySelector(".ice-cream").setAttribute("x", -1);
            document.querySelector(".ice-cream").setAttribute("y", 0);
        }
        if( frame == 4 ) {
            document.querySelector(".ice-cream").setAttribute("x", 1.5);
            document.querySelector(".ice-cream").setAttribute("y", -2.7);
        }
        if( frame == 6 ) {
            document.querySelector(".ice-cream").setAttribute("x", -2);
            document.querySelector(".ice-cream").setAttribute("y", 1.5);
        }
        if( frame == 7 ) {
            document.querySelector(".ice-cream").setAttribute("x", -4.2);
            document.querySelector(".ice-cream").setAttribute("y", 5.2);
        }
        if( frame == 8 ) {
            document.querySelector(".ice-cream").setAttribute("x", -3.5);
            document.querySelector(".ice-cream").setAttribute("y", 4);
        }
    }
    else {
        document.querySelector(".ice-cream").setAttribute("x", -2);
        document.querySelector(".ice-cream").setAttribute("y", 1.5);
    }

    if( frame == 8 ) {
        frame = 0;
    }

    frame++;
}

/**
 * Control the existence of enemies
 * (performs a single "tick" of existence)
 */
function existEnemies() {

    for( var i=0; i<enemies.length; i++ ) {
        var enemy = enemies[i];
        
        var enemySightedObject = { x1: enemy.x1 - enemySightedDistance, x2: enemy.x2 + enemySightedDistance, y1: enemy.y1 - enemySightedDistance, y2: enemy.y2 + enemySightedDistance };
        var playerObject = { x1: playerX + playerHitboxReduction, y1: playerY + playerHitboxReduction, x2: playerX + playerWidth - playerHitboxReduction, y2: playerY + playerHeight - playerHitboxReduction };
        // TODO add house
        // TODO scenery
        // TODO dont move on tap of pause button
        // TODO sound and music
        // TODO - global high scores
        // TODO - no overlap menu on phone and responsive in general?
        // TODO - prevent zoom? > just make sure the phone and the desktop have the same viewport somehow
        // TODO see if we can increase max difficulty so it doesn't cap so early on - testing needed
        // TODO remember that bug  where you grew big on tick? maybe we should add the let people escape code just in case
        // TODO local resources

        // If this hits the player
        if( !powerups.invincible && collisionTest(enemy, playerObject) ) {
            playerHealth --;
            if( playerHealth <= 0 ) {
                reset(); // You lose!
                document.querySelector(".menu-subtitle").innerText = "Game over! You scored " + playerScore + ".";
                return;
            }
            obtainInvincibility(playerInvincibilityTicks);
        }

        if( !powerups.invincible && collisionTest(playerObject, enemySightedObject) ) {
            enemy.shape.classList.add("enemy-aggro");
            chasePlayer(enemy);
        }
        else {
            enemy.shape.classList.remove("enemy-aggro");
            randomWalk(enemy);
        }
    }

}

/**
 * Move an enemy
 * @param {number} amount - the number of pixels to move horizontally and vertically {x: <int>, y: <int>}
 */
function moveEnemy(amount, enemy, noActualMove) {

    var colliding = false;
    if( enemy.x2 + amount.x + enemyPadding > canvasWidth || enemy.x1 + amount.x - enemyPadding < 0 || enemy.y2 + amount.y + enemyPadding > canvasHeight || enemy.y2 + amount.y - enemyPadding < 0 ) {
        colliding = true;
    }
    else {
        var enemyObject = { x1: enemy.x1 + amount.x - enemyPadding, y1: enemy.y1 + amount.y - enemyPadding, x2: enemy.x2 + amount.x + enemyPadding, y2: enemy.y2 + amount.y + enemyPadding };
        for(var i=0; i<enemyBuildings.length;i++) {
            if( collisionTest(enemyBuildings[i], enemyObject) ) {
                colliding = true;
                break;
            }
        }
        /*for(var i=0; i<enemies.length; i++) {
            if( enemies[i] != enemy && collisionTest(enemies[i], enemyObject) ) {
                colliding = true;
                break;
            }
        }*/
    }
    if( !colliding && !noActualMove ) {
        enemy.x1 += amount.x;
        enemy.x2 += amount.x;
        enemy.y1 += amount.y;
        enemy.y2 += amount.y;
        enemy.shape.setAttribute( "x", parseFloat(enemy.shape.getAttribute("x")) + amount.x );
        enemy.shape.setAttribute( "y", parseFloat(enemy.shape.getAttribute("y")) + amount.y );
    }

    return colliding;
}

/**
 * Have an enemy randomly walk
 * @param {object} enemy 
 */
function randomWalk(enemy) {
    // Get the current enemy direction
    var direction = enemy.direction;

    // Get a new direction potentially
    // We don't want to generate a new direction every single time
    if( Math.floor(Math.random() * 10) == 0 ) {
        direction = Math.floor(Math.random() * 16);
        enemy.direction = direction;
    }

    var xMove = 0;
    var yMove = 0;
    if( direction == 0 ) {
        xMove = enemyMovementAmount;
    }
    if( direction == 1 ) {
        xMove = enemyMovementAmount;
        yMove = enemyMovementAmount;
    }
    if( direction == 2 ) {
        yMove = enemyMovementAmount;
    }
    if( direction == 3 ) {
        xMove = -enemyMovementAmount;
        yMove = enemyMovementAmount;
    }
    if( direction == 4 ) {
        xMove = -enemyMovementAmount;
    }
    if( direction == 5 ) {
        xMove = -enemyMovementAmount;
        yMove = -enemyMovementAmount;
    }
    if( direction == 6 ) {
        yMove = -enemyMovementAmount;
    }
    if( direction == 7 ) {
        xMove = enemyMovementAmount;
        yMove = -enemyMovementAmount;
    }
    
    // Move the enemy
    var collided = moveEnemy({x: xMove, y: yMove}, enemy);
    if( collided ) {
        direction = Math.floor(Math.random() * 16);
        enemy.direction = direction;
    }
}

/**
 * Increase the current difficulty
 */
function increaseDifficulty() {
    if( currentDifficulty <= maxDifficulty ) {
        enemyMovementAmount += 0.1; // So the max movement amount is 8.5
        
        if(currentDifficulty % 5 == 0) {
            spawnEnemies(1, document.querySelector(".world"));
        }

        currentDifficulty ++;
    }
}

/**
 * Have an enemy chase the player
 * @param {object} enemy - an enemy object that can be used to test for collision (see collisionTest function for the object type)
 */
function chasePlayer(enemy) {
    var xMove = 0;
    var yMove = 0;

    // If we have a force to get around something
    if( enemy.chaseDirectionX ) {
        xMove = enemy.chaseDirectionX;
    }
    else {
        if( enemy.x1 + enemyMovementAmount < playerX + playerWidth/2 ) {
            xMove = enemyMovementAmount;
        }
        else if( enemy.x1 - enemyMovementAmount > playerX + playerWidth/2 ) {
            xMove = -enemyMovementAmount;
        }
    }

    if( enemy.chaseDirectionY ) {
        yMove = enemy.chaseDirectionY;
    }
    else {
        if( enemy.y1 + enemyMovementAmount < playerY + playerHeight/2 ) {
            yMove = enemyMovementAmount;
        }
        else if( enemy.y1 - enemyMovementAmount > playerY + playerHeight/2 ) {
            yMove = -enemyMovementAmount;
        }
    }

    // Move seperately, so if one enemy collides, we still have the other
    var xCollided = null;
    var yCollided = null;
    if( xMove ) {
        xCollided = moveEnemy({x: xMove, y:0}, enemy);
        // We can't move horizontally, and we're not moving up or down.
        // force a Y direction until we move horizontally.
        if( xCollided && !yMove ) {
            // Random is default
            enemy.chaseDirectionY = (Math.floor(Math.random() * 2) == 0 ? -1 : 1) * enemyMovementAmount;
            
            // But try to find the quickest path around
            for( var i=0; i<100; i+=10 ) {
                var downCollideTest = moveEnemy({x: xMove, y: i}, enemy, true);
                var upCollideTest = moveEnemy({x: xMove, y: -i}, enemy, true);
                if( !downCollideTest ) {
                    enemy.chaseDirectionY = enemyMovementAmount;
                    break;
                }
                if( !upCollideTest ) {
                    enemy.chaseDirectionY = -enemyMovementAmount;
                    break;
                }
            }
        }
        if( !xCollided ) {
            enemy.chaseDirectionY = null;
        }
    }
    if( yMove ) {
        yCollided = moveEnemy({x: 0, y:yMove}, enemy);
        // We can't move vertically, and we're not moving side to side.
        // force an X direction until we move vertically.
        if( yCollided && !xMove ) {
            // Random is default
            enemy.chaseDirectionX = (Math.floor(Math.random() * 2) == 0 ? -1 : 1) * enemyMovementAmount;
            // But try to find quickest path around
            for( var i=0; i<100; i+=10 ) {
                var rightCollideTest = moveEnemy({x: i, y: yMove}, enemy, true);
                var leftCollideTest = moveEnemy({x: -i, y: yMove}, enemy, true);
                if( !rightCollideTest ) {
                    enemy.chaseDirectionX = enemyMovementAmount;
                    break;
                }
                if( !leftCollideTest ) {
                    enemy.chaseDirectionX = -enemyMovementAmount;
                    break;
                }
            }
        }
        if( ! yCollided ) {
            enemy.chaseDirectionX = null;
        }
    }

    // Consider the following
    // The player is on the opposite side of the house just above
    // the transition from roof to building. The enemy is in the corner, and has
    // both a moveX and moveY to get to the player. Since both X and Y are colliding,
    // we'll flip the x direction until we can move on the Y axis.
    // We do this, and then move up as necessary to get to the player.
    // However, once we get to the same vertical level as the player, we are now "stuck"
    // since we need only to move horizontally, but we can't. As such, we calculate the
    // quickest distance to no longer be stuck moving horizontally. Which, is, moving down.
    // But then, we'll move towards the player until we get stuck in the corner again and repeat.
    // To combat this, we do our checks assuming there might be a roof, so when we check
    // which y direction to go, we add and subtract some values to X too.
}

/**
 * Generate the next building to deliver to
 * @returns the next building to deliver to (note this is one less than the actual number on the door of the building)
 */
function generateNextBuilding() {
    var nextBuilding = Math.floor(Math.random() * numBuildings);
    if(currentBuilding && nextBuilding == currentBuilding) {
        return generateNextBuilding();
    }
    return nextBuilding;
}

/**
 * Deliver a package to a house
 */
function deliver() {
    var door = objects[currentBuilding].door;
    var playerObject = { x1: playerX, y1: playerY, x2: playerX + playerWidth, y2: playerY + playerHeight };

    if( collisionTest(playerObject, door) ) {
        var scoreIncrement = powerups.big ? 2 : 1;
        playerScore += scoreIncrement;
        localStorage.cocoaTownCoins = parseInt(localStorage.cocoaTownCoins) + scoreIncrement;
        if( playerScore > localStorage.cocoaTownHighScore ) {
            localStorage.cocoaTownHighScore = playerScore;
        }
        currentBuilding = generateNextBuilding();
        // get a new ice cream
        // we want to replace the current one to maintain position
        var player = document.querySelector(".player");
        var iceCream = document.querySelector(".ice-cream");
        var newIceCream = drawIceCream(-1, 0, null); // Use a null container so it is not added
        player.replaceChild(newIceCream, iceCream);

        //drawMat(objects[currentBuilding].door, document.querySelector(".world"));
        openDoor(objects[currentBuilding].door.shape);

        closeDoor(door.shape);

        increaseDifficulty();
    }
}

/**
 * Draw the pointer of the compass
 * @param {number} x - the x coordinate of the CENTER of the compass (not the needle/pointer of the compass)
 * @param {number} y - the y coordinate of the CENTER of the compass (not the needle/pointer of the compass)
 * @param {number} radius - the radius of the enemy
 */
function drawPointer(x, y, container) {
    var pointerWidth = 10;
    var pointerLength = 20;
    var compass = drawCircle(x, y, pointerLength + 5, container);
    compass.classList.add("compass");

    var pointer = drawPath( [ [x+pointerLength, y], [x, y+pointerWidth/2], [x+pointerLength/5, y], [x, y-pointerWidth/2] ] , container, true );
    pointer.classList.add("pointer");
    pointer.style.transformOrigin = x + "px " + y + "px ";
    return pointer;
}

/**
 * Correctly angle the pointer to point to the house we are delivering to 
 */
function anglePointer() {
    var pointer = document.querySelector(".pointer");

    var door = objects[currentBuilding].door;
    
    var playerCenterX =  (playerX + playerWidth/2);
    var playerCenterY = (playerY + playerHeight/2);
    var doorX = (door.x1 + door.x2)/2;
    var doorY = (door.y1 + door.y2)/2;

    // If we're really close, indicate it
    var distance = Math.sqrt( (playerCenterX-doorX)**2 ) + Math.sqrt( (playerCenterY-doorY)**2 );
    var scaleTransform = "";
    if( distance < 300 ) {
        scaleTransform = "scaleX("+(distance/300)+")" + "scaleY("+(distance/300)+")";
    }

    // tan (angle) = opposite/adjacent - solve for angle
    var rotationAngle;
    
    // tangent is only good for right triangles, so we have to rotate accordingly
    if( doorX > playerCenterX && doorY > playerCenterY ) {
        rotationAngle = Math.atan( (doorY - playerCenterY) / (doorX - playerCenterX) );
    }
    else if( doorX < playerCenterX && doorY > playerCenterY ) {
        rotationAngle = Math.PI/2 - Math.atan( (doorY - playerCenterY) / (playerCenterX - doorX) );
        rotationAngle += Math.PI/2;
    }
    else if( doorX < playerCenterX && doorY < playerCenterY ) {
        rotationAngle = Math.atan( (playerCenterY - doorY) / (playerCenterX - doorX) );
        rotationAngle += Math.PI;
    }
    else if( doorX > playerCenterX && doorY < playerCenterY ) {
        rotationAngle = Math.PI/2 - Math.atan( (playerCenterY - doorY) / (doorX - playerCenterX) );
        rotationAngle -= Math.PI/2;
    }
    else if( doorX == playerCenterX && doorY > playerCenterY ) {
        // straight down
        rotationAngle = Math.PI/2;
    }
    else if( doorX == playerCenterX && doorY < playerCenterY ) {
        // straight up
        rotationAngle = -Math.PI/2;
    }
    else if( doorX < playerCenterX && doorY == playerCenterY ) {
        // straight left
        rotationAngle = Math.PI;
    }
    else if( doorX > playerCenterX && doorY == playerCenterY ) {
        // straight right
    }
    
    pointer.style.transform = scaleTransform  + "rotate("+rotationAngle+"rad)";
}

/**
 * Toggle the state of the game being paused
 */
function togglePause() {
    if( !document.querySelector(".pause-button") ) {
        drawPause();
    }
    if( stopped ) {
        setTimeout(tick, tickTimeoutRemaining);
        stopped = false;
        document.querySelector(".menu").style.opacity = 0;
        document.querySelector(".bar").style.opacity = 1;
        document.querySelector(".pause-button").innerHTML = "<i class='fas fa-pause'></i>";
    }
    else {
        // Get exactly the frame we are on when we pause, so we can resume at that frame
        tickTimeoutRemaining = tickRate - (Date.now() - tickTimeoutSet);
        stopped = true;
        document.querySelector(".menu-subtitle").innerText = "Paused";
        document.querySelector(".bar").style.opacity = 0;
        document.querySelector(".menu").style.opacity = 1;
        document.querySelector(".pause-button").innerHTML = "<i class='fas fa-play'></i>";
    }
}

/**
 * Draw the bar on the bottom of the screen
 */
function drawBar() {
    var bar = document.createElement("div");
    bar.classList.add("bar");

    var barColumn = document.createElement("div");
    barColumn.classList.add("bar-column");

    // First row
    var barRow = document.createElement("div");
    barRow.classList.add("bar-row");

    /*barRow.innerHTML += '<i class="fas fa-paw"></i>';*/

    var heartsDiv = document.createElement("div");
    heartsDiv.classList.add("bar-div");
    heartsDiv.classList.add("bar-hearts");
    barRow.appendChild(heartsDiv);

    var deliverToDiv = document.createElement("div");
    deliverToDiv.classList.add("bar-div");
    deliverToDiv.classList.add("bar-deliver");
    barRow.appendChild(deliverToDiv);

    var scoreDiv = document.createElement("div");
    scoreDiv.classList.add("bar-div");
    scoreDiv.classList.add("bar-score");
    barRow.appendChild(scoreDiv);

    var hiScoreDiv = document.createElement("div");
    hiScoreDiv.classList.add("bar-div");
    hiScoreDiv.classList.add("bar-hi-score");
    barRow.appendChild(hiScoreDiv);

    var moneyDiv = document.createElement("div");
    moneyDiv.classList.add("bar-div");
    moneyDiv.classList.add("bar-money");
    barRow.appendChild(moneyDiv);

    //barRow.innerHTML += '<i class="fas fa-paw"></i>';

    barColumn.appendChild(barRow);

    // Second row - powerups
    barRow = document.createElement("div");
    barRow.classList.add("bar-row");

    /*barRow.innerHTML += '<i class="fas fa-ice-cream"></i>';*/

    var powerupKeys = Object.keys(powerups);
    for(var i=0; i<powerupKeys.length; i++) {
        var powerupDiv = document.createElement("div");
        powerupDiv.classList.add("bar-div");
        powerupDiv.classList.add("bar-powerup");
        powerupDiv.classList.add("bar-powerup-" + powerupKeys[i]);
        barRow.appendChild(powerupDiv);
    }

//    barRow.innerHTML += '<i class="fas fa-ice-cream"></i>';

    barColumn.appendChild(barRow);

    bar.appendChild(barColumn);

    barColumn = document.createElement("div");
    barColumn.classList.add("bar-column");

    // seperate container for the pointer
    var container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    container.classList.add("pointer-container");
    barColumn.appendChild(container);
    drawPointer(0, 0, container);

    bar.appendChild(barColumn);

    document.body.appendChild(bar);

    updateBar();
}

/**
 * Update the information on the bar
 */
function updateBar() {
    var heartText = "";
    for(var i=0; i<playerHealth; i++) {
        heartText += '<i class="fas fa-heart"></i>&nbsp;';
    }
    for(var i=Math.max(0,playerHealth); i<playerMaxHealth; i++) {
        heartText += '<i class="far fa-heart"></i>&nbsp;';
    }
    document.querySelector(".bar-hearts").innerHTML = heartText;
    document.querySelector(".bar-score").innerText = playerScore;
    document.querySelector(".bar-hi-score").innerText = localStorage.cocoaTownHighScore;
    document.querySelector(".bar-money").innerText = localStorage.cocoaTownCoins;
    document.querySelector(".bar-deliver").innerText = (currentBuilding + 1);

    var powerupKeys = Object.keys(powerups);
    for(var i=0; i<powerupKeys.length; i++) {
        var powerupDiv = document.querySelector(".bar-powerup-" + powerupKeys[i]);

        // Make sure this matches the background color in the css
        var barBackgroundColor = "rgba(142, 200, 248, 0.9)";
        var powerupPecentage = powerups[powerupKeys[i]] / powerupTicks * 100;
        powerupDiv.style.backgroundImage = "linear-gradient(90deg, transparent "+powerupPecentage+"%, "+barBackgroundColor+" "+powerupPecentage+"%)";
    }
}

/**
 * Draw the menu
 */
function drawMenu() {
    var menu = document.createElement("div");
    menu.classList.add("menu");

    // Back button
    var menuBackButton = document.createElement("div");
    menuBackButton.innerHTML = "<i class='fas fa-hand-point-left'></i>";
    menuBackButton.classList.add("menu-button");
    menuBackButton.classList.add("menu-button-back");
    menu.appendChild(menuBackButton);

    // Main menu frame
    var menuFrame = document.createElement("menu-frame");
    menuFrame.classList.add("menu-frame");
    menuFrame.classList.add("menu-frame-main");

    var menuTitle = document.createElement("div");
    menuTitle.classList.add("menu-title");
    menuTitle.innerText = "Cocoa Town";
    menuFrame.appendChild(menuTitle);

    var menuSubtitle = document.createElement("div");
    menuSubtitle.classList.add("menu-subtitle");
    menuSubtitle.innerText = "";
    menuFrame.appendChild(menuSubtitle);

    var menuButtons = document.createElement("div");
    menuButtons.classList.add("menu-buttons");
    
    var menuPlayButton = document.createElement("div");
    menuPlayButton.innerHTML = "<i class='fas fa-play'></i>";
    menuPlayButton.classList.add("menu-button");
    menuPlayButton.classList.add("menu-button-play");
    menuButtons.appendChild(menuPlayButton);

    var menuHomeButton = document.createElement("div");
    menuHomeButton.innerHTML = "<i class='fas fa-home'></i>";
    menuHomeButton.classList.add("menu-button");
    menuHomeButton.classList.add("menu-button-home");
    menuButtons.appendChild(menuHomeButton);

    var menuHighScoreButton = document.createElement("div");
    menuHighScoreButton.innerHTML = "<i class='fas fa-trophy'></i>";
    menuHighScoreButton.classList.add("menu-button");
    menuHighScoreButton.classList.add("menu-button-hi-scores");
    menuButtons.appendChild(menuHighScoreButton);

    var menuInstructionsButton = document.createElement("div");
    menuInstructionsButton.innerHTML = "<i class='fas fa-info-circle'></i>";
    menuInstructionsButton.classList.add("menu-button");
    menuInstructionsButton.classList.add("menu-button-credits");
    menuButtons.appendChild(menuInstructionsButton);

    var menuCreditsButton = document.createElement("div");
    menuCreditsButton.innerHTML = "<i class='far fa-copyright'></i>";
    menuCreditsButton.classList.add("menu-button");
    menuCreditsButton.classList.add("menu-button-credits");
    menuButtons.appendChild(menuCreditsButton);

    menuFrame.appendChild(menuButtons);

    menu.appendChild(menuFrame);

    // Credits menu frame
    menuFrame = document.createElement("menu-frame");
    menuFrame.classList.add("menu-frame");
    menuFrame.classList.add("menu-frame-credits");

    var menuTitle = document.createElement("div");
    menuTitle.classList.add("menu-title");
    menuTitle.innerText = "Credits";
    menuFrame.appendChild(menuTitle);

    var credits = document.createElement("div");
    credits.classList.add("menu-credits");
    credits.innerHTML = "Concept, Art, Programming: James Grams<br>\
    Music: Kasey Grams<br>\
    Icons: <a target='blank' rel='noopener' href='https://fontawesome.com/'>Font Awesome</a><br>\
    Fonts: <a target='blank' rel='noopener' href='https://fonts.google.com/specimen/Crimson+Text'>Crimson Text by Sebastian Kosch</a>, <a target='blank' rel='noopener' href='https://fonts.google.com/specimen/Acme'>Acme by Huerta Tipográfica</a><br>\
    <a class='menu-credits-game103' target='blank' rel='noopener' href='https://game103.net'><img src='https://game103.net/images/logo2016.png'/><br>© 2019 Game 103</a>";
    menuFrame.appendChild(credits);
    
    menu.appendChild(menuFrame);

    // Instructions menu frame
    menuFrame = document.createElement("menu-frame");
    menuFrame.classList.add("menu-frame");
    menuFrame.classList.add("menu-frame-instructions");

    var menuTitle = document.createElement("div");
    menuTitle.classList.add("menu-title");
    menuTitle.innerText = "Instructions";
    menuFrame.appendChild(menuTitle);

    var instructions = document.createElement("div");
    instructions.classList.add("menu-instructions");
    instructions.innerHTML = "Help Cocoa deliver Ice Cream to houses across town while avoiding the angry tennis balls.\
    <div class='menu-instructions-sub-title'>Move</div>\
    <div class='menu-instructions-column'><div class='menu-instructions-key'><i class='fas fa-caret-up'></i></div><div class='menu-instructions-key'><i class='fas fa-caret-left'></i></div><div class='menu-instructions-key'><i class='fas fa-caret-down'></i></div><div class='menu-instructions-key'><i class='fas fa-caret-right'></i></div></div>\
    <div class='menu-instructions-column'><div class='menu-instructions-key'>W</div><div class='menu-instructions-key'>A</div><div class='menu-instructions-key'>S</div><div class='menu-instructions-key'>D</div></div>\
    <div class='menu-instructions-column menu-instructions-column-hand'><i class='fas fa-hand-point-up'></i></div>\
    <div class='menu-instructions-sub-title'>Follow your compass and note the house numbers to find your destination.</div>\
    <div class='menu-instructions-sub-title'>Powerups</div>";

    var powerupKeys = Object.keys(powerups);
    for( var i=0; i<powerupKeys.length; i++) {
        var container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        container.classList.add("menu-instructions-powerup-container");
        drawPowerup(powerupRadius, powerupRadius, powerupRadius, powerupKeys[i], container);

        instructions.appendChild(container);

        if( powerupKeys[i] == "big" ) {
            container.onmouseenter = function() {
                document.querySelector(".menu-instructions-powerup-description").innerText = "Become giant and earn double the points for deliveries.";
            };
        }
        else if( powerupKeys[i] == "small" ) {
            container.onmouseenter = function() {
                document.querySelector(".menu-instructions-powerup-description").innerText = "Shrink down to more easily avoid enemies.";
            };
        }
        else if( powerupKeys[i] == "invincible" ) {
            container.onmouseenter = function() {
                document.querySelector(".menu-instructions-powerup-description").innerText = "Gain invincibility from enemies.";
            };
        }
        else if( powerupKeys[i] == "fly" ) {
            container.onmouseenter = function() {
                document.querySelector(".menu-instructions-powerup-description").innerText = "Obtain the ability to fly through buildings.";
            };
        }
        else if( powerupKeys[i] == "speed" ) {
            container.onmouseenter = function() {
                document.querySelector(".menu-instructions-powerup-description").innerText = "Increase your movement speed to zip around town.";
            };
        }
    }

    var powerupDescription = document.createElement("div");
    powerupDescription.classList.add("menu-instructions-powerup-description");
    powerupDescription.innerText = "Hover over a powerup to see what it does!";

    instructions.appendChild(powerupDescription);

    menuFrame.appendChild(instructions);
    
    menu.appendChild(menuFrame);

    document.body.appendChild(menu);

    // Add the event listeners
    menuPlayButton.onclick = function() {
        if( getComputedStyle(document.querySelector(".menu")).opacity == 1 && this.offsetParent != null ) {
            togglePause();
        }
    }
    menuCreditsButton.onclick = function() {
        if( getComputedStyle(document.querySelector(".menu")).opacity == 1 && this.offsetParent != null ) {
            document.querySelector(".menu-frame-main").style.display = "none";
            document.querySelector(".menu-frame-credits").style.display = "block";
            document.querySelector(".menu-button-back").style.display = "block";
        }
    }
    menuInstructionsButton.onclick = function() {
        if( getComputedStyle(document.querySelector(".menu")).opacity == 1 && this.offsetParent != null ) {
            document.querySelector(".menu-frame-main").style.display = "none";
            document.querySelector(".menu-frame-instructions").style.display = "block";
            document.querySelector(".menu-button-back").style.display = "block";
        }
    }
    menuBackButton.onclick = function() {
        if( getComputedStyle(document.querySelector(".menu")).opacity == 1 && this.offsetParent != null ) {
            document.querySelector(".menu-frame-credits").style.display = "none";
            document.querySelector(".menu-frame-instructions").style.display = "none";
            document.querySelector(".menu-button-back").style.display = "none";
            document.querySelector(".menu-frame-main").style.display = "block";
        }
    }
}

/**
 * Draw the pause button
 */
function drawPause() {
    var pause = document.createElement("div");
    pause.classList.add("menu-button");
    pause.classList.add("pause-button");
    pause.innerHTML = "<i class='fas fa-play'></i>"; // We start out paused
    document.body.appendChild(pause);
    pause.onclick = togglePause;
}

/**
 * Check if it is safe to use/stop using a powerup
 * @param {number} sizeMultiplier - the new multiplier of the player size
 * @param {boolean} overrideFlying - whether or not override the default option that ignores building collisions if flying
 * @returns true if it is safe to use/stop using the powerup
 */
function powerupIsSafe(sizeMultiplier, overrideFlying ) {
    var newPlayerWidth = playerStartingWidth * sizeMultiplier;
    var newPlayerHeight = playerStartingHeight * sizeMultiplier;
    widthDifference = playerWidth - newPlayerWidth;
    heightDifference = playerHeight - newPlayerHeight;
    var newPlayerX = playerX + widthDifference/2;
    var newPlayerY = playerY + heightDifference/2;

    var playerObject = { x1: newPlayerX, y1: newPlayerY, x2: newPlayerX + newPlayerWidth, y2: newPlayerY + newPlayerHeight };

    var colliding = false;
    if( newPlayerX + newPlayerWidth > canvasWidth || newPlayerX < 0 ) {
        colliding = true;
    }
    else {
        if( !isFlying || overrideFlying ) {
            for(var i=0; i<objects.length;i++) {
                if( collisionTest(objects[i], playerObject) ) {
                    colliding = true;
                    break;
                }
            }
        }
    }

    return !colliding;
}

/**
 * Change the size of the player
 * @param {number} multiplier - the multipler from the original player size (the one which you start the game as)
 */
function changePlayerSize(multiplier) {
    var newPlayerWidth = playerStartingWidth * multiplier;
    var newPlayerHeight = playerStartingHeight * multiplier;

    widthDifference = playerWidth - newPlayerWidth;
    heightDifference = playerHeight - newPlayerHeight;

    playerX = playerX + widthDifference/2;
    playerY = playerY + heightDifference/2;
    playerWidth = newPlayerWidth;
    playerHeight = newPlayerHeight;

    var player = document.querySelector(".player");
    var transformStyle = "scale(" + multiplier + ")";

    if( player.classList.contains("player-flipped") ) {
        player.style.transform = transformStyle + "scaleX(-1)";
    }
    else {
        player.style.transform = transformStyle;
    }
}

/**
 * Become invincible
 * @param {number} time - the amount of time for the invincibility to last
 */
function obtainInvincibility(time) {
    powerups.invincible = time;
    document.querySelector(".player").classList.add("player-invincible");
}

/**
 * Draw a powerup
 * @param {number} x - the x coordinate of the CENTER of the powerup
 * @param {number} y - the y coordinate of the CENTER of the powerup
 * @param {number} radius - the radius of the powerup
 * @param {string} type - the type of powerup
 * @param {HTMLElement} container - the container on which to draw
 */
function drawPowerup(x, y, radius, type, container) {
    var powerupGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    powerupGroup.classList.add("powerup");

    // Since the enemy is mainly a circle, we'll have the x and y coordinates of the group
    // correspond to the center of the circle, not the top left like usual
    //var powerup = drawCircle(0, 0, radius, powerupGroup);
    var powerup = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    powerup.classList.add("powerup");
    powerup.classList.add("powerup-" + type);

    var points = [];
    for(var radians=0; radians<2*Math.PI; radians+=2*Math.PI/6) {
        var point = getPointOnCircumference( 0, 0, radius, radians );
        points.push(point[0] + "," + point[1]);
    }
    powerup.setAttribute("points", points.join(" "));

    powerupGroup.appendChild(powerup);

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    powerupGroup.appendChild(text);

    // Make sure these match the css
    if( type == "big" ) {
        text.innerHTML = "&#xf0d8;";
        text.setAttribute("x", -6);
        text.setAttribute("y", 6);
    }
    else if( type == "small" ) {
        text.innerHTML = "&#xf0d7;";
        text.setAttribute("x", -6);
        text.setAttribute("y", 8);
    }
    else if( type == "speed" ) {
        text.innerHTML = "&#xf70c;";
        text.setAttribute("x", -8);
        text.setAttribute("y", 7);
    }
    else if( type == "invincible" ) {
        text.innerHTML = "&#xf005;";
        text.setAttribute("x", -11.25);
        text.setAttribute("y", 7);
    }
    else if( type == "fly" ) {
        text.innerHTML = "&#xf072;";
        text.setAttribute("x", -10);
        text.setAttribute("y", 7);
    }
    
    container.appendChild(powerupGroup);
    powerupGroup.setAttribute("x", x);
    powerupGroup.setAttribute("y", y);

    return powerupGroup;
}

/**
 * Spawn Powerups
 * @param {number} powerupCount - the number of powerups to draw
 * @param {HTMLElement} container - the svg container on which to draw
 */
function spawnPowerups(powerupCount, container) {
    var playerObject = { x1: playerX - 20, y1: playerY - 20, x2: playerX + playerWidth + 20, y2: playerY + playerHeight + 20 };

    for( var i=0; i<powerupCount; i++ ) {

        var powerup;
        while( true ) {
            var x = Math.floor(Math.random() * (canvasWidth-600)/10) * 10 + 300;
            var y = Math.floor(Math.random() * (canvasHeight-600)/10) * 10 + 300;

            powerup = { x1: x - powerupRadius, y1: y - powerupRadius, x2: x + powerupRadius, y2: y+powerupRadius };
            var overlaps = false;
            for(var i=0; i<objects.length; i++) {
                var curOverlapObject = { x1: objects[i].x1-30, y1: objects[i].y1-60, x2: objects[i].x2+30, y2: objects[i].y2+playerAllowedHouseOverlap+20 };
                if( collisionTest(powerup, curOverlapObject) ) {
                    overlaps = true;
                }
            }
            // Add the extra spacing to the powerup here, since all the powerups are the same size
            var overlapPowerup = { x1: powerup.x1 - 50, y1: powerup.y1 - 50, x2: powerup.x1 + 50, y2: powerup.y2 + 50 };
            for(var i=0; i<powerupsOnScreen.length; i++) {
                if( collisionTest(overlapPowerup, powerupsOnScreen[i]) ) {
                    overlaps = true;
                }
            }
            if( collisionTest(playerObject, overlapPowerup) ) {
                overlaps = true;
            }
            if( !overlaps ) {
                powerup.type = Object.keys(powerups)[Math.floor(Math.random() * Object.keys(powerups).length)];
                var powerupShape = drawPowerup(x, y, powerupRadius, powerup.type, container);
                powerup.shape = powerupShape;
                powerupsOnScreen.push(powerup);
                break;
            }
        }
    }
}

/**
 * Control the existence of powerups
 * (controls one "tick" of existence)
 */
function existPowerups() {
    var addPowerupCount = 0;
    for( var i=powerupsOnScreen.length-1; i>=0; i-- ) { // Go backwards since we can remove powerups
        var powerup = powerupsOnScreen[i];
        
        var playerObject = { x1: playerX + playerHitboxReduction, y1: playerY + playerHitboxReduction, x2: playerX + playerWidth - playerHitboxReduction, y2: playerY + playerHeight - playerHitboxReduction };

        if( collisionTest(powerup, playerObject) ) {
            if( powerup.type == "big" ) {
                changeWhenSafe.size = { "multiplier": 1.5, "function": function() {changePlayerSize(1.5);} };
                powerups.small = 0;
                powerups.big = powerupTicks;
            }
            else if( powerup.type == "small" ) {
                changeWhenSafe.size = { "multiplier": 0.5, "function": function() {changePlayerSize(0.5);} };
                powerups.big = 0;
                powerups.small = powerupTicks;
            }
            else if( powerup.type == "fly" ) {
                powerups.fly = powerupTicks;
                isFlying = true;
            }
            else if( powerup.type == "invincible" ) {
                obtainInvincibility(powerupTicks);
            }
            else if( powerup.type == "speed" ) {
                powerups.speed = powerupTicks;
            }
            // On collision, we no longer need to show the powerup.
            powerup.shape.parentNode.removeChild(powerup.shape);
            powerupsOnScreen.splice(i, 1);
            addPowerupCount ++;
        }
    }
    // Spawn another powerup
    spawnPowerups(addPowerupCount, document.querySelector(".world"));
}

/**
 * handle touch down or touch move events
 * @param {TouchEvent} e - the touch event
 */
function touchMove(e) {
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    var touch = e.touches[0];
    // left
    if( touch.clientX < width/3 ) {
        keyDown.right = false;
        keyDown.left = true;
    }
    // right
    else if(touch.clientX > width/3 * 2 ) {
        keyDown.left = false;
        keyDown.right = true;
    }
    else {
        keyDown.left = false;
        keyDown.right = false;
    }
    // down
    if( touch.clientY > height - 150 ) {
        keyDown.up = false;
        keyDown.down = true;
    }
    // up
    else if( touch.clientY < height - 300 ) {
        keyDown.down = false;
        keyDown.up = true;
    }
    else {
        keyDown.down = false;
        keyDown.up = false;
    }
}

/**
 * Reset/start the game
 */
function reset() {
    while( document.body.firstChild ) {
        document.body.removeChild(document.body.firstChild);
    }
    document.body.onkeydown = null;
    document.body.onkeyup = null;
    document.body.ontouchstart = null;
    document.body.ontouchmove = null;
    document.body.ontouchend = null;
    playerHealth = playerMaxHealth;
    playerScore = 0;
    frame = 1;
    if( playTimeout ) { clearTimeout(playTimeout); playTimeout = null; }
    currentBuilding = generateNextBuilding();
    currentDifficulty = 1;
    objects = [];
    enemyBuildings = [];
    enemies = [];
    powerupsOnScreen = [];
    stopped = true;
    playerWidth = playerStartingWidth;
    playerHeight = playerStartingHeight;
    playerX = canvasWidth/2 - playerWidth/2;
    playerY = canvasHeight/2 - playerHeight/2;
    worldHorizontalOffset = 0;
    worldVerticalOffset = 0;
    changeWhenSafe = {};
    isFlying = false;
    tickTimeoutSet = null;
    tickTimeoutRemaining = null;
    if( tickTimeout ) { clearTimeout(tickTimeout); tickTimeout = null; }
    keyDown = {};
    powerups = {
        "big": 0,
        "small": 0,
        "speed": 0,
        "invincible": 0,
        "fly": 0
    };
    drawWorld();
    tick();

    document.body.onkeydown = function(e) {keyDown[keyMap[e.which]] = true;};
    document.body.onkeyup = function(e) {
        keyDown[keyMap[e.which]] = false; // This is not for just press

        // On p press
        if( e.keyCode == 80 ) {
            togglePause();
        }
    };
    document.body.ontouchstart = function(e) {touchMove(e);};
    document.body.ontouchmove = function(e) {touchMove(e);};
    document.body.ontouchend = function(e) {
        keyDown.right = false;
        keyDown.left = false;
        keyDown.up = false;
        keyDown.down = false;
    }
}

// High scores

function loadHighScores(range, page, callback) {
    var url = loadHighScoresEndpoint + "?" + "game=" + highScoresGame + "&range=" + range + "&page=" + page;
    makeRequest("GET", url, callback);
}

// Get the most up to date username for our user (they may have change it elsewhere)
function getUsername(id, callback) {
    var url = loadHighScoresEndpoint + "?" + "id=" + id;
    makeRequest("GET", url, callback);
}

// Make a request to the high scores server
function makeRequest(type, url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if( this.readyState == 4 && this.status == 200 ) {
            if( callback ) { callback(); }
        }
    }    
    xhttp.open(type, url, true);
    xhttp.send();
}

////////// Main Program ////////////

// Movement
var fps = 30
var tickRate = 1000/fps; // every 33 ms ~ 30fps
var keyDown = {};
var keyMap = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    65: "left",
    87: "up",
    68: "right",
    83: "down"
};
var playerStartingWidth = 82;
var playerStartingHeight = 72;
var playerWidth;
var playerHeight;
var playerAllowedHouseOverlap = 60; // How much the player is allowed to overlap with the house
var worldHorizontalOffset;
var worldVerticalOffset;
var canvasWidth = 3000;
var canvasHeight = 3000;
// Simply the midpoint minus half the player's width/height (note, these values are in the css too)
var playerX;
var playerY;
var playerCanvasX = 2;
var playerCanvasY = 11;
var playerMaxHealth = 5;
var playerHealth;
var playerScore;
var playerInvincibilityTicks = 1500/fps; // 1.5 second of invinciblity when hit
var playerHitboxReduction = 10;
var dogMoveRate = 100;
var movementAmount = 10;
var frame;
var playTimeout;
var numBuildings = 25;
var currentBuilding; // Note: this is the INDEX (the house number is one more since house numbers don't start at 0)
var numEnemies = 7;
var enemyRadius = 15;
var enemySightedDistance = 400;
var enemyMovementAmount = 6;
var enemyPadding = 20; // Distance an enemy must remain from an object beyond a direct collision
var currentDifficulty;
var maxDifficulty = 25;
var objects; // Objects that the player can hit.
var enemyBuildings; // Enemies have a simpler set of objects - all squares, but still capable of hitting the player at any point (max roofOut < playerWidth)
var enemies; // enemies of the player
var powerupsOnScreen; // powerups on screen
var powerupRadius = 20;
var numPowerups = 3;
var stopped;
var tickTimeoutSet;
var tickTimeoutRemaining;
var tickTimeout;
var powerups;
var powerupTicks = 10000/fps; // ten seconds of powerup
var changeWhenSafe; // Powerup changes to make when safe to do so, keys for size and then other needed powerups
var isFlying;

var highScoresDomain = "https://game103.net/ws/scores/";
var highScoresGame = "ct";
var loadHighScoresEndpoint = highScoresDomain + "load_scores.php";

// make sure cocoaTownHighScore is not null
if( !localStorage.cocoaTownHighScore ) {
    localStorage.cocoaTownHighScore = 0;
}
// make sure cocoaTownCoins is not null
if( !localStorage.cocoaTownCoins ) {
    localStorage.cocoaTownCoins = 0;
}

reset();
document.oncontextmenu = new Function("return false;"); // disable right click

//play();
// Old dog
/**
 * d.push("M " + x + " " + (y+10));
d.push("C " + (x-5) + " " + (y+10) + "," + (x-10) + " " + (y) + "," + x + " " + y);
d.push("C " + (x) + " " + (y) + "," + (x+5) + " " + (y) + "," + (x+10) + " " + (y-10));
d.push("C " + (x+10) + " " + (y-10) + "," + (x+10) + " " + (y-14) + "," + (x+20) + " " + (y-14));
d.push("C " + (x+20) + " " + (y-14) + "," + (x+34) + " " + (y-14) + "," + (x+32) + " " + (y+7));
d.push("C " + (x+37) + " " + (y+20) + "," + (x+50) + " " + (y+10) + "," + (x+75) + " " + (y+15));
d.push("C " + (x+85) + " " + (y+20) + "," + (x+90) + " " + (y+35) + "," + (x+75) + " " + (y+35));
d.push("C " + (x+75) + " " + (y+35) + "," + (x+55) + " " + (y+40) + "," + (x+30) + " " + (y+35));
d.push("C " + (x+5) + " " + (y+35) + "," + (x+28) + " " + (y+15) + "," + (x) + " " + (y+10));
*/
// Do we need to move the legs up for when the are rotated, we adjusted frames 4&5 back legs for roatation on x - axis by 1.5..
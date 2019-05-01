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
    path.setAttribute("d", d.join(" ") );
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
    container.appendChild( leg );
    leg.classList.add("dog");

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+52;
    d.push("M " + (18+legOffset) + " " + (y+27));
    d.push("C " + (7+legOffset) + " " + (y+34) + "," + (9+legOffset) + " " + (y+44) + "," + (legOffset) + " " + (y+50));
    d.push("C " + (legOffset) + " " + (y+50) + "," + (-8+legOffset) + " " + (y+56) + "," + (legOffset) + " " + (y+56));
    d.push("C " + (legOffset) + " " + (y+58) + "," + (legOffset+27) + " " + (y+32) + "," + (22+legOffset) + " " + (y+24));
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
    container.appendChild( leg );
    leg.classList.add("dog");

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+52;
    d.push("M " + (17+legOffset) + " " + (y+27));
    d.push("C " + (7+legOffset) + " " + (y+34) + "," + (9+legOffset) + " " + (y+44) + "," + (8+legOffset) + " " + (y+55));
    d.push("C " + (2+legOffset) + " " + (y+56) + "," + (2+legOffset) + " " + (y+62) + "," + (12+legOffset) + " " + (y+60));
    d.push("C " + (13+legOffset) + " " + (y+58) + "," + (legOffset+19) + " " + (y+32) + "," + (22+legOffset) + " " + (y+24));
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
    container.appendChild( leg );
    leg.classList.add("dog");

    y = y + rotationYModifier;

    var leg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var legOffset = x+52;
    d.push("M " + (20+legOffset) + " " + (y+27));
    d.push("C " + (legOffset) + " " + (y+30) + "," + (35+legOffset) + " " + (y+25) + "," + (39.5+legOffset) + " " + (y+37));
    d.push("C " + (46+legOffset) + " " + (y+37) + "," + (44+legOffset) + " " + (y+41) + "," + (44+legOffset) + " " + (y+42));
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
    path.setAttribute("d", d.join(" "));
    bodyGroup.appendChild( path );
    path.classList.add("dog");

    drawCircle(x + 13, y-2, 1, bodyGroup);
    drawCircle(x+2, y+3, 3, bodyGroup);

    var ear = document.createElementNS("http://www.w3.org/2000/svg", "path");
    d = [];
    d.push("M " + (x+18) + " " + (y-5));
    d.push("C " + (x+22) + " " + (y+5) + "," + (x+22) + " " + (y+5) + "," + (x+26) + " " + (y-5));
    ear.setAttribute("d", d.join(" "));
    bodyGroup.appendChild( ear );
    ear.classList.add("dog");

    var tail = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    d.push("M " + (x+70) + " " + (y+15));
    d.push("C " + (x+70) + " " + (y+15) + "," + (x+78) + " " + (y+21) + "," + (x+96) + " " + (y+15));
    d.push("C " + (x+96) + " " + (y+15) + "," + (x+86) + " " + (y+22) + "," + (x+77) + " " + (y+21));
    tail.setAttribute("d", d.join(" "));
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
    leg.setAttribute("d", d.join(" "));
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
 * Draw a tree
 * @param {number} x - the x coordinate of the left of the tree
 * @param {number} y - the y coordinate of the BOTTOM of the tree
 * @param {HTMLElement} container - the svg container on which to draw
 */
function drawTree(x, y, container) {

    // Tree width is 55 (trunk width) (it goes a little further out in both directions though)
    // so middle of the tree is 27.5 

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    d.push("M " + (x) + " " + (y));
    d.push("C " + (x+12) + " " + (y-10) + "," + (x+14) + " " + (y-22) + "," + (x+15) + " " + (y-100));
    d.push("C " + (x+15) + " " + (y-100) + "," + (x+40) + " " + (y-100) + "," + (x+40) + " " + (y-100));
    d.push("C " + (x+41) + " " + (y-22) + "," + (x+43) + " " + (y-10) + "," + (x+55) + " " + (y));
    path.setAttribute("d", d.join(" "));
    path.classList.add("tree-trunk");
    container.appendChild( path );

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    var trunkHeightOffset = 20;
    d.push("M " + (x+27.5) + " " + (y-80+trunkHeightOffset));
    d.push("C " + (x) + " " + (y-60+trunkHeightOffset) + "," + (x-30) + " " + (y-110+trunkHeightOffset) + "," + (x-14) + " " + (y-130+trunkHeightOffset));
    d.push("C " + (x-30) + " " + (y-140+trunkHeightOffset) + "," + (x-25) + " " + (y-200+trunkHeightOffset) + "," + (x) + " " + (y-200+trunkHeightOffset));
    d.push("C " + (x+5) + " " + (y-230+trunkHeightOffset) + "," + (x+50) + " " + (y-230+trunkHeightOffset) + "," + (x+55) + " " + (y-200+trunkHeightOffset));
    d.push("C " + (x+80) + " " + (y-200+trunkHeightOffset) + "," + (x+85) + " " + (y-140+trunkHeightOffset) + "," + (x+69) + " " + (y-130+trunkHeightOffset));
    d.push("C " + (x+85) + " " + (y-110+trunkHeightOffset) + "," + (x+55) + " " + (y-60+trunkHeightOffset) + "," + (x+27.5) + " " + (y-80+trunkHeightOffset));
    path.setAttribute("d", d.join(" "));
    path.classList.add("tree");
    container.appendChild( path );
}

/**
 * Draw flowers
 */
function drawFlowers(x, y, container) {
    var flower1 = drawCircle( x-flowerRadius, y-flowerRadius/2, flowerRadius, container );
    flower1.classList.add("flowers");
    flower1.style.fill = getRandomColor();
    var flower2 = drawCircle( x+flowerRadius, y-flowerRadius/2, flowerRadius, container );
    flower2.classList.add("flowers");
    flower2.style.fill = getRandomColor();
    var flower3 = drawCircle( x, y+flowerRadius/2, flowerRadius, container );
    flower3.classList.add("flowers");
    flower3.style.fill = getRandomColor();
}

/**
 * Draw a rectange
 * @param {number} width - the width of the house
 * @param {number} height - the height of the house
 * @param {number} x - the x coordinate of the house
 * @param {number} y - the y coordinate of the house
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns information about the roof (out and height) and door 
 */
function drawCocoaHouse(width, height, x, y, container) {

    // draw the main house body
    var rectangle = drawRectangle(width, height, x, y, container);
    rectangle.classList.add("cocoa-house");

    drawBricks( width, height, x, y, container, 100, 30 );

    // draw the roof
    var roofOut = width/10;
    var roofHeight = height/1.5;
    var roof = drawPath( [ [x-roofOut, y], [x+width/2, y-roofHeight], [x+width+roofOut, y] ], container, true );
    roof.classList.add("cocoa-house");

    var roofSliding = 15;
    var roof = drawPath( [ [x-roofOut, y], [x+width/2, y-roofHeight], [x+width+roofOut, y], [x+width-roofSliding+roofOut, y], [x+width/2, y-roofHeight+roofSliding], [x-roofOut+roofSliding, y] ], container, true );
    roof.classList.add("cocoa-house-roof");

    var roofBar = drawPath( [ [x-roofOut+roofSliding+31, y-30], [x+width+roofOut-roofSliding-31, y-30] ], container, true );
    roofBar.classList.add("brick");

    // draw the entrance
    var entranceWidth = 50;
    var entranceHeight = 70;
    var entranceX = x+width/2 - 25;
    var entranceY = y+(height-70);
    var entrance = drawRectangle(entranceWidth, entranceHeight, entranceX, entranceY, container);
    entrance = drawCircle(x+width/2, y+(height-70), 25, container);

    // draw the label
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.classList.add("cocoa-house-text");
    text.setAttribute("x", x+width/2);
    text.setAttribute("y", y+5);
    text.innerHTML = "Cocoa";
    container.appendChild(text);
    var textWidth = text.getBBox().width;
    text.setAttribute("x", x+width/2 - textWidth/2);

    var textBorder = drawRectangle(textWidth+ 10, 30, text.getAttribute("x") - 5, text.getAttribute("y") - 22, container);
    container.removeChild(text);
    container.appendChild(text);
    textBorder.classList.add("cocoa-house-text-border");

    return { roofOut: roofOut, roofHeight: roofHeight, door: { x1: entranceX, x2: entranceX + entranceWidth, y1: entranceY, y2: entranceY + entranceHeight } };
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
    path.setAttribute("d", d.join(" "));
    enemyGroup.appendChild( path );

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    d.push("M " + (leftTopCoordinates[0]) + " " + (leftTopCoordinates[1]));
    d.push("C " + (leftTopCoordinates[0]+6) + " " + (leftTopCoordinates[1]+5) + "," + (leftBottomCoordinates[0]+6) + " " + (leftBottomCoordinates[1]-5) + "," + (leftBottomCoordinates[0]) + " " + (leftBottomCoordinates[1]));
    path.setAttribute("d", d.join(" "));
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

    // draw cocoa house
    var cocoaHouseWidth = 140;
    var cocoaHouseHeight = 120;
    var cocoaHouseX = playerX - cocoaHouseWidth/2 + playerWidth/2;
    var cocoaHouseY = playerY - 100;
    var cocoaHouseInfo = drawCocoaHouse( cocoaHouseWidth, cocoaHouseHeight, cocoaHouseX, cocoaHouseY, container );
    var cocoaHouse = { special: "Cocoa", x1: cocoaHouseX, x2: cocoaHouseX + cocoaHouseWidth, y1: cocoaHouseY, y2: cocoaHouseY + cocoaHouseHeight - playerAllowedHouseOverlap, door: cocoaHouseInfo.door };
    objects.push( cocoaHouse );
    enemyBuildings.push(JSON.parse(JSON.stringify(cocoaHouse)));
    enemyBuildings[0].y2 += playerAllowedHouseOverlap;
    enemyBuildings[0].x1 = enemyBuildings[0].x1 - cocoaHouseInfo.roofOut;
    enemyBuildings[0].x2 = enemyBuildings[0].x2 + cocoaHouseInfo.roofOut;
    enemyBuildings[0].y1 = enemyBuildings[0].y1 - cocoaHouseInfo.roofHeight;

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
            for(var j=0; j<objects.length; j++) {
                var curOverlapObject = { x1: objects[j].x1-80, y1: objects[j].y1-110, x2: objects[j].x2+80, y2: objects[j].y2+playerAllowedHouseOverlap+110 };
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
        if( a.special ) return -1;
        if( b.special ) return 1;
        if( a.y1 < b.y1 ) return -1;
        if( a.y1 > b.y1 ) return 1;
        if( a.x1 < b.x1 ) return -1;
        if( a.x1 > b.x1 ) return 1;
        return 0;
    } );

    var roofBarrierHeight = 5;

    addRoofObjects(cocoaHouseX, cocoaHouseY, cocoaHouseWidth, cocoaHouseInfo.roofOut, cocoaHouseInfo.roofHeight, 0, roofBarrierHeight);
    
    var houseNumber = 1;
    for( var i=1; i<numBuildings+1; i++ ) {
        var buildingResponse = drawBuilding( objects[i].x2 - objects[i].x1, objects[i].y2-objects[i].y1+playerAllowedHouseOverlap, objects[i].x1, objects[i].y1, container, houseNumber );
        // Add the roof to the objects
        addRoofObjects(objects[i].x1, objects[i].y1, objects[i].x2 - objects[i].x1, buildingResponse.roofOut, buildingResponse.roofHeight, objects[i].x2 - objects[i].x1, roofBarrierHeight);

        enemyBuildings[i].x1 = enemyBuildings[i].x1 - buildingResponse.roofOut;
        enemyBuildings[i].x2 = enemyBuildings[i].x2 + buildingResponse.roofOut;
        enemyBuildings[i].y1 = enemyBuildings[i].y1 - buildingResponse.roofHeight;
        objects[i].houseNumber = houseNumber;
        objects[i].door = buildingResponse.door;
        houseNumber ++;
    }

    var worldOverlay =document.createElementNS("http://www.w3.org/2000/svg", "svg");
    worldOverlay.classList.add("world-overlay");
    for(var y=200; y<canvasHeight+200; y+=200) {
        for( var x = 0; x <= 900; x+=120) {
            // 55 (tree width) - 15 = 40
            drawTree( (x-900)-15 + Math.random() * 60, y + Math.random() * 100, worldOverlay );
            drawTree( x+canvasWidth-40 + Math.random() * 60, y + Math.random() * 100, worldOverlay );
        }
    }
    for(var x=60-900; x<canvasWidth-30+900; x+=120) {
        for( var y = 0; y <= 600; y+=200) {
            // 200 (tree height) - 60 = 140
            drawTree( x + Math.random() * 60, (y-600)+60 - Math.random() * 100, container );
            drawTree( x + Math.random() * 60, canvasHeight+140+y + Math.random() * 100, worldOverlay );
        }
    }

    spawnFlowers(numFlowers, container);
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

    document.body.appendChild(worldOverlay);

    drawBar();
    drawMenu();
}

function addRoofObjects(buildingX, buildingY, buildingWidth, roofOut, roofHeight, roofEndingWidth, roofBarrierHeight) {
    var startingWidth = roofOut * 2 + buildingWidth;

    for(var i=roofBarrierHeight; i<=roofHeight; i+=roofBarrierHeight) {
        // at i == roofHeight equals, the width is 0...

        var percentToTop = i/roofHeight;
        var currentWidth = (startingWidth - roofEndingWidth) - (startingWidth - roofEndingWidth)*percentToTop + roofEndingWidth;
        var currentOffset = (startingWidth-currentWidth)/2;

        // We draw a rectangular object, starting in the top left corner
        // This object will not exceed the boundaries of the roof
        // its top side will hit the horizontal boundaries of the roof
        // and it will go directly down
        // since currentWidth is calculated to hit both sides from the TOP
        objects.push( {
            x1: buildingX - roofOut + currentOffset,
            x2: buildingX - roofOut + currentOffset + currentWidth,
            y1: buildingY - i,
            y2: buildingY - (i+roofBarrierHeight),
        } );
    }
}

/**
 * Spawn enemies
 * @param {number} enemyCount - the number of enemies to add
 * @param {HTMLElement} container - the svg canvas to add the enemies to
 */
function spawnEnemies(enemyCount, container) {
    var playerObject = { x1: playerX - spawnPlayerPadding, y1: playerY - spawnPlayerPadding, x2: playerX + playerWidth + spawnPlayerPadding, y2: playerY + playerHeight + spawnPlayerPadding };

    for( var i=0; i<enemyCount; i++ ) {

        var enemy;
        while( true ) {
            var x = Math.floor(Math.random() * (canvasWidth-600)/10) * 10 + 300;
            var y = Math.floor(Math.random() * (canvasHeight-600)/10) * 10 + 300;

            enemy = { x1: x - enemyRadius, y1: y - enemyRadius, x2: x + enemyRadius, y2: y+enemyRadius };
            var overlaps = false;
            for(var j=0; j<objects.length; j++) {
                var curOverlapObject = { x1: objects[j].x1-spawnOverlapHorizontal, y1: objects[j].y1-spawnOverlapUp, x2: objects[j].x2+spawnOverlapHorizontal, y2: objects[j].y2+playerAllowedHouseOverlap+spawnOverlapDown };
                if( collisionTest(enemy, curOverlapObject) ) {
                    overlaps = true;
                }
            }
            // Add the extra spacing to the current enemy here, since all the enemies are the same size
            var overlapEnemy = { x1: enemy.x1 - 50, y1: enemy.y1 - 50, x2: enemy.x2 + 50, y2: enemy.y2 + 50 };
            for(var j=0; j<enemies.length; j++) {
                if( collisionTest(overlapEnemy, enemies[j]) ) {
                    overlaps = true;
                }
            }
            // Really don't get close to the player
            overlapEnemy = { x1: enemy.x1 - enemySightedDistanceX - 50, y1: enemy.y1 - enemySightedDistanceY - 50, x2: enemy.x2 + enemySightedDistanceX + 50, y2: enemy.y2 + enemySightedDistanceY + 50 };
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
    if( (playerX + playerWidth - amount > canvasWidth && amount < 0) || (playerX - amount < 0 && amount > 0) ) {
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
        document.querySelector(".world-overlay").style.left = world.style.left;
        playerX -= amount;
    }
    else {
        if( amount > 0 && amount-1 > 0 ) {
            moveHorizontal(amount-1);
        }
        else if( amount < 0 && amount+1 < 0 ) {
            moveHorizontal(amount+1);
        }
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
    if( ( playerY + playerHeight - amount > canvasHeight && amount < 0 ) || ( playerY - amount < 0 && amount > 0) ) {
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
        document.querySelector(".world-overlay").style.top = world.style.top;
        playerY -= amount;
    }
    else {
        if( amount > 0 && amount-1 > 0 ) {
            moveVertical(amount-1);
        }
        else if( amount < 0 && amount+1 < 0 ) {
            moveVertical(amount+1);
        }
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

        if( (keyDown['up'] || keyDown['down']) && ( keyDown['left'] || keyDown['right'] ) ) {
            curMoveAmount = curMoveAmount/Math.abs(curMoveAmount) * Math.sqrt( curMoveAmount**2/2 );
        }
        if( keyDown['up'] ) {
            moveVertical(curMoveAmount);
        }
        else if( keyDown['down'] ) {
            moveVertical(-curMoveAmount);
        }
        if( keyDown['left'] ) {
            moveHorizontal(curMoveAmount);
        }
        else if( keyDown['right'] ) {
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
                    changeWhenSafe.fly = { "multiplier": null, "function": function() {isFlying = false;} };
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
        
        var enemySightedObject = { x1: enemy.x1 - enemySightedDistanceX, x2: enemy.x2 + enemySightedDistanceX, y1: enemy.y1 - enemySightedDistanceY, y2: enemy.y2 + enemySightedDistanceY };
        var playerObject = { x1: playerX + playerHitboxReduction, y1: playerY + playerHitboxReduction, x2: playerX + playerWidth - playerHitboxReduction, y2: playerY + playerHeight - playerHitboxReduction };
        // TODO add interaction functions
        // TODO add store
        // TODO testing
        // TODO - mobile house place items.. touch events
        // TODO cocoa memorial videos
        // TODO move mode not always working? It is the mary poppins book i think...

        // If this hits the player
        if( !powerups.invincible && collisionTest(enemy, playerObject) ) {
            playerHealth --;
            
            if( !mute ) {
                // Play a random bark sound sound
                var track = Math.floor( Math.random() * barkAudio.length );
                barkAudio[track].play();
            }

            if( playerHealth <= 0 ) {
                var oldScore = playerScore;

                unsubmittedHighscores[new Date().getTime()] = oldScore; // Add this score to the list of unsubmitted globalscores
                localStorage.cocoaTownUnsubmittedHighscores = JSON.stringify(unsubmittedHighscores);

                reset(); // You lose!
                document.querySelector(".menu-subtitle").innerText = "Game over! You scored " + oldScore + ".";
                
                // Submit high scores
                submitScores();

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
 * Submit high scores
 */
function submitScores() {
    // Submit the score with a sanity check for having a game 103 ID
    if( localStorage.game103Id ) {
        var funcs = [];

        // for each of the unsubmitted high scores
        var unsubmittedHighscoresKeys = Object.keys(unsubmittedHighscores);
        for( var i=0; i<unsubmittedHighscoresKeys.length; i++ ) {
            // Create functions so that we have closures
            // https://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example/19323214#19323214
            funcs.push ( function(index) { addScore( localStorage.game103Id, unsubmittedHighscores[unsubmittedHighscoresKeys[index]], 
                function(response) {
                    console.log( "Successfully submitted score of " + unsubmittedHighscores[unsubmittedHighscoresKeys[index]] + " for " + game103Username + " (" + localStorage.game103Id + ")" ); 
                    delete unsubmittedHighscores[unsubmittedHighscoresKeys[index]];
                    localStorage.cocoaTownUnsubmittedHighscores = JSON.stringify(unsubmittedHighscores);
                }, 
                function() { 
                    console.log("failed to submit score") 
                } 
            ) }.bind(this, i) );

        }

        // Now run the functions
        for( var i=0; i<unsubmittedHighscoresKeys.length; i++ ) {
            funcs[i]();
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

    if( xMove && yMove ) {
        var diagonal = Math.sqrt( enemyMovementAmount**2/2 );
        xMove = xMove/Math.abs(xMove) * diagonal;
        yMove = yMove/Math.abs(yMove) * diagonal;
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
    if( currentDifficulty < maxDifficulty ) {
        currentDifficulty ++;

        enemyMovementAmount += 0.05; // So the max movement amount is 8.5

        // We have 49 increase to get to max
        var xSightIncrease = maxSightedDistanceXIncrease/(maxDifficulty-1);
        enemySightedDistanceX += xSightIncrease;
        enemySightedDistanceY += (xSightIncrease * (9/16));
        
        if(currentDifficulty % 10 == 0) {
            spawnEnemies(1, document.querySelector(".world"));
        }
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

    if(xMove && yMove) {
        var diagonal = Math.sqrt( enemyMovementAmount**2/2 );
        xMove = xMove/Math.abs(xMove) * diagonal;
        yMove = yMove/Math.abs(yMove) * diagonal;
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

    if( xCollided && !yCollided && yMove ) {
        moveEnemy({x: 0, y: yMove/Math.abs(yMove) * (enemyMovementAmount - diagonal)}, enemy);
    }
    else if ( yCollided && !xCollided && xMove ) {
        moveEnemy({x: xMove/Math.abs(xMove) * (enemyMovementAmount - diagonal), y:0}, enemy);
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
    var nextBuilding = Math.floor(Math.random() * numBuildings) + 1; // +1 for no Cocoa House
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

        if( !mute ) {
            // Play a random delivery sound sound
            var track = Math.floor( Math.random() * deliveryAudio.length );
            deliveryAudio[track].play();
        }

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
    if( !document.querySelector(".pause-button") ) { // Draw the pause button on the first pause
        drawPause();
    }
    if( stopped ) {
        setTimeout(tick, tickTimeoutRemaining);
        stopped = false;
        document.querySelector(".menu").classList.add("menu-hidden");
        document.querySelector(".bar").style.opacity = 1;
        document.querySelector(".pause-button").innerHTML = "<i class='fas fa-pause'></i>";
        playMainTheme();
    }
    else {
        returnToMainMenuScreen(); // Make sure we always unpause to the main screen
        // Get exactly the frame we are on when we pause, so we can resume at that frame
        tickTimeoutRemaining = tickRate - (Date.now() - tickTimeoutSet);
        stopped = true;
        document.querySelector(".menu-subtitle").innerText = "Paused";
        document.querySelector(".bar").style.opacity = 0;
        document.querySelector(".menu").classList.remove("menu-hidden");
        document.querySelector(".pause-button").innerHTML = "<i class='fas fa-play'></i>";
        stopMainTheme();
    }
}

/**
 * Toggle between muted and unmuted
 */
function toggleMute() {
    if(mute) {
        mute = false;
        if( document.querySelector(".menu").classList.contains("menu-hidden") ) {
            playMainTheme();
        }
        document.querySelector(".mute-button").innerHTML = "<i class='fas fa-volume-up'></i>";
    }
    else {
        mute = true;
        stopMainTheme();
        document.querySelector(".mute-button").innerHTML = "<i class='fas fa-volume-mute'></i>";
    }
}

/**
 * Stop the main theme song
 */
function stopMainTheme() {
    if( mainTheme.readyState >= 3 ) {
        mainTheme.pause();
    }
    else {
        mainTheme.removeEventListener('canplaythrough', playMainThemeAfterReady, false); 
    }
}

/**
 * Play the main theme song
 */
function playMainTheme() {
    if( !mute && document.querySelector(".menu").classList.contains("menu-hidden") ) {
        if( mainTheme.readyState >= 3 ) {
            mainTheme.play();
        }
        else {
            mainTheme.addEventListener('canplaythrough', playMainThemeAfterReady, false);
        }
    }
}

/**
 * Play the main music theme
 */
function playMainThemeAfterReady() {
    if( !mute && document.querySelector(".menu").classList.contains("menu-hidden") ) {
        mainTheme.play();
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
    document.querySelector(".bar-deliver").innerText = (currentBuilding) // house number no longer needs +1, since cocoa house being first provides the offset (house number 1 = objects[1])

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

    var muteButton = document.createElement("div");
    muteButton.classList.add("menu-button");
    muteButton.classList.add("mute-button");
    menuFrame.appendChild(muteButton);
    muteButton.onclick = toggleMute;

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
    credits.innerHTML = "Concept, Art, Programming, Human Sounds: James Grams<br>\
    Music, Human Sounds: Kasey Grams<br>\
    Icons: <a target='blank' rel='noopener' href='https://fontawesome.com/'>Font Awesome</a><br>\
    Fonts: <a target='blank' rel='noopener' href='https://fonts.google.com/specimen/Crimson+Text'>Crimson Text by Sebastian Kosch</a>, <a target='blank' rel='noopener' href='https://fonts.google.com/specimen/Acme'>Acme by Huerta Tipográfica</a><br>\
    Barking Sounds: <a target='blank' rel='noopener' href='https://www.youtube.com/c/crazymonkeymusic'>Crazy Monkey</a><br>\
    <a class='menu-credits-game103' target='blank' rel='noopener' href='https://game103.net'><img src='resources/logo.png'/><br>© 2019 Game 103 (game103.net)</a>";
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

    // High scores menu frame
    menuFrame = document.createElement("menu-frame");
    menuFrame.classList.add("menu-frame");
    menuFrame.classList.add("menu-frame-high-scores");

    var menuTitle = document.createElement("div");
    menuTitle.classList.add("menu-title");
    menuTitle.innerText = "High Scores";
    menuFrame.appendChild(menuTitle);

    var menuHighScoresTimes = document.createElement("div");
    menuHighScoresTimes.classList.add("menu-high-scores-times");

    var ranges = ["day", "week", "month", "year", "all"];
    for( var i=0; i<ranges.length; i++ ) {
        var menuHighScoresTimeButton = document.createElement("div");
        menuHighScoresTimeButton.classList.add("menu-high-scores-time-button");
        menuHighScoresTimeButton.classList.add("menu-button");
        menuHighScoresTimeButton.innerText = ranges[i].charAt(0).toUpperCase() + ranges[i].slice(1);

        menuHighScoresTimeButton.onclick = function() {

            if( !this.classList.contains("menu-high-scores-time-button-selected") ) {

                var curSelected = document.querySelector(".menu-high-scores-time-button-selected");
                if( curSelected ) {
                    curSelected.classList.remove("menu-high-scores-time-button-selected");
                }
                this.classList.add("menu-high-scores-time-button-selected");

                var highScoresTable = document.querySelector(".menu-high-scores-table");
                highScoresTable.innerHTML = "<i class='fas fa-spinner'></i>";

                // On scroll bottom, load new results
                highScoresTable.onscroll = function() {
                    requestCount = requestCount ++;
                    var myRequestCount = requestCount;

                    if( this.scrollHeight - this.scrollTop == this.clientHeight ) {
                        currentHighScoresPage ++;
                        loadHighScores( this.innerText.toLowerCase(), currentHighScoresPage, function(response) {
                            // If we are still on this request (haven't moved to another tab)
                            if( requestCount == myRequestCount ) {
                                try {
                                    var jsonResponse = JSON.parse(response);
                                    if( jsonResponse.results && jsonResponse.results.length ) {
                                        console.log("Got more results");
                                        addResults(jsonResponse.results);
                                    }
                                    // There are no more results
                                    else {
                                        console.log("No more results");
                                        highScoresTable.onscroll = function() {return false;};
                                    }
                                }
                                catch(err) {
                                    console.log("More results parse error");
                                    console.log(err);
                                    highScoresTable.onscroll = function() {return false;};
                                }
                            }
                        }, function() { 
                            console.log("An error occured loading more scores");
                            highScoresTable.onscroll = function() {return false;};
                        } );
                    }
                };

                requestCount = requestCount ++;
                var myRequestCount = requestCount;

                currentHighScoresPage = 1;

                loadHighScores( this.innerText.toLowerCase(), currentHighScoresPage, function(response) {
                    // If we are still on this request (haven't moved to another tab)
                    if( requestCount == myRequestCount ) {
                        try {
                            var jsonResponse = JSON.parse(response);
                            if( jsonResponse.results && jsonResponse.results.length ) {
                                console.log("Got results");
                                highScoresTable.innerHTML = "";
                                addResults(jsonResponse.results);
                            }
                            else {
                                menuHighScoresTable.innerText = "There are no high scores for this time period.";
                            }
                        }
                        catch(err) {
                            menuHighScoresTable.innerText = "Sorry, an error occurred parsing scores.";
                            console.log("An error occured parsing scores");
                            console.log(err);
                        }
                    }
                }, function() { 
                    menuHighScoresTable.innerText = "Sorry, an error occurred loading scores."; 
                    console.log("An error occured loading scores");
                } );
            }
        };

        menuHighScoresTimes.appendChild(menuHighScoresTimeButton);
    }

    menuFrame.appendChild(menuHighScoresTimes);

    var menuHighScoresTable = document.createElement("div");
    menuHighScoresTable.classList.add("menu-high-scores-table");
    menuFrame.appendChild(menuHighScoresTable);

    var menuHighScoresInfoSection = document.createElement("div");
    menuHighScoresInfoSection.classList.add("menu-high-scores-info");

    var menuHighScoresInfoLocalHigh = document.createElement("div");
    menuHighScoresInfoLocalHigh.classList.add("menu-high-scores-info-local-high-score");
    menuHighScoresInfoLocalHigh.innerText = localStorage.cocoaTownHighScore ? localStorage.cocoaTownHighScore : 0;
    menuHighScoresInfoSection.appendChild(menuHighScoresInfoLocalHigh);

    var menuHighScoresInfoUsername = document.createElement("div");
    menuHighScoresInfoUsername.classList.add("menu-high-scores-info-username");
    if( game103Username ) {
        menuHighScoresInfoUsername.innerText = game103Username;
    }
    menuHighScoresInfoSection.appendChild(menuHighScoresInfoUsername);

    var menuHighScoreAccountChangeInfo = document.createElement("div");
    menuHighScoreAccountChangeInfo.classList.add("menu-high-scores-info-account-change");
    menuHighScoresInfoSection.appendChild(menuHighScoreAccountChangeInfo);

    var menuHighScoreUsernameLabel = document.createElement("label");
    menuHighScoreUsernameLabel.classList.add("menu-high-scores-info-username-label");
    menuHighScoreUsernameLabel.innerHTML = "<span class='menu-high-scores-info-username-label-text'>Username:</span>";
    var menuHighScoresUsernameInput = document.createElement("input");
    menuHighScoresUsernameInput.setAttribute("type", "text");
    menuHighScoresUsernameInput.setAttribute("minlength", "5");
    menuHighScoresUsernameInput.setAttribute("maxlength", "15");
    menuHighScoresUsernameInput.classList.add("menu-high-scores-info-username-input");
    menuHighScoreUsernameLabel.appendChild(menuHighScoresUsernameInput);

    menuHighScoresInfoSection.appendChild(menuHighScoreUsernameLabel);

    var menuHighScorePasswordLabel = document.createElement("label");
    menuHighScorePasswordLabel.classList.add("menu-high-scores-info-password-label");
    menuHighScorePasswordLabel.innerHTML = "<span class='menu-high-scores-info-username-label-text'>Password:</span>";
    var menuHighScoresPasswordInput = document.createElement("input");
    menuHighScoresPasswordInput.setAttribute("type", "password");
    menuHighScoresPasswordInput.setAttribute("minlength", "5");
    menuHighScoresPasswordInput.setAttribute("maxlength", "15");
    menuHighScoresPasswordInput.classList.add("menu-high-scores-info-password-input");
    menuHighScorePasswordLabel.appendChild(menuHighScoresPasswordInput);

    menuHighScoresInfoSection.appendChild(menuHighScorePasswordLabel);

    var menuHighScoreUpdateAccountButton = document.createElement("div");
    menuHighScoreUpdateAccountButton.classList.add("menu-button");
    menuHighScoreUpdateAccountButton.classList.add("menu-high-scores-time-button");
    menuHighScoreUpdateAccountButton.classList.add("menu-high-scores-info-update-account");
    menuHighScoreUpdateAccountButton.innerText = "Update";

    // Update the user's account
    menuHighScoreUpdateAccountButton.onclick = function() {
        if( localStorage.game103Id ) {
            setUpdateLoginLoading();
            updateUser( localStorage.game103Id, 
                document.querySelector(".menu-high-scores-info-username-input").value,
                document.querySelector(".menu-high-scores-info-password-input").value,
                function(response) {
                    try {
                        var jsonResponse = JSON.parse(response);
                        // Can't imagine a json response without a status
                        if( jsonResponse.status == "success" ) {
                            // We are on the high scores tab
                            if( document.querySelector(".menu-frame-high-scores").style.display == "block" ) {
                                // Refresh the frame (this will refetch the username and table)
                                document.querySelector(".menu-button-back").click();
                                document.querySelector(".menu-button-hi-scores").click();
                            }
                        }
                        setHighScoresMenuError( jsonResponse.status == "success" ? "Success! Account updated." : jsonResponse.message, jsonResponse.status );
                    }
                    catch(err) {
                        setHighScoresMenuError( null, "failure" );
                    }
                }, function() {
                    setHighScoresMenuError( null, "failure" );
                }
            );
        }
        else {
            setHighScoresMenuError( null, "failure" );
        }
    };

    menuHighScoresInfoSection.appendChild(menuHighScoreUpdateAccountButton);

    var menuHighScoreLoginButton = document.createElement("div");
    menuHighScoreLoginButton.classList.add("menu-button");
    menuHighScoreLoginButton.classList.add("menu-high-scores-time-button");
    menuHighScoreLoginButton.classList.add("menu-high-scores-info-login-account");
    menuHighScoreLoginButton.innerText = "Login";

    // Login to the user's account
    menuHighScoreLoginButton.onclick = function() {
        setUpdateLoginLoading();
        login( document.querySelector(".menu-high-scores-info-username-input").value,
            document.querySelector(".menu-high-scores-info-password-input").value,
            function(response) {
                try {
                    var jsonResponse = JSON.parse(response);
                    // Can't imagine a json response without a status
                    if( jsonResponse.status == "success" ) {
                        // Refresh the frame (this will refetch the username and table)
                        localStorage.game103Id = jsonResponse.id;
                        if( document.querySelector(".menu-frame-high-scores").style.display == "block" ) {
                            // Refresh the frame (this will refetch the username and table)
                            document.querySelector(".menu-button-back").click();
                            document.querySelector(".menu-button-hi-scores").click();
                        }
                    }
                    setHighScoresMenuError( jsonResponse.status == "success" ? "Success! Logged in." : jsonResponse.message, jsonResponse.status );
                }
                catch(err) {
                    setHighScoresMenuError( null, "failure" );
                }
            }, function() {
                setHighScoresMenuError( null, "failure" );
            }
        );
    };

    menuHighScoresInfoSection.appendChild(menuHighScoreLoginButton);

    menuFrame.appendChild(menuHighScoresInfoSection);

    menu.appendChild(menuFrame);

    document.body.appendChild(menu);
    resetHighScoresMenuMessage();

    // Add the event listeners
    menuPlayButton.onclick = function() {
        if( stopped ) {
            togglePause();
        }
    }
    menuHomeButton.onclick = function() {
        if( stopped ) {
            enterHouse();
        }
    }
    menuCreditsButton.onclick = function() {
        if( stopped ) {
            document.querySelector(".menu-frame-main").style.display = "none";
            document.querySelector(".menu-frame-credits").style.display = "block";
            document.querySelector(".menu-button-back").style.display = "block";
        }
    }
    menuInstructionsButton.onclick = function() {
        if( stopped ) {
            document.querySelector(".menu-frame-main").style.display = "none";
            document.querySelector(".menu-frame-instructions").style.display = "block";
            document.querySelector(".menu-button-back").style.display = "block";
        }
    }
    menuHighScoreButton.onclick = function() {
        if( stopped ) {
            document.querySelector(".menu-frame-main").style.display = "none";
            document.querySelector(".menu-frame-high-scores").style.display = "block";
            document.querySelector(".menu-button-back").style.display = "block";
            
            // refresh the tab we were on, or click the first tab if none selected
            var currentTabSelected = document.querySelector(".menu-high-scores-time-button-selected");
            if( !currentTabSelected ) {
                document.querySelector(".menu-high-scores-time-button").click();
            }
            else {
                currentTabSelected.classList.remove("menu-high-scores-time-button-selected");
                currentTabSelected.click();
            }

            // Reset the error message
            resetHighScoresMenuMessage();

            // Don't keep the password in the field
            document.querySelector(".menu-high-scores-info-username-input").value = "";
            document.querySelector(".menu-high-scores-info-password-input").value = "";

            // update the current username whenever we go to the tab for good measure
            // don't create new accounts on error here, only do that on start up to avoid excessive accounts.
            getUsername( localStorage.game103Id, function(response) {
                try {
                    var jsonResponse = JSON.parse(response);
                    game103Username = jsonResponse.username;
                    document.querySelector(".menu-high-scores-info-username").innerText = game103Username;
                }
                catch(err) {
                    console.log(err);
                }
            } );
        }
    }
    menuBackButton.onclick = function() {
        if( stopped ) {
            returnToMainMenuScreen();
        }
    }
    mute = !mute;
    toggleMute();
}

/**
 * Enter the dog house
 */
function enterHouse() {
    document.querySelector(".world").style.display = "none";
    document.querySelector(".player").style.display = "none";
    document.querySelector(".world-overlay").style.display = "none";
    if( document.querySelector(".pause-button") ) {
        document.querySelector(".pause-button").style.display = "none";
    }
    document.querySelector(".bar").style.display = "none";
    document.querySelector(".menu").style.display = "none";
    document.querySelector(".inside-house").style.display = "block";
    document.querySelector(".menu-button-inner-house.back-button").style.display = "block";
    document.querySelector(".menu-button-inner-house.inventory-button").style.display = "block";
    document.querySelector(".menu-button-inner-house.store-button").style.display = "block";
    document.querySelector(".store-menu").style.display = "block";
    document.querySelector(".inventory").style.display = "block";

    setMoveMode(false);
    placeHouseItems();
    drawInventory();
    updateStoreMoney(); // we probably got more money
}

/**
 * Leave the dog house
 */
function leaveHouse() {
    document.body.onmousemove = null;
    document.body.onmousedown = null;
    document.body.onmouseup = null;
    setMoveMode(false);
    document.querySelector(".inside-house").style.display = "none";
    document.querySelector(".menu-button-inner-house.back-button").style.display = "none";
    document.querySelector(".menu-button-inner-house.inventory-button").style.display = "none";
    document.querySelector(".menu-button-inner-house.store-button").style.display = "none";
    document.querySelector(".store-menu").style.display = "none";
    document.querySelector(".inventory").style.display = "none";
    document.querySelector(".world").style.display = "block";
    document.querySelector(".player").style.display = "block";
    document.querySelector(".world-overlay").style.display = "block";
    if( document.querySelector(".pause-button") ) {
        document.querySelector(".pause-button").style.display = "block";
    }
    document.querySelector(".bar").style.display = "block";
    document.querySelector(".menu").style.display = "block";
}

/**
 * Return to main screen
 */
function returnToMainMenuScreen() {
    document.querySelector(".menu-frame-credits").style.display = "none";
    document.querySelector(".menu-frame-instructions").style.display = "none";
    document.querySelector(".menu-frame-high-scores").style.display = "none";
    document.querySelector(".menu-button-back").style.display = "none";
    document.querySelector(".menu-frame-main").style.display = "block";
}

/**
 * Reset the high scores information menu message
 */
function resetHighScoresMenuMessage() {
    document.querySelector(".menu-high-scores-info-account-change").innerText = "Enter credentials to update your current account or login to another one.";
}

/**
 * Set an error message on the high scores view for update/login
 */
function setHighScoresMenuError(message, type) {
    if( type == "failure" && !message ) {
        message = "An error has occurred.";
    }
    var messageClass = type == "success" ? "message-success" : "message-failure";
    document.querySelector(".menu-high-scores-info-account-change").innerHTML = "<span class='"+messageClass+"'>"+message+"</span>";
}

/** Set loading for update or login */
function setUpdateLoginLoading() {
    document.querySelector(".menu-high-scores-info-account-change").innerHTML = "<i class='fas fa-spinner'></i>";
}

/**
 * Add results to the high scores table
 * @param {object} results - the results object from the high score server
 */
function addResults(results) {
    var highScoresTable = document.querySelector(".menu-high-scores-table");
    for( var i=0; i<results.length; i++ ) {

        var row = document.createElement("div");
        row.classList.add("menu-high-scores-table-row");

        var count = highScoresTable.querySelectorAll(".menu-high-scores-table-row").length + 1;

        var column = document.createElement("div");
        column.classList.add("menu-high-scores-table-column");
        column.innerText = count + ".";
        row.appendChild(column);

        column = document.createElement("div");
        column.classList.add("menu-high-scores-table-column");
        column.innerText = results[i].username;
        if( results[i].username == game103Username ) {
            column.innerText += " (You)";
        }
        row.appendChild(column);

        column = document.createElement("div");
        column.classList.add("menu-high-scores-table-column");
        column.innerText = results[i].score;
        row.appendChild(column);

        highScoresTable.appendChild(row);
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

    pause.ontouchstart = function(e) { pauseButtonIsPressed = true; };
    pause.onclick = togglePause;
    pause.ontouchend = function(e) { pauseButtonIsPressed = false; };
}

/**
 * Check if it is safe to use/stop using a powerup
 * @param {number} sizeMultiplier - the new multiplier of the player size
 * @param {boolean} overrideFlying - whether or not override the default option that ignores building collisions if flying
 * @returns true if it is safe to use/stop using the powerup
 */
function powerupIsSafe(sizeMultiplier, overrideFlying ) {
    // For flying we don't want to use the value we were when we got try flying powerup
    if( !sizeMultiplier ) {
        sizeMultiplier = powerups.big ? 1.5 : powerups.small ? 0.5 : 1
    }
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
    var playerObject = { x1: playerX - spawnPlayerPadding, y1: playerY - spawnPlayerPadding, x2: playerX + playerWidth + spawnPlayerPadding, y2: playerY + playerHeight + spawnPlayerPadding };

    for( var i=0; i<powerupCount; i++ ) {

        var powerup;
        while( true ) {
            var x = Math.floor(Math.random() * (canvasWidth-600)/10) * 10 + 300;
            var y = Math.floor(Math.random() * (canvasHeight-600)/10) * 10 + 300;

            powerup = { x1: x - powerupRadius, y1: y - powerupRadius, x2: x + powerupRadius, y2: y+powerupRadius };
            var overlaps = false;
            for(var j=0; j<objects.length; j++) {
                var curOverlapObject = { x1: objects[j].x1-spawnOverlapHorizontal, y1: objects[j].y1-spawnOverlapUp, x2: objects[j].x2+spawnOverlapHorizontal, y2: objects[j].y2+playerAllowedHouseOverlap+spawnOverlapDown };
                if( collisionTest(powerup, curOverlapObject) ) {
                    overlaps = true;
                }
            }
            // Add the extra spacing to the powerup here, since all the powerups are the same size
            var overlapPowerup = { x1: powerup.x1 - 50, y1: powerup.y1 - 50, x2: powerup.x2 + 50, y2: powerup.y2 + 50 };
            for(var j=0; j<powerupsOnScreen.length; j++) {
                if( collisionTest(overlapPowerup, powerupsOnScreen[j]) ) {
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
 * Spawn Flowers
 * @param {number} flowerCount - the number of flowers to draw
 * @param {HTMLElement} container - the svg container on which to draw
 */
function spawnFlowers(flowerCount, container) {
    for( var i=0; i<flowerCount; i++ ) {
        var flower;
        while( true ) {
            var x = Math.floor(Math.random() * (canvasWidth-300)/10) * 10 + 150;
            var y = Math.floor(Math.random() * (canvasHeight-300)/10) * 10 + 150;

            flower = { x1: x-flowerRadius*2, y1: y-flowerRadius, x2: x+flowerRadius*2, y2: y+flowerRadius };
            var overlaps = false;
            for(var j=0; j<objects.length; j++) {
                var curOverlapObject = { x1: objects[j].x1-spawnOverlapHorizontal, y1: objects[j].y1-spawnOverlapUp, x2: objects[j].x2+spawnOverlapHorizontal, y2: objects[j].y2+playerAllowedHouseOverlap+spawnOverlapDown };
                if( collisionTest(flower, curOverlapObject) ) {
                    overlaps = true;
                }
            }
            if( !overlaps ) {
                drawFlowers(x, y, container);
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
    var width = window.innerWidth;
    var height = window.innerHeight;
    var touch = e.touches[0];
    // left
    if( touch.clientX < width/6 ) {
        keyDown.right = false;
        keyDown.left = true;
    }
    // right
    else if(touch.clientX > width/6 * 5 ) {
        keyDown.left = false;
        keyDown.right = true;
    }
    else {
        keyDown.left = false;
        keyDown.right = false;
    }
    // down
    if( touch.clientY > height - 100 ) {
        keyDown.up = false;
        keyDown.down = true;
    }
    // up
    else if( touch.clientY < height - 200 ) {
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
    enemySightedDistanceX = 450;
    enemySightedDistanceY = 253;
    if( tickTimeout ) { clearTimeout(tickTimeout); tickTimeout = null; }
    keyDown = {};
    powerups = {
        "big": 0,
        "small": 0,
        "speed": 0,
        "invincible": 0,
        "fly": 0
    };
    stopMainTheme();
    mainTheme.currentTime = 0; // Start the main theme over

    drawWorld();
    drawInsideHouse();
    document.querySelector(".inventory").style.display = "none"; // Since we recreate the invenotry a lot, we want it block displayed by default, so display it none manually
    document.querySelector(".store-menu").style.display = "none"; // Hide the store after it is drawn so all the items are the right size
    tick();

    document.body.onkeydown = function(e) {
        keyDown[keyMap[e.which]] = true;
        if( document.querySelector(".menu-high-scores-info-password-input") != document.activeElement && 
            document.querySelector(".menu-high-scores-info-username-input") != document.activeElement ) {
            return false; // No keyboard browser control
        }
    };
    document.body.onkeyup = function(e) {
        keyDown[keyMap[e.which]] = false; // This is not for just press

        // On p press or space
        if( e.keyCode == 80 || e.keyCode == 32 ) {
            if( document.querySelector(".menu-high-scores-info-password-input") != document.activeElement && 
            document.querySelector(".menu-high-scores-info-username-input") != document.activeElement &&
            document.querySelector(".inside-house").style.display != "block" ) {
                togglePause();
                // Prevent keyboard browser control
                e.preventDefault();
                e.stopPropagation();
            }
        }

        // On m press
        if( e.keyCode == 77 ) {
            if( document.querySelector(".menu-high-scores-info-password-input") != document.activeElement && 
            document.querySelector(".menu-high-scores-info-username-input") != document.activeElement ) {
                toggleMute();
            }
        }

        // On enter press
        if( e.keyCode == 13 ) {
            if( !stopped ) {
                var playerObject = { x1: playerX + playerHitboxReduction, y1: playerY + playerHitboxReduction, x2: playerX + playerWidth - playerHitboxReduction, y2: playerY + playerHeight - playerHitboxReduction };
                var cocoaHouseDoorObject = objects[0].door;
                if( collisionTest(playerObject, cocoaHouseDoorObject) ) {
                    togglePause();
                    enterHouse();
                }
            }
        }
    };
    document.body.ontouchstart = function(e) { if(!pauseButtonIsPressed && !stopped) { touchMove(e); } };
    document.body.ontouchmove = function(e) { if(!stopped) { touchMove(e); } };
    document.body.ontouchend = function(e) {
        keyDown.right = false;
        keyDown.left = false;
        keyDown.up = false;
        keyDown.down = false;
    }

}

/**
 * Scale to the user's screen (16x9 is best for things not to be distorted though)
 * https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
 */
function scaleToScreen() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    // Make sure these divisors match the css
    screenScaleX = x/1200;
    screenScaleY = y/675;
    document.body.style.transform = "scaleX("+(x/1200)+")";
    document.body.style.transform += "scaleY("+(y/675)+")";
}

// High scores

/**
 * Load high scores
 * @param {string} range - "day", "week", "month", "year", or "all"
 * @param {number} page - the page of results (the first page is 1)
 * @param {function} callback - callback function to run upon request completion
 */
function loadHighScores(range, page, callback, errorCallback) {
    makeRequest("GET", loadHighScoresEndpoint, { game: highScoresGame, range: range, page: page }, callback, errorCallback);
}

/**
 * Get the most up to date username for our user (they may have change it elsewhere)
 * @param {string} id - the id of the user
 * @param {function} callback - callback function to run upon request completion
 */
function getUsername(id, callback, errorCallback) {
    makeRequest("GET", getUserEndpoint, { id: id }, callback, errorCallback);
}

/**
 * Login a user
 * @param {string} username - the username of the user
 * @param {string} password - the password of the user
 * @param {function} callback - callback function to run upon request completion
 */
function login(username, password, callback, errorCallback) {
    makeRequest("POST", loginEndpoint, { username: username, password: password }, callback, errorCallback);
}

/**
 * Add a score to the high scores table
 * @param {string} id - the id of the user
 * @param {number} score - the score the user got
 * @param {function} callback - callback function to run upon request completion
 */
function addScore(id, score, callback, errorCallback) {
    makeRequest("POST", addScoreEndpoint, { game: highScoresGame, id: id, score: score }, callback, errorCallback );
}

/**
 * Add a new user
 * @param {function} callback - callback function to run upon request completion
 */
function addUser(callback, errorCallback) {
    makeRequest("GET", addUserEndpoint, {}, callback, errorCallback);
}

/**
 * Update a user
 * @param {string} id - the id of the user to update
 * @param {string} username - the new username
 * @param {string} password - the new password
 * @param {function} callback - callback function to run upon request completion
 */
function updateUser(id, username, password, callback, errorCallback) {
    makeRequest("POST", updateUserEndpoint, { id: id, username: username, password: password }, callback, errorCallback );
}

/**
 * Make a request
 * @param {string} type - "GET" or "POST"
 * @param {string} url - the url to make the request ro
 * @param {object} parameters - an object with keys being parameter keys and values being parameter values to send with the request
 * @param {function} callback - callback function to run upon request completion
 */
function makeRequest(type, url, parameters, callback, errorCallback) {
    var parameterKeys = Object.keys(parameters);
    var parameterArray = [];
    for( var i=0; i<parameterKeys.length; i++ ) {
        parameterArray.push( parameterKeys[i] + "=" + parameters[parameterKeys[i]] );
    }

    if( type == "GET" && parameterKeys.length ) {
        url = url + "?" + parameterArray.join("&");
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open(type, url, true);

    if( type == "POST" && parameterKeys.length ) {
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    } 

    xhttp.onreadystatechange = function() {
        if( this.readyState == 4 ) {
            if( this.status == 200 ) {
                if( callback ) { callback(this.responseText); }
            }
            else {
                if( errorCallback ) { errorCallback(); }
            }
        }
    }    
    if( type == "POST" && parameterArray.length ) {
        xhttp.send( parameterArray.join("&") );
    }
    else {
        xhttp.send();
    }
}

/**
 * Load a new user
 */
function loadNewUser() {
    addUser( function(response) {
        try {
            var jsonResponse = JSON.parse(response);
            if( jsonResponse.id ) {
                console.log("Created an account");
                console.log("ID: " + jsonResponse.id);
                console.log("Username" + jsonResponse.username);
                localStorage.game103Id = jsonResponse.id;
                game103Username = jsonResponse.username;
            }
        }
        catch(err) {
            console.log(err);
        }
    } );
}

// Wait for a web font to load
// taken from here: https://stackoverflow.com/questions/4383226/using-jquery-to-know-when-font-face-fonts-are-loaded
function waitForWebfonts(fonts, callback) {
    var loadedFonts = 0;
    for(var i = 0, l = fonts.length; i < l; ++i) {
        (function(font) {
            var node = document.createElement('span');
            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';
            // Visible - so we can measure it - but not on the screen
            node.style.position      = 'absolute';
            node.style.left          = '-10000px';
            node.style.top           = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize      = '300px';
            // Reset any font properties
            node.style.fontFamily    = 'sans-serif';
            node.style.fontVariant   = 'normal';
            node.style.fontStyle     = 'normal';
            node.style.fontWeight    = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            // Remember width with no applied web font
            var width = node.offsetWidth;

            node.style.fontFamily = font + ', sans-serif';

            var interval;
            function checkFont() {
                // Compare current width with original width
                if(node && node.offsetWidth != width) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if(loadedFonts >= fonts.length) {
                    if(interval) {
                        clearInterval(interval);
                    }
                    if(loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};

/**
 * Load the game.
 * For now this is just web fonts for now.
 */
function load() {
    document.body.innerHTML = "<div class='global-spinner'><i class='fas fa-spinner'></i></div>";
    waitForWebfonts(["Acme"], function() {
        reset();
    });
}

//// Inner House functions

/**
 * Draw the inside of Cocoa's house
 */
function drawInsideHouse() {
    // width 1200
    // height 675

    var container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    container.classList.add("inside-house");
    document.body.appendChild(container);

    var path = drawPath( [ [0,607.5], [1080, 607.5], [1200, 675], [1200, 680], [-5, 685], [-5, 607.5] ] , container  );
    path.classList.add("inside-house-floor");
    path = drawPath( [ [1200, 675], [1080, 607.5], [1080, 0], [1080, -5], [1205, -5], [1205, 680] ] , container );
    path.classList.add("inside-house-wall");
    
    drawHouseButtons();
    drawStore();

    // Idempotent
    placeHouseItems();
    drawInventory();
}

/**
 * Place items inside the house
 * This function is idempotent
 */
function placeHouseItems() {

    var curHouseItems = document.querySelectorAll(".inside-house .house-item");
    for(var i=0; i<curHouseItems.length; i++) {
        curHouseItems[i].parentElement.removeChild(curHouseItems[i]);
    }

    var container = document.querySelector(".inside-house");

    // Place each of the house items appropriately and add interaction
    for( var i=0; i<houseItems.length; i++ ) {

        var item = houseItems[i].function(houseItems[i].x, houseItems[i].y, container);
        item.setAttribute("index", i);

        // On mouse down, the the item to moving
        item.onmousedown = function(e) {
            if( moveMode ) {
                startMovingItem(e, this);
            }
            else {
                var curItem = this;
                moveModeTimeout = setTimeout(function() { setMoveMode(true); startMovingItem(e, curItem); }, 750);
            }
            // We don't want to end move mode
            e.stopPropagation();
            e.preventDefault();
        }

        // on double click, bring the item to the front
        item.ondblclick = function(e) {
            var parent = this.parentElement;
            parent.removeChild(this);
            parent.appendChild(this);
            // Needed for saving
            var index = parseInt(this.getAttribute("index"));
            var tempItem = houseItems[index];
            houseItems.push(tempItem);
            houseItems.splice(index, 1);
        }
    }

    // On mouse move, move the item
    document.body.onmousemove = function(e) {
        var x = e.clientX;
        var y = e.clientY;
        x = x/screenScaleX;
        y = y/screenScaleY;
        if( moveMode ) {
            var moveItem = document.querySelector(".house-item-moving");
            if( moveItem ) {
                moveItem.setAttribute("x", x - parseFloat(moveItem.getAttribute("start-x")));
                moveItem.setAttribute("y", y - parseFloat(moveItem.getAttribute("start-y")));
            }
        }
    }

    // On mouse up, save the item's position
    document.body.onmouseup = function(e) {
        if( moveMode ) {
            var moveItem = document.querySelector(".house-item-moving");
            if( moveItem ) {
                stopMovingItem(e, moveItem);
            }
        }
        if( moveModeTimeout ) {
            clearTimeout(moveModeTimeout);
        }
    }

    document.body.onmousedown = function(e) {
        if( !document.querySelector(".inventory").classList.contains("inventory-expanded") ) {
            setMoveMode(false);
        }
    }

    saveHouse();

}

function setMoveMode(val) {
    var insideHouse = document.querySelector(".inside-house");
    if( val ) {
        if( insideHouse ) {
            insideHouse.classList.add("move-mode");
        }
        moveMode = true;
    }
    else {
        if( insideHouse ) {
            insideHouse.classList.remove("move-mode");
        }
        moveMode = false;
    }
}

 /**
  * Begin moving an item
  * @param {event} e - the mouse event
  * @param {HTMLElement} item - the item to move
  */
function startMovingItem(e, item) {
    
    // sanity check
    var curMovingItem = document.querySelector(".house-item-moving");
    if(curMovingItem) {
        stopMovingItem(e, curMovingItem);
    }

    var x = e.clientX;
    var y = e.clientY;
    x = x/screenScaleX;
    y = y/screenScaleY;
    item.classList.add("house-item-moving");
    item.setAttribute( "start-x", (x - parseFloat(item.getAttribute("x"))) );
    item.setAttribute( "start-y", (y - parseFloat(item.getAttribute("y"))) );
}

/**
 * Stop moving an item
 * @param {event} e - the mouse event
 * @param {HTMLElement} item - the item to move
 */
function stopMovingItem(e, item) {
    // update positions
    houseItems[parseInt(item.getAttribute("index"))].x = parseFloat(item.getAttribute("x"));
    houseItems[parseInt(item.getAttribute("index"))].y = parseFloat(item.getAttribute("y"));
    item.classList.remove("house-item-moving");

    var backInInventorySpot = document.querySelector(".inventory-item:last-child");
    var rect = backInInventorySpot.getBoundingClientRect();

    if( e.clientY < rect.bottom
        && e.clientY > rect.top
        && e.clientX < rect.right
        && e.clientX > rect.left ) {

        var index = parseInt(item.getAttribute("index"));
        var item = houseItems[index];

        // Can't put away dog bed
        if( item.name != "Dog Bed" ) {
        
            inventory.push(item);
            houseItems.splice(index, 1);

            placeHouseItems();
            drawInventory(true);

        }
        else {
            saveHouse();
        }
    }
    else {
        saveHouse();
    }
}

/**
 * Save the current house configuration
 */
function saveHouse() {
    localStorage.cocoaTownHouseItems = JSON.stringify(houseItems);
    localStorage.cocoaTownInventory = JSON.stringify(inventory);
}

/**
 * Load a house configuration
 */
function loadHouse() {
    var items = JSON.parse(localStorage.cocoaTownHouseItems);
    items = setFunctions(items);
    houseItems = items;
    items = JSON.parse(localStorage.cocoaTownInventory);
    items = setFunctions(items);
    inventory = items;
}

/**
 * Set functions to be what they should be (after using JSON.parse to get inventory or house items)
 * @param {Array.Object} - a copy of the inventory or availableItems array
 * @returns - the array
 */
function setFunctions(items) {
    for( var i=0; i<items.length; i++ ) {
        for( var j=0; j<availableItems.length; j++ ) {
            if( items[i].name == availableItems[j].name ) {
                items[i].function = availableItems[j].function;
            }
        }
    }
    return items;
}

/**
 * Draw the buttons for the house (back and inventory)
 */
function drawHouseButtons() {
    var back = document.createElement("div");
    back.classList.add("menu-button");
    back.classList.add("back-button");
    back.classList.add("menu-button-inner-house");
    back.innerHTML = "<i class='fas fa-hand-point-left'></i>";

    back.onclick = leaveHouse;

    document.body.appendChild(back);

    var cart = document.createElement("div");
    cart.classList.add("menu-button");
    cart.classList.add("store-button");
    cart.classList.add("menu-button-inner-house");
    cart.innerHTML = '<i class="fas fa-shopping-cart"></i>';

    cart.onclick = toggleStore;

    document.body.appendChild(cart);

    var inventoryButton = document.createElement("div");
    inventoryButton.classList.add("menu-button");
    inventoryButton.classList.add("inventory-button");
    inventoryButton.classList.add("menu-button-inner-house");
    inventoryButton.innerHTML = "<i class='fas fa-suitcase'></i>";

    inventoryButton.onclick = function(e) {
        var inventoryBar = document.querySelector(".inventory");
        if( inventoryBar.classList.contains("inventory-expanded") ) {
            inventoryBar.classList.remove("inventory-expanded");
            setMoveMode(false);
        }
        else {
            inventoryBar.classList.add("inventory-expanded");
            setMoveMode(true);
        }
    }

    document.body.appendChild(inventoryButton);
}

/**
 * Draw the inventory
 * This function is somewhat idempotent as it deletes the old inventory
 * However, you will have to give it a parameter if you want it 
 * expanded by default
 * @param {boolean} expanded - true if the inventory is open as soon as being created
 */
function drawInventory(expanded) {

    var inventorySection = document.querySelector(".inventory");
    if( inventorySection ) {
        inventorySection.parentElement.removeChild(inventorySection);
    }

    var inventoryContainer = document.createElement("div");
    inventoryContainer.classList.add("inventory");
    if( expanded ) {
        inventoryContainer.classList.add("inventory-expanded");
    }
    document.body.appendChild(inventoryContainer);

    var inventorySlider = document.createElement("div");
    inventorySlider.classList.add("inventory-slider");
    inventoryContainer.appendChild(inventorySlider);

    for( var i=0; i<inventory.length+1; i++ ) {
        var inventoryItem = document.createElement("div");
        inventoryItem.classList.add("inventory-item");
        inventoryItem.setAttribute("index", i);
        inventorySlider.appendChild(inventoryItem);
        
        if( i < inventory.length ) {
            createItemIcon("inventory-svg", 50, 20, inventory[i], inventoryItem);

            // Get ready to placeHouseItems
            inventoryItem.onmousedown=function(e) {
                var index = parseInt(this.getAttribute("index"));
                var item = inventory[index];

                houseItems.push(item);
                inventory.splice(index, 1);
                item.x = e.clientX-10;
                item.y = e.clientY-10;
                item.x = item.x/screenScaleX;
                item.y = item.y/screenScaleY;

                placeHouseItems();
                drawInventory(true);

                var curHouseItems = document.querySelectorAll(".inside-house .house-item");
                var newHouseItem = curHouseItems[curHouseItems.length-1];

                startMovingItem(e, newHouseItem);

                // We don't want to end move mode
                e.stopPropagation();
                e.preventDefault();
            }
        }
    } 

    setClockTime();

}

/**
 * Create an icon for an item
 * @param {string} className - the class name for the icon
 * @param {number} size - the max width/height of the icon 
 * @param {number} padding - the padding for the icon
 * @param {object} item - the item object (see available items, inventory, or houseItems)
 * @param {HTMLElement} container - the element on which to draw the icon
 */
function createItemIcon(className, size, padding, item, container) {
    var inventorySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var inventoryPicture = item.function(0, 0, inventorySvg);
    inventorySvg.classList.add(className);
    container.appendChild(inventorySvg);

    // width and height of an inventory item box is 70px - make sure this matches css
    var width = inventoryPicture.getBBox().width;
    var height = inventoryPicture.getBBox().height;
    if( width >= height ) {
        var ratio = width/height;
        var resize = size/width;
        inventorySvg.style.left = padding/2 + "px";
        var verticalPadding = ((size+padding) - (size / ratio)) / 2;
        inventorySvg.style.top = verticalPadding + "px";
        inventorySvg.style.transform = "scale("+resize+")";
    }
    else {
        var ratio = height/width;
        var resize = size/height;
        inventorySvg.style.top = padding/2 + "px";
        var horizontalPadding = ((size+padding) - (size / ratio)) / 2;
        inventorySvg.style.left = horizontalPadding + "px";
        inventorySvg.style.transform = "scale("+resize+")";
    }

    return inventorySvg;
}

/**
 * Draw a desk
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawDesk(x, y, container) {
    var deskGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    deskGroup.classList.add("desk");
    deskGroup.setAttribute("x", x);
    deskGroup.setAttribute("y", y)

    var leg = drawRectangle(20, 170, 0, 0, deskGroup);
    leg.classList.add("desk-leg");

    leg = drawRectangle(20, 170, 180, 0, deskGroup);
    leg.classList.add("desk-leg");

    var body = drawRectangle(200, 40, 0, 0, deskGroup);
    body.classList.add("desk-body");

    deskGroup.classList.add("house-item");
    container.appendChild(deskGroup);

    return deskGroup;
}

/**
 * Draw a computer
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawComputer(x, y, container) {
    var computerGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    computerGroup.classList.add("computer");
    computerGroup.setAttribute("x", x);
    computerGroup.setAttribute("y", y)

    var stand = drawRectangle(10, 25, 60, 97.5, computerGroup);
    stand.classList.add("computer-frame");
    var base = drawRectangle(30, 10, 50, 122.5, computerGroup);
    base.classList.add("computer-frame");
    var frame = drawRectangle(130, 102.5, 0, 0, computerGroup);
    frame.classList.add("computer-frame");
    var screen = drawRectangle(110, 82.5, 10, 10, computerGroup);
    screen.classList.add("computer-screen");

    computerGroup.classList.add("house-item");
    container.appendChild(computerGroup);

    return computerGroup;
}

/**
 * Draw a tv
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawTV(x, y, container) {
    var tvGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    tvGroup.classList.add("tv");
    tvGroup.setAttribute("x", x);
    tvGroup.setAttribute("y", y)

    var frame = drawRectangle(220, 132.5, 0, 0, tvGroup);
    frame.classList.add("tv-frame");
    var screen = drawRectangle(200, 112.5, 10, 10, tvGroup);
    screen.classList.add("tv-screen");

    tvGroup.classList.add("house-item");
    container.appendChild(tvGroup);

    return tvGroup;
}

/**
 * Draw a book
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawBook(x, y, fill, text, container) {
    var bookGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    bookGroup.classList.add("book");
    bookGroup.setAttribute("x", x);
    bookGroup.setAttribute("y", y);

    var book = drawRectangle(18.5, 80, 0, 0, bookGroup);
    book.classList.add("book-spine");
    book.style.fill = fill;

    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.innerHTML = text;
    textElement.classList.add("book-name");
    textElement.setAttribute("x", 7);
    textElement.setAttribute("y", -6);
    textElement.setAttribute("textLength", 66);
    bookGroup.appendChild(textElement);

    bookGroup.classList.add("house-item");
    container.appendChild(bookGroup);

    return bookGroup;
}

/**
 * Draw a dog bed
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawDogBed(x, y, container) {

    var dogBedGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    dogBedGroup.classList.add("dog-bed");
    dogBedGroup.setAttribute("x", x);
    dogBedGroup.setAttribute("y", y);

    // the the dog
    var dogSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    dogSvg.classList.add("inside-dog");
    var insideDog = drawDogBody(dogSvg);
    dogSvg.setAttribute("x",210);
    dogSvg.setAttribute("y",-20);
    dogBedGroup.appendChild(dogSvg);

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = [];
    d.push("M " + (10) + " " + (0));
    d.push("C " + (70) + " " + (-5) + "," + (10) + " " + (48) + "," + (80) + " " + (50));
    d.push("C " + (80) + " " + (50) + "," + (170) + " " + (50) + "," + (170) + " " + (50));
    d.push("C " + (240) + " " + (48) + "," + (180) + " " + (-5) + "," + (240) + " " + (0));
    d.push("C " + (250) + " " + (0) + "," + (250) + " " + (10) + "," + (250) + " " + (10));
    d.push("C " + (255) + " " + (100) + "," + (240) + " " + (100) + "," + (225) + " " + (100));
    d.push("C " + (200) + " " + (100) + "," + (25) + " " + (100) + "," + (25) + " " + (100));
    d.push("C " + (10) + " " + (100) + "," + (-5) + " " + (100) + "," + (0) + " " + (10));
    d.push("C " + (0) + " " + (0) + "," + (10) + " " + (0) + "," + (10) + " " + (0));
    path.setAttribute("d", d.join(" "));
    dogBedGroup.appendChild( path );
    path.classList.add("dog-bed-outer");

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var d = []; 
    var downOffset = 10;
    var horizontalOffset = 10;
    d.push("M " + (10) + " " + (0+downOffset));
    d.push("C " + (70-horizontalOffset) + " " + (-5+downOffset) + "," + (10-horizontalOffset) + " " + (48+downOffset) + "," + (80) + " " + (50+downOffset));
    d.push("C " + (80) + " " + (50+downOffset) + "," + (170) + " " + (50+downOffset) + "," + (170) + " " + (50+downOffset));
    d.push("C " + (240+horizontalOffset) + " " + (48+downOffset) + "," + (180+horizontalOffset) + " " + (-5+downOffset) + "," + (240) + " " + (0+downOffset));
    d.push("C " + (250) + " " + (0+downOffset) + "," + (250) + " " + (10+downOffset) + "," + (250) + " " + (10));
    d.push("C " + (255) + " " + (100) + "," + (240) + " " + (100) + "," + (225) + " " + (100));
    d.push("C " + (200) + " " + (100) + "," + (25) + " " + (100) + "," + (25) + " " + (100));
    d.push("C " + (10) + " " + (100) + "," + (-5) + " " + (100) + "," + (0) + " " + (10+downOffset));
    d.push("C " + (0) + " " + (0+downOffset) + "," + (10) + " " + (0+downOffset) + "," + (10) + " " + (0+downOffset));
    path.setAttribute("d", d.join(" "));
    dogBedGroup.appendChild( path );
    path.classList.add("dog-bed-inner");

    dogBedGroup.classList.add("house-item");
    container.appendChild( dogBedGroup );

    return dogBedGroup;
}

/**
 * Draw a sticky note
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawNotepad(x, y, container) {
    var notepadGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    notepadGroup.classList.add("notepad");
    notepadGroup.setAttribute("x", x);
    notepadGroup.setAttribute("y", y);

    var notepad = drawRectangle(30, 30, 0, 0, notepadGroup);
    notepad.classList.add("pad");

    var sticky = drawRectangle(28, 5, 1, 1, notepadGroup);
    sticky.classList.add("sticky");

    notepadGroup.classList.add("house-item");
    container.appendChild( notepadGroup );

    return notepadGroup;
}

/**
 * Draw a working clock
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawClock(x, y, container) {
    var clockGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    clockGroup.classList.add("clock");
    clockGroup.setAttribute("x", x);
    clockGroup.setAttribute("y", y);

    var clockWood = drawCircle(30, 30, 30, clockGroup);
    clockWood.classList.add("clock-wood");

    var clockFace = drawCircle(30, 30, 26, clockGroup);
    clockFace.classList.add("clock-face");

    for(var i=1; i<13; i++) {
        var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.innerHTML = i;
        textElement.classList.add("clock-digit");
        var point = getPointOnCircumference(30, 30, 19, (2*Math.PI)/12 * i - Math.PI/2);
        textElement.setAttribute("x", point[0]-2);
        textElement.setAttribute("y", point[1]+3.5);
        clockGroup.appendChild(textElement);
    }

    var clockHourHand = drawLine(30, 30, 42, 30, clockGroup);
    clockHourHand.classList.add("clock-hand");
    clockHourHand.classList.add("clock-hour-hand");
    var clockMinuteHand = drawLine(30, 30, 45, 30, clockGroup);
    clockMinuteHand.classList.add("clock-hand");
    clockMinuteHand.classList.add("clock-minute-hand");

    container.appendChild( clockGroup );

    setClockTime();
    setInterval(setClockTime, 30000);

    clockGroup.classList.add("house-item");

    return clockGroup;
}

/**
 * Make sure all clocks have the correct time
 */
function setClockTime() {
    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var hoursRotate = (2*Math.PI)/12 * hours - Math.PI/2;
    var minutesRotate = (2*Math.PI)/60 * minutes -Math.PI/2;
    hoursRotate += minutesRotate/12;
    var clocks = document.querySelectorAll(".clock");
    for( var i=0; i<clocks.length; i++ ) {
        clocks[i].querySelector(".clock-hour-hand").style.transform = "rotate("+hoursRotate+"rad)";
        clocks[i].querySelector(".clock-minute-hand").style.transform = "rotate("+minutesRotate+"rad)";
    }
}

/**
 * Draw a bookshelf
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawBookshelf(x, y, container) {

    var bookshelfGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    bookshelfGroup.classList.add("bookshelf");
    bookshelfGroup.setAttribute("x", x);
    bookshelfGroup.setAttribute("y", y);

    var background = drawRectangle(200, 500, 0, 0, bookshelfGroup);
    background.classList.add("bookshelf-background");
    var shelf = drawRectangle(180, 100, 10, 10, bookshelfGroup);
    shelf.classList.add("bookshelf-shelf");
    var shelf = drawRectangle(180, 100, 10, 120, bookshelfGroup);
    shelf.classList.add("bookshelf-shelf");
    var shelf = drawRectangle(180, 100, 10, 230, bookshelfGroup);
    shelf.classList.add("bookshelf-shelf");
    var shelf = drawRectangle(180, 100, 10, 340, bookshelfGroup);
    shelf.classList.add("bookshelf-shelf");

    container.appendChild( bookshelfGroup );

    bookshelfGroup.classList.add("house-item");

    return bookshelfGroup;
}

/**
 * Draw a calendar
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawCalendar(x, y, container) {

    var calendarGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    calendarGroup.classList.add("calendar");
    calendarGroup.setAttribute("x", x);
    calendarGroup.setAttribute("y", y);

    var calendar = drawRectangle(100, 118, 0, 0, calendarGroup);
    calendar.classList.add("calendar-background");
    calendarGroup.appendChild(calendar);

    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.innerHTML = new Date().toLocaleString('en-us', { month: 'long' });
    textElement.classList.add("calendar-month");
    textElement.setAttribute("x", 25);
    textElement.setAttribute("y", 15);
    textElement.setAttribute("textLength", 50);
    calendarGroup.appendChild(textElement);


    for(var i=0; i<6; i++) {
        drawLine(5, 35+i*15, 95, 35+i*15, calendarGroup).classList.add("calendar");
    }
    for(var i=0; i<8; i++) {
        drawLine(5+i*13, 35, 5+i*13, 110, calendarGroup).classList.add("calendar");
    }

    var days = ["S", "M", "T", "W", "Th", "F", "Sa"];
    for(var i=0; i<days.length; i++) {
        var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.innerHTML = days[i];
        textElement.classList.add("calendar-day-label");
        textElement.setAttribute("x", 5+i*13 + 3);
        textElement.setAttribute("y", 30);
        calendarGroup.appendChild(textElement);
    }

    var currentDay = 1;
    var daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
    var row = 1;
    var column = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
    var actualDay = new Date().getDate();
    while(currentDay < daysInMonth) {
        var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.innerHTML = currentDay;
        textElement.classList.add("calendar-day");
        textElement.setAttribute("x", 5+column*13 + 3);
        textElement.setAttribute("y", 30+row*15 + 2);
        calendarGroup.appendChild(textElement);

        if( currentDay < actualDay ) {
            drawLine(5+column*13+1, 30+row*15+3, 5+column*13+12, 30+row*15-8, calendarGroup).classList.add("calendar-strike");
        }

        column++;
        if( column >= days.length ) {
            row ++;
            column = 0;
        }

        currentDay++;
    }

    calendarGroup.classList.add("house-item");

    container.appendChild(calendarGroup);

    return calendarGroup;

}

/**
 * Draw a picture frame
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawPictureFrame(x, y, container) {

    var pictureFrameGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    pictureFrameGroup.classList.add("picture-frame");
    pictureFrameGroup.setAttribute("x", x);
    pictureFrameGroup.setAttribute("y", y);

    var pictureFrame = drawRectangle(81.875, 130, 0, 0, pictureFrameGroup);
    pictureFrame.classList.add("picture-frame-frame");
    pictureFrameGroup.appendChild(pictureFrame);

    var picture = document.createElementNS("http://www.w3.org/2000/svg", "image");
    picture.classList.add("picture-frame-picture");
    picture.setAttribute("x", 10);
    picture.setAttribute("y", 10);
    picture.setAttribute("width", 61.875);
    picture.setAttribute("height", 110);
    picture.setAttribute("href", "resources/elephant.jpg");
    pictureFrameGroup.appendChild(picture);

    container.appendChild(pictureFrameGroup);

    pictureFrameGroup.classList.add("house-item");

    return pictureFrameGroup;
}

/**
 * Draw a newspaper
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawNewspaper(x, y, container) {

    var newspaperGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newspaperGroup.classList.add("newspaper");
    newspaperGroup.setAttribute("x", x);
    newspaperGroup.setAttribute("y", y);

    var newspaper = drawRectangle(90, 70, 0, 0, newspaperGroup);
    newspaper.classList.add("newspaper-paper");

    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.innerHTML = "NEWS";
    textElement.classList.add("newspaper-title");
    textElement.setAttribute("x", 20);
    textElement.setAttribute("y", 15);
    textElement.setAttribute("textLength", 50);
    newspaperGroup.appendChild(textElement);

    drawLine(5, 20, 85, 20, newspaperGroup).classList.add("newspaper");

    for(var i=0; i<8; i++) {
        drawLine(5, 28 + i*5, 25, 28 + i*5, newspaperGroup).classList.add("newspaper");
        drawLine(30, 28 + i*5, 50, 28 + i*5, newspaperGroup).classList.add("newspaper");
    }

    drawRectangle(30, 34, 55, 28, newspaperGroup).classList.add("newspaper-photo");

    container.appendChild(newspaperGroup);

    newspaperGroup.classList.add("house-item");

    return newspaperGroup;
}

/**
 * Draw a stereo speaker
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawSpeaker(x, y, container) {
    var speakerGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    speakerGroup.classList.add("speaker");
    speakerGroup.setAttribute("x", x);
    speakerGroup.setAttribute("y", y);

    var speaker = drawRectangle(50, 100, 0, 0, speakerGroup);
    speaker.classList.add("speaker-block");
    speakerGroup.appendChild(speaker);

    drawCircle(25, 72, 20, speakerGroup).classList.add("speaker-circle");
    drawCircle(25, 72, 5, speakerGroup).classList.add("speaker-circle-inner");

    drawCircle(25, 30, 15, speakerGroup).classList.add("speaker-circle");
    drawCircle(25, 30, 3, speakerGroup).classList.add("speaker-circle-inner");

    container.appendChild(speakerGroup);

    speakerGroup.classList.add("house-item");

    return speakerGroup;
}

/**
 * Draw a tennis ball (enemy)
 * @param {number} x - the x coordinate of the left side of the item 
 * @param {number} y - the y coordinate of the top of the item
 * @param {HTMLElement} container - the svg container on which to draw
 * @returns an svg containing the item
 */
function drawTennisBallForHouse(x, y, container) {
    var ballGroup = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    ballGroup.classList.add("ball");
    ballGroup.setAttribute("x", x);
    ballGroup.setAttribute("y", y);

    drawEnemy( 15, 15, 15, ballGroup );
    
    container.appendChild(ballGroup);

    ballGroup.classList.add("house-item");

    return ballGroup;
}

/**
 * Draw the store
 */
function drawStore() {
    var background = document.createElement("div");
    background.classList.add("store-menu");
    background.classList.add("store-menu-hidden"); // The store is hidden by default when you first enter the house
    document.body.appendChild(background);

    var menuTitle = document.createElement("div");
    menuTitle.classList.add("store-menu-title");
    menuTitle.innerText = "Store";
    background.appendChild(menuTitle);

    var storeMoneyIndicator = document.createElement("div");
    storeMoneyIndicator.classList.add("store-money-indicator");
    background.appendChild(storeMoneyIndicator);

    var storeSlider = document.createElement("div");
    storeSlider.classList.add("store-slider");
    background.appendChild(storeSlider);

    // Start at 1 to avoid dog bed
    for( var i=1; i<availableItems.length; i++ ) {
        var storeItem = document.createElement("div");
        storeItem.classList.add("store-item");
        storeItem.setAttribute("index", i);
        storeSlider.appendChild(storeItem);

        createItemIcon("store-svg", 70, 50, availableItems[i], storeItem);

        var itemDetails = document.createElement("div");
        itemDetails.classList.add("store-item-name");
        itemDetails.innerText = availableItems[i].name;
        storeItem.appendChild(itemDetails);

        itemDetails = document.createElement("div");
        itemDetails.classList.add("store-item-price");
        itemDetails.innerText = availableItems[i].price;
        storeItem.appendChild(itemDetails);

        itemDetails = document.createElement("div");
        itemDetails.classList.add("store-item-owned");
        itemDetails.innerText = "";
        storeItem.appendChild(itemDetails);

        var itemButton = document.createElement("div");
        itemButton.classList.add("menu-button");
        itemButton.classList.add("store-item-buy-button");
        itemButton.innerText = "Buy";
        storeItem.appendChild(itemButton);

        // Buy an item
        itemButton.onclick = function() {
            var price = parseInt(this.parentNode.querySelector(".store-item-price").innerText);
            if( localStorage.cocoaTownCoins >= price ) {
                localStorage.cocoaTownCoins -= price;
                inventory.push( JSON.parse(JSON.stringify(  availableItems[ parseInt(this.parentNode.getAttribute("index")) ]  )) );
                inventory = setFunctions(inventory);
                updateStoreMoney();
                updateStoreOwned();
                var expanded = document.querySelector(".inventory").classList.contains("inventory-expanded");
                drawInventory(expanded);
            }
        }

    }

    updateStoreMoney();
    updateStoreOwned();
}

/**
 * Update the amount of money the player has in the store and what the player buy
 */
function updateStoreMoney() {
    document.querySelector(".store-money-indicator").innerText = localStorage.cocoaTownCoins;
    // Dependent on the store items being in the order they are in in the
    // available items array.
    var buyButtons = document.querySelectorAll(".store-item-buy-button");
    for( var i=1; i<availableItems.length; i++) {
        if( availableItems[i].price > localStorage.cocoaTownCoins ) {
            buyButtons[i-1].style.opacity = 0.5;
        }
        else {
            buyButtons[i-1].style.display = 1;
        }
    }
}

/**
 * Update the amount of items owned in the store
 */
function updateStoreOwned() {
    // Dependent on the store items being in the order they are in in the
    // available items array.
    var storeItems = document.querySelectorAll(".store-item-owned");
    for( var i=1; i<availableItems.length; i++) {
        var count = 0;
        for( var j=0; j<houseItems.length; j++ ) {
            if( availableItems[i].name == houseItems[j].name ) {
                count ++;
            }
        }
        for( var j=0; j<inventory.length; j++ ) {
            if( availableItems[i].name == inventory[j].name ) {
                count ++;
            }
        }
        storeItems[i-1].innerText = count;
    }
}

/**
 * Toggle the visibility of the store
 */
function toggleStore() {
    var store = document.querySelector(".store-menu");

    if( store.classList.contains("store-menu-hidden") ) {
        store.classList.remove("store-menu-hidden");
    }
    else {
        store.classList.add("store-menu-hidden");
    }
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
// enemies have a 16/9 viewing window just like the player
var enemySightedDistanceX;
var enemySightedDistanceY;
var maxSightedDistanceXIncrease = 130; // Scale is maintained at 16/9, Y is increased accordingly
var enemyMovementAmount = 6;
var enemyPadding = 25; // Distance an enemy must remain from an object beyond a direct collision
var currentDifficulty;
var maxDifficulty = 50;
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
var pauseButtonIsPressed;
var flowerRadius = 5;
var numFlowers = 50;

var spawnPlayerPadding = 20;
var spawnOverlapHorizontal = 30;
var spawnOverlapDown = 20;
var spawnOverlapUp = 60;

var highScoresDomain = "https://game103.net/ws/scores/";
var highScoresGame = "ct";
var loadHighScoresEndpoint = highScoresDomain + "load_scores.php";
var getUserEndpoint = highScoresDomain + "get_user.php";
var addScoreEndpoint = highScoresDomain + "add_score.php";
var addUserEndpoint = highScoresDomain + "add_user.php";
var loginEndpoint = highScoresDomain + "login.php";
var updateUserEndpoint = highScoresDomain + "update_user.php";
var game103Username = "";
var requestCount = 0;
var currentHighScoresPage = 1;
var unsubmittedHighscores = {};
var mute = false;

var screenScaleX = 1;
var screenScaleY = 1;
var availableItems = [
    {
        "name": "Dog Bed",
        "function": drawDogBed,
        "price": 100,
    },
    {
        "name": "Table",
        "function": drawDesk,
        "price": 120,
    },
    {
        "name": "Ball",
        "function": drawTennisBallForHouse,
        "price": 50
    },
    {
        "name": "Bookshelf",
        "function": drawBookshelf,
        "price": 300
    },
    {
        "name": "Computer",
        "function": drawComputer,
        "price": 750
    },
    {
        "name": "TV",
        "function": drawTV,
        "price": 500
    },
    {
        "name": "Mary Poppins",
        "function": function(x, y, container) { return drawBook(x, y, "steelblue", "Mary Poppins", container); }
    },
    {
        "name": "Stickies",
        "function": drawNotepad,
        "price": 50
    },
    {
        "name": "Clock",
        "function": drawClock,
        "price": 150
    },
    {
        "name": "Picture",
        "function": drawPictureFrame,
        "price": 90
    },
    {
        "name": "Newspaper",
        "function": drawNewspaper,
        "price": 100
    },
    {
        "name": "Speaker",
        "function": drawSpeaker,
        "price": 300
    },
    {
        "name": "Calendar",
        "function": drawCalendar,
        "price": 200
    }
];
var inventory = [];
var houseItems = [];
var moveMode = false;
var moveModeTimeout = null;

if( localStorage.cocoaTownInventory && localStorage.cocoaTownHouseItems ) {
    loadHouse();
}
else {
    houseItems.push( JSON.parse(JSON.stringify(availableItems[0])) ); // Add the dog bed to house items by default
    houseItems[0].x = 78;
    houseItems[0].y = 535;
    houseItems = setFunctions(houseItems);
}

var deliveryAudio = [
    new Audio("resources/now-the-party-can-start.mp3"),
    new Audio("resources/thank-you-james.mp3"),
    new Audio("resources/thank-you-kasey.mp3"),
    new Audio("resources/this-is-great.mp3"),
    new Audio("resources/wow-my-favorite.mp3"),
    new Audio("resources/yes-the-ice-creams-here.mp3")
];
var barkAudio = [
    new Audio("resources/bark.mp3"),
    new Audio("resources/bark2.mp3"),
    new Audio("resources/bark3.mp3")
];
var mainTheme = new Audio("resources/main-theme.mp3");
mainTheme.load();

for(var i=0;i<deliveryAudio.length;i++) {
    deliveryAudio[i].load();
}
for(var i=0;i<barkAudio.length;i++) {
    barkAudio[i].load();
}

mainTheme.loop = true;
mainTheme.volume = 0.6;
//mainTheme.addEventListener('canplaythrough', function() { mainTheme.play(); mainTheme.pause(); }, false);

// we might have unsubmitted high scores in local storage
if( localStorage.cocoaTownUnsubmittedHighscores ) {
    try {
        unsubmittedHighscores = JSON.parse(localStorage.cocoaTownUnsubmittedHighscores);
        // try to submit the scores
        submitScores();
    } 
    catch(err) {
        localStorage.cocoaTownUnsubmittedHighscores = "";
    }
}
// make sure cocoaTownHighScore is not null
if( !localStorage.cocoaTownHighScore ) {
    localStorage.cocoaTownHighScore = 0;
}
// make sure cocoaTownCoins is not null
if( !localStorage.cocoaTownCoins ) {
    localStorage.cocoaTownCoins = 0;
}

// make sure we have a game103 id
if( !localStorage.game103Id ) {
    loadNewUser();
}
// If we already have an id
else {
    getUsername( localStorage.game103Id, function(response) {
        try {
            var jsonResponse = JSON.parse(response);
            if( jsonResponse.id ) {
                console.log("Got username");
                console.log(jsonResponse.username);
                game103Username = jsonResponse.username;
                var currentUsernameListing = document.querySelector(".menu-high-scores-info-username");
                if( currentUsernameListing ) {
                    currentUsernameListing.innerText = game103Username;
                }
            }
            else {
                console.log("No user: creating a new one.");
                loadNewUser();
            }
        }
        catch(err) {
            console.log("Error while loading user: creating a new one.");
            loadNewUser();
            console.log(err);
        }
    }, function() { console.log("HTTP error while loading user: creating a new one."); loadNewUser(); } /* Try to load a new user on error */ );
}


// Start the game
scaleToScreen();
document.oncontextmenu = new Function("return false;"); // disable right click
document.body.onresize = scaleToScreen;
setTimeout(function() {window.scrollTo(0,0)}, 50);
load();
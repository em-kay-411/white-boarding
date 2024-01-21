const socket = io('http://localhost:3000');
const strokeStyle = '#000';
const lineWidth = 2;
const shape = 'rectangle';

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// disable right clicking
document.oncontextmenu = function () {
    return false;
}

// list of all strokes drawn
const drawings = [];

// coordinates of our cursor
let cursorX;
let cursorY;
let prevCursorX;
let prevCursorY;
let constantX;
let constantY;

// distance from origin
let offsetX = 0;
let offsetY = 0;

// zoom amount
let scale = 1;

// convert coordinates
function toScreenX(xTrue) {
    return (xTrue + offsetX) * scale;
}
function toScreenY(yTrue) {
    return (yTrue + offsetY) * scale;
}
function toTrueX(xScreen) {
    return (xScreen / scale) - offsetX;
}
function toTrueY(yScreen) {
    return (yScreen / scale) - offsetY;
}
function trueHeight() {
    return canvas.clientHeight / scale;
}
function trueWidth() {
    return canvas.clientWidth / scale;
}

function redrawCanvas() {
    // set the canvas to the size of the window
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        if(line.shape === 'freeform'){            
            drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1));
        }
        else if(line.shape === 'rectangle'){
            drawRectangle(toScreenX(line.x0), toScreenY(line.y0), line.width, line.height);
        }        
    }
}
redrawCanvas();

// if the window changes size, redraw the canvas
window.addEventListener("resize", (event) => {
    redrawCanvas();
});

// Mouse Event Handlers
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseOut, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('wheel', onMouseWheel, false);


// Touch Event Handlers 
canvas.addEventListener('touchstart', onTouchStart);
canvas.addEventListener('touchend', onTouchEnd);
canvas.addEventListener('touchcancel', onTouchEnd);
canvas.addEventListener('touchmove', onTouchMove);


// mouse functions
let leftMouseDown = false;
let rightMouseDown = false;
function onMouseDown(event) {

    // detect left clicks
    if (event.button == 0) {
        leftMouseDown = true;
        rightMouseDown = false;
    }
    // detect right clicks
    if (event.button == 2) {
        rightMouseDown = true;
        leftMouseDown = false;
    }

    // update the cursor coordinates
    cursorX = event.pageX;
    cursorY = event.pageY;
    prevCursorX = event.pageX;
    prevCursorY = event.pageY;

    if(shape === 'rectangle'){
        constantX = cursorX;
        constantY = cursorY;
    }
}
function onMouseMove(event) {
    // get mouse position
    cursorX = event.pageX;
    cursorY = event.pageY;
    const trueCursorX = toTrueX(cursorX);
    const trueCursorY = toTrueY(cursorY);
    const truePrevCursorX = toTrueX(prevCursorX);
    const truePrevCursorY = toTrueY(prevCursorY);

    if (leftMouseDown && event.shiftKey) {
        // move the screen
        offsetX += (cursorX - prevCursorX) / scale;
        offsetY += (cursorY - prevCursorY) / scale;
        redrawCanvas();
    }

    if (leftMouseDown && !event.shiftKey) {          
        
        if(shape === 'freeform'){
            // add the line to our drawing history 
            drawings.push({
                shape: 'freeform',
                x0: truePrevCursorX,
                y0: truePrevCursorY,
                x1: trueCursorX,
                y1: trueCursorY
            })
            drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
            socket.emit('drawLine', ({truePrevCursorX, truePrevCursorY, trueCursorX, trueCursorY}));
        }
        // else if ( shape === 'rectangle') {
        //     const width = cursorX - constantX;
        //     const height = cursorY - constantY;
        //     drawRectangle(constantX, constantY, width, height);            
        // }        
    }
    
    prevCursorX = cursorX;
    prevCursorY = cursorY;
}
function onMouseUp() {
    leftMouseDown = false;
    rightMouseDown = false;

    if(shape === 'rectangle'){
        const trueConstantX = toTrueX(constantX);
        const trueConstantY = toTrueY(constantY);
        const width = cursorX - constantX;
        const height = cursorY - constantY;
        drawings.push( {
            shape : 'rectangle',
            x0 : trueConstantX,
            y0 : trueConstantY,
            width : width,
            height : height
        })
        drawRectangle(constantX, constantY, width, height);    
        socket.emit('drawRectangle', ({trueConstantX, trueConstantY, width, height}));
    }
}

function onMouseOut () {
    leftMouseDown = false;
    rightMouseDown = false;
}

function onMouseWheel(event) {
    const deltaY = event.deltaY;
    const deltaX = event.deltaX;
    // const scaleAmount = -deltaY / 500;
    // scale = scale * (1 + scaleAmount);

    // // zoom the page based on where the cursor is
    // var distX = event.pageX / canvas.clientWidth;
    // var distY = event.pageY / canvas.clientHeight;

    // // calculate how much we need to zoom
    // const unitsZoomedX = trueWidth() * scaleAmount;
    // const unitsZoomedY = trueHeight() * scaleAmount;

    // const unitsAddLeft = unitsZoomedX * distX;
    // const unitsAddTop = unitsZoomedY * distY;

    // offsetX -= unitsAddLeft;
    // offsetY -= unitsAddTop;

    offsetX += -deltaX / scale;
    offsetY += -deltaY / scale;
    redrawCanvas();
}
function drawLine(x0, y0, x1, y1) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.stroke();
}

function drawRectangle(x, y, width, height) {
    context.moveTo(x, y);
    context.strokeRect(x, y, width, height);
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
}

// touch functions
const prevTouches = [null, null]; // up to 2 touches
let singleTouch = false;
let doubleTouch = false;
function onTouchStart(event) {
    if (event.touches.length == 1) {
        singleTouch = true;
        doubleTouch = false;
    }
    if (event.touches.length >= 2) {
        singleTouch = false;
        doubleTouch = true;
    }

    // store the last touches
    prevTouches[0] = event.touches[0];
    prevTouches[1] = event.touches[1];

}
function onTouchMove(event) {
    // get first touch coordinates
    const touch0X = event.touches[0].pageX;
    const touch0Y = event.touches[0].pageY;
    const prevTouch0X = prevTouches[0].pageX;
    const prevTouch0Y = prevTouches[0].pageY;

    const trueCursorX = toTrueX(touch0X);
    const trueCursorY = toTrueY(touch0Y);
    const truePrevCursorX = toTrueX(prevTouch0X);
    const truePrevCursorY = toTrueY(prevTouch0Y);

    if (singleTouch) {
        // add to history
        drawings.push({
            x0: truePrevCursorX,
            y0: truePrevCursorY,
            x1: trueCursorX,
            y1: trueCursorY
        })
        drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y);
    }

    if (doubleTouch) {
        // get second touch coordinates
        const touch1X = event.touches[1].pageX;
        const touch1Y = event.touches[1].pageY;
        const prevTouch1X = prevTouches[1].pageX;
        const prevTouch1Y = prevTouches[1].pageY;

        // get midpoints
        const midX = (touch0X + touch1X) / 2;
        const midY = (touch0Y + touch1Y) / 2;
        const prevMidX = (prevTouch0X + prevTouch1X) / 2;
        const prevMidY = (prevTouch0Y + prevTouch1Y) / 2;

        // calculate the distances between the touches
        const hypot = Math.sqrt(Math.pow((touch0X - touch1X), 2) + Math.pow((touch0Y - touch1Y), 2));
        const prevHypot = Math.sqrt(Math.pow((prevTouch0X - prevTouch1X), 2) + Math.pow((prevTouch0Y - prevTouch1Y), 2));

        // calculate the screen scale change
        var zoomAmount = hypot / prevHypot;
        scale = scale * zoomAmount;
        const scaleAmount = 1 - zoomAmount;

        // calculate how many pixels the midpoints have moved in the x and y direction
        const panX = midX - prevMidX;
        const panY = midY - prevMidY;
        // scale this movement based on the zoom level
        offsetX += (panX / scale);
        offsetY += (panY / scale);

        // Get the relative position of the middle of the zoom.
        // 0, 0 would be top left. 
        // 0, 1 would be top right etc.
        var zoomRatioX = midX / canvas.clientWidth;
        var zoomRatioY = midY / canvas.clientHeight;

        // calculate the amounts zoomed from each edge of the screen
        const unitsZoomedX = trueWidth() * scaleAmount;
        const unitsZoomedY = trueHeight() * scaleAmount;

        const unitsAddLeft = unitsZoomedX * zoomRatioX;
        const unitsAddTop = unitsZoomedY * zoomRatioY;

        offsetX += unitsAddLeft;
        offsetY += unitsAddTop;

        redrawCanvas();
    }
    prevTouches[0] = event.touches[0];
    prevTouches[1] = event.touches[1];
}
function onTouchEnd(event) {
    singleTouch = false;
    doubleTouch = false;
}

socket.on('drawLine', (data) => {
    drawings.push({
        shape : 'freeform',
        x0: data.truePrevCursorX,
        y0: data.truePrevCursorY,
        x1: data.trueCursorX,
        y1: data.trueCursorY
    })
    drawLine(toScreenX(data.truePrevCursorX), toScreenY(data.truePrevCursorY), toScreenX(data.trueCursorX), toScreenY(data.trueCursorY));
})

socket.on('drawRectangle', (data) => {
    drawings.push({
        shape : 'rectangle',
        x0: data.trueConstantX,
        y0: data.trueConstantY,
        width: data.width,
        height: data.height
    })
    console.log(drawings);
    drawRectangle(toScreenX(data.trueConstantX), toScreenY(data.trueConstantY), data.width, data.height);
})
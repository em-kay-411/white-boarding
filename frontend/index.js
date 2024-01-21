const strokeStyle = '#000';
const lineWidth = 2;
const shape = 'rectangle';
const drawings = [];             // History of all the strokes
const prevTouches = [null, null]; // up to 2 touches
let singleTouch = false;        // Single Touch Indicatoe
let doubleTouch = false;        // Double touch indiacator
let cursorX;                    // Cursor X
let cursorY;                    // Cursor Y
let prevCursorX;                // Previous Cursor X
let prevCursorY;                // Previous Cursor Y
let constantX;                  // For shapes X
let constantY;                  // For shapes Y
let offsetX = 0;                // Distance from origin X
let offsetY = 0;                // Dostance from origin Y
let scale = 1;                  // Zoom amount
let leftMouseDown = false;      // Left Mouse Down Indicator
let rightMouseDown = false;     // Right Mouse Down Indicator
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// disable right clicking
document.oncontextmenu = function () {
    return false;
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
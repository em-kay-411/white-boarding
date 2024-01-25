let strokeStyle = 'black';
let lineWidth = 2;
let shape = 'freeform';
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
let prevWidth = 0;              // Previous width tracking for rectangle drawing
let prevHeight = 0;             // Previous height tracking for rectangle drawing
let offsetX = 0;                // Distance from origin X
let offsetY = 0;                // Dostance from origin Y
let scale = 1;                  // Zoom amount
let leftMouseDown = false;      // Left Mouse Down Indicator
let rightMouseDown = false;     // Right Mouse Down Indicator
let prevRadius = 0;             // Radius to keep track of circle
const freeformButton = document.getElementById('btnradio1');
const squareButton = document.getElementById('btnradio2');
const circleButton = document.getElementById('btnradio3');
const panButton = document.getElementById('btnradio4');
const selectButton = document.getElementById('btnradio5');
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

freeformButton.onclick = () => {
    shape = 'freeform';
}

squareButton.onclick = () => {
    shape = 'rectangle';
}

circleButton.onclick = () => {
    shape = 'circle';
}

panButton.onclick = () => {
    shape = 'panning';
}

selectButton.onclick = () => {
    shape = 'selection';
}

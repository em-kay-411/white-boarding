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
let recording = false;          // Recording status
const freeformButton = document.getElementById('btnradio1');
const squareButton = document.getElementById('btnradio2');
const circleButton = document.getElementById('btnradio3');
const panButton = document.getElementById('btnradio4');
const eraserButton = document.getElementById('btnradio5');
const recordZone = document.getElementById('recording');
const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const slider = document.getElementById('myRange');
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let roomID = prompt('Enter the room ID you want to join to!\n Click cancel to create your own room');

if(roomID){
    socket.emit('joinRoom', roomID);
}
else{
    roomID = generateRandomId(8);
    socket.emit('createRoom', roomID);
}

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

slider.oninput = () => {
    lineWidth = slider.value;
}

freeformButton.onclick = () => {
    shape = 'freeform';
}

freeformButton.ontouchstart = () => {
    shape = 'freeform';
}

squareButton.onclick = () => {
    shape = 'rectangle';
}

squareButton.ontouchstart = () => {
    shape = 'rectangle'
}

circleButton.onclick = () => {
    shape = 'circle';
}

circleButton.ontouchstart = () => {
    shape = 'circle';
}

panButton.onclick = () => {
    shape = 'panning';
}

panButton.ontouchstart = () => {
    shape = 'panning';
}

eraserButton.onclick = () => {
    shape = 'eraser';
}

eraserButton.onclick = () => {
    shape = 'eraser';
}

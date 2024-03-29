let strokeStyle = 'black';
let lineWidth = 2;
let prevText = '';
let shape = 'freeform';
let writing = false;
let drawings = [];             // History of all the strokes
const prevTouches = [null, null]; // up to 2 touches
let singleTouch = false;        // Single Touch Indicatoe
let doubleTouch = false;        // Double touch indiacator
let cursorX;                    // Cursor X
let cursorY;                    // Cursor Y
let prevCursorX;                // Previous Cursor X
let prevCursorY;                // Previous Cursor Y
let constantX;                  // For shapes X
let constantY;                  // For shapes Y
let prevConstantX;
let prevConstantY;
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
const typeButton = document.getElementById('btnradio6');
const recordZone = document.getElementById('recording');
const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const slider = document.getElementById('myRange');
const textBox = document.getElementById('textBox');
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
socket.emit('getHistory', roomID);

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
    textBox.style.display = 'none';
    shape = 'freeform';
}

freeformButton.ontouchstart = () => {
    textBox.style.display = 'none';
    shape = 'freeform';
}

squareButton.onclick = () => {
    textBox.style.display = 'none';
    shape = 'rectangle';
}

squareButton.ontouchstart = () => {
    textBox.style.display = 'none';
    shape = 'rectangle'
}

circleButton.onclick = () => {
    textBox.style.display = 'none';
    shape = 'circle';
}

circleButton.ontouchstart = () => {
    textBox.style.display = 'none';
    shape = 'circle';
}

panButton.onclick = () => {
    textBox.style.display = 'none';
    shape = 'panning';
}

panButton.ontouchstart = () => {
    textBox.style.display = 'none';
    shape = 'panning';
}

eraserButton.onclick = () => {
    textBox.style.display = 'none';
    shape = 'eraser';
}

eraserButton.onTouchStart = () => {
    textBox.style.display = 'none';
    shape = 'eraser';
}

typeButton.onclick = () => {
    shape = 'text';
}

typeButton.ontouchstart = () => {
    shape = 'text';
}

textBox.oninput = () => {
    cleanText(constantX, constantY, prevText, lineWidth);
    drawText(constantX, constantY, textBox.value, strokeStyle, lineWidth);
    prevText = textBox.value;
}

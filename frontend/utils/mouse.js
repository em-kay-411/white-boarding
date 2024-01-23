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
        else if ( shape === 'rectangle') {
            context.clearRect(constantX, constantY, prevWidth, prevHeight);
            const width = cursorX - constantX;
            const height = cursorY - constantY;
            drawRectangle(constantX, constantY, width, height); 
            prevWidth = width;
            prevHeight = height;      
        }        
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

        prevWidth = 0;
        prevHeight = 0;
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
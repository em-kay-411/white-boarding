function onMouseDown(event) {

    // detect left clicks
    if (event.button == 0) {
        leftMouseDown = true;
        rightMouseDown = false;
    }

    if (shape === 'panning') {
        rightMouseDown = true;
        leftMouseDown = false;
    }

    // update the cursor coordinates
    cursorX = event.pageX;
    cursorY = event.pageY;
    prevCursorX = event.pageX;
    prevCursorY = event.pageY;

    if (shape === 'rectangle') {
        constantX = cursorX;
        constantY = cursorY;
    }

    if (shape === 'circle') {
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

        if (shape === 'freeform') {
            // add the line to our drawing history 
            drawings.push({
                shape: 'freeform',
                x0: truePrevCursorX,
                y0: truePrevCursorY,
                x1: trueCursorX,
                y1: trueCursorY,
                color: strokeStyle
            })
            drawLine(prevCursorX, prevCursorY, cursorX, cursorY, strokeStyle);
            socket.emit('drawLine', ({ truePrevCursorX, truePrevCursorY, trueCursorX, trueCursorY, strokeStyle, roomID }));
        }
        else if (shape === 'rectangle') {
            const width = cursorX - constantX;
            const height = cursorY - constantY;
            drawRectangle(constantX, constantY, width, height, strokeStyle);
            prevWidth = width;
            prevHeight = height;
            context.clearRect(constantX, constantY, prevWidth, prevHeight);
        }
        else if (shape === 'circle') {
            const radius = Math.sqrt(Math.pow((constantX - cursorX), 2) + Math.pow((constantY - cursorY), 2));
            drawCircle(constantX, constantY, radius, strokeStyle);
            prevRadius = radius;
        }
    }

    if (rightMouseDown) {
        // move the screen
        offsetX += (cursorX - prevCursorX) / scale;
        offsetY += (cursorY - prevCursorY) / scale;
        redrawCanvas();
    }

    prevCursorX = cursorX;
    prevCursorY = cursorY;
}

function onMouseUp() {
    leftMouseDown = false;
    rightMouseDown = false;

    if (shape === 'rectangle') {
        const trueConstantX = toTrueX(constantX);
        const trueConstantY = toTrueY(constantY);
        const width = prevWidth;
        const height = prevHeight;
        drawings.push({
            shape: 'rectangle',
            x0: trueConstantX,
            y0: trueConstantY,
            width: width,
            height: height,
            color: strokeStyle
        })
        drawRectangle(constantX, constantY, width, height, strokeStyle);
        console.log(drawings);
        redrawCanvas();
        socket.emit('drawRectangle', ({ trueConstantX, trueConstantY, width, height, strokeStyle, roomID }));

        prevWidth = 0;
        prevHeight = 0;
    }
    else if (shape === 'circle') {
        const trueConstantX = toTrueX(constantX);
        const trueConstantY = toTrueY(constantY);
        const radius = prevRadius;
        drawings.push({
            shape: 'circle',
            x0: trueConstantX,
            y0: trueConstantY,
            radius: radius,
            color: strokeStyle
        })
        drawCircle(constantX, constantY, radius, strokeStyle);
        socket.emit('drawCircle', ({ trueConstantX, trueConstantY, radius, strokeStyle, roomID }));
    }
}

function onMouseOut() {
    leftMouseDown = false;
    rightMouseDown = false;
}

function onMouseWheel(event) {

    if (event.shiftKey) {
        const deltaY = event.deltaY;
        const scaleAmount = -deltaY / 500;
        scale = scale * (1 + scaleAmount);

        // zoom the page based on where the cursor is
        var distX = event.pageX / canvas.clientWidth;
        var distY = event.pageY / canvas.clientHeight;

        // calculate how much we need to zoom
        const unitsZoomedX = trueWidth() * scaleAmount;
        const unitsZoomedY = trueHeight() * scaleAmount;

        const unitsAddLeft = unitsZoomedX * distX;
        const unitsAddTop = unitsZoomedY * distY;

        offsetX -= unitsAddLeft;
        offsetY -= unitsAddTop;
    }
    else {
        const deltaY = event.deltaY;
        const deltaX = event.deltaX;
        offsetX += -deltaX / scale;
        offsetY += -deltaY / scale;
    }
    redrawCanvas();
}
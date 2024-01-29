function onTouchStart(event) {
    if (writing) {
        const trueConstantX = toTrueX(constantX);
        const trueConstantY = toTrueY(constantY);
        const text = textBox.value;
        drawings.push({
            shape: 'text',
            x0: trueConstantX,
            y0: trueConstantY,
            text: text,
            color: strokeStyle,
            lineWidth: lineWidth
        })
        cleanText(prevConstantX, prevConstantY, prevText, strokeStyle, lineWidth);
        drawText(prevConstantX, prevConstantY, textBox.value, strokeStyle, lineWidth);
        redrawCanvas();
        writing = false;
        textBox.style.display = 'none';
        textBox.style.border = 'none';
        textBox.value = '';
        socket.emit('drawText', ({ trueConstantX, trueConstantY, text, strokeStyle, lineWidth, roomID }));
        return;
    }

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

    constantX = event.touches[0].pageX;
    constantY = event.touches[0].pageY;

    if (shape === 'text' && !writing) {
        console.log('entered');
        textBox.style.display = 'block';
        textBox.style.top = `${constantY}px`;
        textBox.style.left = `${constantX}px`;
        textBox.style.transform = 'translate(-50%, -50%)';
        prevConstantX = constantX;
        prevConstantY = constantY;
        textBox.focus();
        writing = true;
    }
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
        if (shape === 'freeform') {
            drawings.push({
                shape: 'freeform',
                x0: truePrevCursorX,
                y0: truePrevCursorY,
                x1: trueCursorX,
                y1: trueCursorY,
                color: strokeStyle,
                lineWidth: lineWidth
            })
            drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y, strokeStyle, lineWidth);
            socket.emit('drawLine', ({ truePrevCursorX, truePrevCursorY, trueCursorX, trueCursorY, strokeStyle, lineWidth, roomID }));
        }
        else if (shape === 'eraser') {
            const tempStrokeStyle = strokeStyle;
            strokeStyle = 'white';
            drawings.push({
                shape: 'freeform',
                x0: truePrevCursorX,
                y0: truePrevCursorY,
                x1: trueCursorX,
                y1: trueCursorY,
                color: strokeStyle,
                lineWidth: lineWidth
            })
            drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y, strokeStyle, lineWidth);
            socket.emit('drawLine', ({ truePrevCursorX, truePrevCursorY, trueCursorX, trueCursorY, tempStrokeStyle, lineWidth, roomID }));
        }
        else if (shape === 'rectangle') {
            const width = touch0X - constantX;
            const height = touch0Y - constantY;
            drawRectangle(constantX, constantY, width, height, strokeStyle, lineWidth);
            prevWidth = width;
            prevHeight = height;
            context.clearRect(constantX, constantY, prevWidth, prevHeight);
        }
        else if (shape === 'circle') {
            const radius = Math.sqrt(Math.pow((constantX - touch0X), 2) + Math.pow((constantY - touch0Y), 2));
            drawCircle(constantX, constantY, radius, strokeStyle, lineWidth);
            prevRadius = radius;
        }
    }

    if (doubleTouch) {
        // get second touch coordinates
        event.preventDefault();
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
    
    if (singleTouch) {
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
                color: strokeStyle,
                lineWidth: lineWidth
            })
            drawRectangle(constantX, constantY, width, height, strokeStyle, lineWidth);
            redrawCanvas();
            socket.emit('drawRectangle', ({ trueConstantX, trueConstantY, width, height, strokeStyle, lineWidth, roomID }));

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
                color: strokeStyle,
                lineWidth: lineWidth
            })
            drawCircle(constantX, constantY, radius, strokeStyle, lineWidth);
            redrawCanvas();
            socket.emit('drawCircle', ({ trueConstantX, trueConstantY, radius, strokeStyle, lineWidth, roomID }));
        } 
    }
    singleTouch = false;
    doubleTouch = false;


}
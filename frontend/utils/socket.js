const socket = io('http://localhost:3000');
socket.on('drawLine', (data) => {
    drawings.push({
        shape: 'freeform',
        x0: data.truePrevCursorX,
        y0: data.truePrevCursorY,
        x1: data.trueCursorX,
        y1: data.trueCursorY,
        color: data.strokeStyle,
        lineWidth: data.lineWidth
    })
    drawLine(toScreenX(data.truePrevCursorX), toScreenY(data.truePrevCursorY), toScreenX(data.trueCursorX), toScreenY(data.trueCursorY), data.strokeStyle, data.lineWidth);
})

socket.on('drawRectangle', (data) => {
    drawings.push({
        shape: 'rectangle',
        x0: data.trueConstantX,
        y0: data.trueConstantY,
        width: data.width,
        height: data.height,
        color: data.strokeStyle,
        lineWidth: data.lineWidth
    })
    drawRectangle(toScreenX(data.trueConstantX), toScreenY(data.trueConstantY), data.width, data.height, data.strokeStyle, data.lineWidth);
})

socket.on('drawCircle', (data) => {
    drawings.push({
        shape: 'circle',
        x0: data.trueConstantX,
        y0: data.trueConstantY,
        radius: data.radius,
        color: data.strokeStyle,
        lineWidth: data.lineWidth
    })
    drawCircle(toScreenX(data.trueConstantX), toScreenY(data.trueConstantY), data.radius, data.strokeStyle, data.lineWidth);
})

socket.on('displayRoomID', (data) => {
    document.getElementById('roomID').innerHTML = `<div id="roomID">Room ID : ${data}</div>`
})
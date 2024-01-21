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
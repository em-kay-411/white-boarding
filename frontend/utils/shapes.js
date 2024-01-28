function drawLine(x0, y0, x1, y1, color, lineWidth) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
}

function drawRectangle(x, y, width, height, color, lineWidth) {
    // context.moveTo(x, y);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.strokeRect(x, y, width, height);
}

function drawCircle(x, y, radius, color, lineWidth){
    context.beginPath();
    context.arc(x, y, radius, 0, 2*Math.PI);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
}
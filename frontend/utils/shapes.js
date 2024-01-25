function drawLine(x0, y0, x1, y1, color) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
}

function drawRectangle(x, y, width, height, color) {
    // context.moveTo(x, y);
    context.strokeRect(x, y, width, height);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
}

function drawCircle(x, y, radius, color){
    context.beginPath();
    context.arc(x, y, radius, 0, 2*Math.PI);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
}
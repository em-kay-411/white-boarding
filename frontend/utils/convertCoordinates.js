function toScreenX(xTrue) {
    return (xTrue + offsetX) * scale;
}
function toScreenY(yTrue) {
    return (yTrue + offsetY) * scale;
}
function toTrueX(xScreen) {
    return (xScreen / scale) - offsetX;
}
function toTrueY(yScreen) {
    return (yScreen / scale) - offsetY;
}
function trueHeight() {
    return canvas.clientHeight / scale;
}
function trueWidth() {
    return canvas.clientWidth / scale;
}
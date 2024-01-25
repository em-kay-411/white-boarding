function changeColor(color) {
    const id = strokeStyle;
    strokeStyle = `${color}`;
    document.getElementById(`${color}`).style.left = '10px';
    document.getElementById(`${id}`).style.left = '0';
}
function redrawCanvas() {
    // set the canvas to the size of the window
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        if(line.shape === 'freeform'){            
            drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1));
        }
        else if(line.shape === 'rectangle'){
            drawRectangle(toScreenX(line.x0), toScreenY(line.y0), line.width, line.height);
        }        
    }
}
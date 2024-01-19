import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client'
import './App.css';

const socket = io('http://localhost:3001', { transports: ['websocket'] });

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({x : 0, y : 0});
  const [endPoint, setEndPoint] = useState({ x : 0, y : 0});
  const [shape, setShape] = useState('rectangle');

  useEffect(() => {
    if (shape === 'freeform') {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const handleMouseDown = () => {        
        setDrawing(true);
      };

      const handleMouseUp = (event) => {        
        setDrawing(false);        
        context.beginPath();
      };

      const handleMouseMove = (event) => {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Draw on the local canvas
        context.lineTo(x, y);
        context.stroke();

        // Send drawing data to the server
        socket.emit('draw', { x, y });
      };

      canvas.addEventListener('mousedown', handleMouseDown);  // When the mouse button is pressed
      canvas.addEventListener('mouseup', handleMouseUp);      // When the mouse button is released
      canvas.addEventListener('mousemove', handleMouseMove);  // When the mouse is moved

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    } 
    else if (shape === 'rectangle') {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');  
      const rect = canvas.getBoundingClientRect(); 

      const handleMouseDown = (event) => {
        setDrawing(true);
        setStartPoint({ x : event.clientX - rect.left, y : event.clientY - rect.top})
      };

      const handleMouseUp = (event) => {
        const endX = event.clientX - rect.left;
        const endY = event.clientY - rect.top;

        const width = endX - startPoint.x;
        const height = endY - startPoint.y;
        context.strokeRect(startPoint.x, startPoint.y, width, height);

        setDrawing(false);
      };

      const handleMouseMove = (event) => {
        if(!drawing) return;

        const endX = event.clientX - rect.left;
        const endY = event.clientY - rect.top;

        const width = endX - startPoint.x;
        const height = endY - startPoint.y;

        const startX = startPoint.x;
        const startY = startPoint.y;
        context.strokeRect(startX, startY, width, height);
        context.clearRect(startX, startY, width, height);

        // context.strokeRect(startPoint.x, startPoint.y, width, height);
        // context.clearRect(startPoint.x, startPoint.y, width, height)

        socket.emit('draw', { startPoint, width, height });
      };

      canvas.addEventListener('mousedown', handleMouseDown);  // When the mouse button is pressed
      canvas.addEventListener('mouseup', handleMouseUp);      // When the mouse button is released
      canvas.addEventListener('mousemove', handleMouseMove);      // When the mouse button is released


      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);      // When the mouse button is released
      };
    }
  }, [drawing, shape, startPoint]);

  useEffect(() => {
    // Receive drawing data from the server and draw on the canvas
    socket.on('draw', (data) => {
      if(shape === 'freeform'){
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
  
        context.lineTo(data.x, data.y);
        context.stroke();
      } 
      else if(shape === 'rectangle') {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.strokeRect(data.startPoint.x, data.startPoint.y, data.width, data.height);
        context.clearRect(data.startPoint.x, data.startPoint.y, data.width, data.height);
        

        if(drawing){
          context.clearRect(data.startPoint.x, data.startPoint.y, data.width, data.height);
        }        
      }
    });

    return () => {
      socket.off('draw');
    };
  }, [shape, drawing]);

  return (
    <div>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ border: '1px solid #000' }}></canvas>
    </div>
  );
}

export default App;

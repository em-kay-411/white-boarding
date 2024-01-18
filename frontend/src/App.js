import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client'
import './App.css';

const socket = io('http://localhost:3001', { transports : ['websocket'] }); 

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const handleMouseDown = () => {
      setDrawing(true);
    };

    const handleMouseUp = () => {
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

    canvas.addEventListener('mousedown', handleMouseDown); // When the mouse button is pressed
    canvas.addEventListener('mouseup', handleMouseUp);      // When the mouse button is released
    canvas.addEventListener('mousemove', handleMouseMove);  // When the mouse is moved

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [drawing]);

  useEffect(() => {
    // Receive drawing data from the server and draw on the canvas
    socket.on('draw', (data) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      context.lineTo(data.x, data.y);
      context.stroke();
    });

    return () => {
      socket.off('draw');
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #000' }}></canvas>
    </div>
  );
}

export default App;

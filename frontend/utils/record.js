let mediaRecorder;
let recordedChunks = [];

function startOrStopRecording() {
    if (!recording) {
        recordButton.style.display = 'none';
        stopButton.style.display = 'block';
        recording = true;
        startRecording();
    }
    else {
        stopButton.style.display = 'none';
        recordButton.style.display = 'block';
        recording = false;
        stopRecording();
    }
}

async function startRecording() {
    resetTimer();    
    console.log('Recording started');

    let stream;

    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' },
            audio: true,
        });
    } catch {
        stopButton.style.display = 'none';
        recordButton.style.display = 'block';
        recording = false;
        stopRecording();
        return;
    }

    startTimer();

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = `whiteboard-recording-${Date.now()}.mp4`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
}

function stopRecording() {
    try {
        mediaRecorder.stop();
    }
    catch {
        document.getElementById('timer').innerHTML = `Permission Denied`;
        return;
    }

    stopTimer();
    resetTimer();
    console.log('Recording stopped');
}
function startOrStopRecording() {
    if(!recording){
        recordButton.style.display = 'none';
        stopButton.style.display = 'block';
        recording = true;
        startRecording();
    }
    else{
        stopButton.style.display = 'none';
        recordButton.style.display = 'block';
        recording  = false;
        stopRecording();
    }
}

function startRecording(){
    resetTimer();
    startTimer();
    console.log('Recording started');
}

function stopRecording() {
    stopTimer();
    resetTimer();
    console.log('Recording stopped');
}
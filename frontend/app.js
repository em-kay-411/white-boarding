const express = require('express');
const app = express();
const FRONTEND_PORT = process.env.FRONTEND_PORT || 8000;

app.use(express.static("./"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(FRONTEND_PORT, () => {
    console.log('Frontend launched');
})
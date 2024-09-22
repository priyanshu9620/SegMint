const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
// this peice of code is used for single deployment thing 
app.use(express.static(path.join(__dirname, 'frontend/public'))); // Serve static files from the frontend
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());

// Routes
app.get('/predict', (req, res) => {
    res.end("<h1>Prediction Endpoint Reached</h1>");
});

// this peice of code is used for single deployment thing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/index.html')); // Serve the main HTML file
});

app.post('/predict', (req, res) => {
    const features = req.body.features;

    if (!Array.isArray(features)) {
        return res.status(400).json({ error: 'Invalid input format. Expected an array of features.' });
    }

    const args = features.map(f => f.toString());
    const pythonPath = 'python'; // Use 'python' to ensure it works in deployment
    const scriptPath = path.join(__dirname, 'predict.py'); // Dynamic path

    const pythonProcess = spawn(pythonPath, [scriptPath, ...args]);

    let data = '';
    let error = '';

    pythonProcess.stdout.on('data', (chunk) => {
        data += chunk;
    });

    pythonProcess.stderr.on('data', (chunk) => {
        error += chunk;
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python script error:', error);
            return res.status(500).json({ error: 'Error running Python script' });
        }

        try {
            if (data.trim().length === 0) {
                return res.status(500).json({ error: 'Python script returned no result' });
            }

            console.log('Raw result:', data);
            const prediction = JSON.parse(data);
            res.json(prediction);
        } catch (parseError) {
            console.error('Error parsing Python script output:', parseError);
            res.status(500).json({ error: 'Error parsing Python script output' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

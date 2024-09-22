const express = require('express');
const { PythonShell } = require('python-shell');
const { spawn } = require('child_process');
// i have encountered this cors error 
const cors=require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 4000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://127.0.0.1:5500'  
}));
app.use(bodyParser.json());

app.get('/predict', (req, res) => {
    res.end("<h1>reached</h1>")
})
app.get('/', (req, res) => {
    res.end("<h1>HOME</h1>")
})

app.post('/predict', (req, res) => {
    const features = req.body.features;

    if (!Array.isArray(features)) {
        return res.status(400).json({ error: 'Invalid input format. Expected an array of features.' });
    }
    const args = features.map(f => f.toString());
    args.map((e)=>{
        console.log(e);
    })
    const pythonPath = '/Users/priyanshugupta/anaconda3/bin/python';
    const scriptPath = '/Users/priyanshugupta/Desktop/SEGMENTATION PROJECT/predict.py';

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


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

document.getElementById('predictionForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const features = document.getElementById('features').value.split(',').map(Number);
    console.log(features);
    
    fetch('https://segmint.onrender.com/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: features }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('predictionResult').innerText = `cluster : ${data[0]}`;
    })
    .catch(error => console.error('Error:', error));
});



// 40.900749,0.818182,95.4,0,95.4,0,0.166667,0,0.083333,0,0,2,1000,201.802084,139.509787,0,12
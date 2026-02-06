const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.get('/nearby', async (req, res) => {
  const { lat, lon, type } = req.query;
  if (!lat || !lon || !type) {
    return res.status(400).json({ error: 'Missing lat, lon, or type' });
  }
  
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=16000&type=${type}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'API request failed' });
  }
});

app.get('/schools', async (req, res) => {
  const { lat, lon, city } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon' });
  }
  
  const results = [];
  const types = ['elementary school', 'middle school', 'high school'];
  const labels = ['Elementary', 'Middle', 'High'];
  
  for (let i = 0; i < types.length; i++) {
    try {
      const keyword = city ? city + ' ' + types[i] : types[i];
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=24000&keyword=${encodeURIComponent(keyword)}&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const school = data.results && data.results[0];
      results.push({
        type: labels[i],
        name: school ? school.name : 'Not found',
        vicinity: school ? school.vicinity : ''
      });
    } catch (err) {
      results.push({ type: labels[i], name: 'Error', vicinity: '' });
    }
  }
  
  res.json({ results });
});

app.get('/', (req, res) => {
  res.json({ status: 'Places API proxy running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));

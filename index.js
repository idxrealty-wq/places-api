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
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon' });
  }
  
  try {
    const types = [
      { keyword: 'elementary school', label: 'Elementary' },
      { keyword: 'middle school', label: 'Middle' },
      { keyword: 'high school', label: 'High' }
    ];
    
    const results = [];
    for (const t of types) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=16000&keyword=${encodeURIComponent(t.keyword)}&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const school = data.results?.[0];
      results.push({
        type: t.label,
        name: school?.name || 'Not found',
        vicinity: school?.vicinity || ''
      });
    }
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'API request failed' });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'Places API proxy running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

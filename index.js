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
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=8000&type=${type}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'API request failed' });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'Places API proxy running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

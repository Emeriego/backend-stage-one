// src/functions/api.js
const express = require('express');
const axios = require('axios');
const serverless = require('serverless-http');
const cors = require('cors');
const router = express.Router();

const app = express();
app.use(cors());

app.use((req, res, next) => {
  req.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // For testing purposes, replace the loopback address with a known public IP address
  if (req.clientIp === '::1' || req.clientIp === '127.0.0.1') {
    req.clientIp = '8.8.8.8'; // Replace with a known public IP address
  }

  next();
});

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.clientIp;

  try {
    const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const locationData = locationResponse.data;
    const city = locationData.city || 'Unknown location';

    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: '631232f24fa61757fcdd4a5e081f45a5',
        units: 'metric'
      }
    });
    const weatherData = weatherResponse.data;
    const temperature = weatherData.main.temp;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({
      error: 'An error occurred while fetching data'
    });
  }
});
app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

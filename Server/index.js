const { request, response } = require('express');
const express = require('express');
const app = express();
const port = 4000;
const fetch = require('node-fetch');
const { Navigator } = require("node-navigator");
const navigator = new Navigator();
const API_key = "4645df58e977acf9e592599426a48e2a";
const units = "metric";
app.use(express.static('public'));

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}

app.use(allowCrossDomain);

app.get('/getWeatherInfo', (request, response) => {
  
    navigator.geolocation.getCurrentPosition(async (position) => {
        const fetchApi = await fetch
            (`https://api.openweathermap.org/data/2.5/onecall?lat=${position.latitude}&lon=${position.longitude}&units=${units}&exclude=hourly,minutely,alerts&appid=${API_key}`,
                {
                    "method": "GET",
                });
        
        const fetchDataResponse = await fetchApi.json();
        response.json(fetchDataResponse);
    });
  });


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
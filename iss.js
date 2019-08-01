const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json',(err, response, body) => {
    
    if (err) {
      callback(err, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      // callback(Error(msg), null);
      callback(msg, null);
      return;
    }
   
    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });
};

const fetchCoordsByIP = (ip, callback) => {
  const geoLocation = 'https://ipvigilante.com/' + ip;
  request(geoLocation, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching geolocation. Response: ${body}`;
      callback(msg, null);
      return;
    }
    
    const {latitude, longitude} = JSON.parse(body).data;
    callback(null, {latitude, longitude});

  });
};


module.exports = { fetchMyIP , fetchCoordsByIP };

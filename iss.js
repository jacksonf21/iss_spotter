const request = require('request');

//FETCHES IP (1ST ASYNC)
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

//FETCHES COORDS WITH 1ST ASYNC'S DATA (2ND ASYNC)
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

//FETCHES ISSPASSTIMES WITH 2ND ASYNC'S DATA (3RD ASYNC)
const fetchISSPassTimes = (coords, callback) => {
  let { latitude, longitude } = coords;
  request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS Pass Times. Response: ${body}`;
      callback(msg, null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);

  });
};

//CALLS ALL ASYNCS IN ORDER VIA NESTING AND RETURNS THE RESULT ONLY IF ALL ARE SUCCESSFUL, ELSE RETURN ERROR
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSPassTimes(coords, (error, passTimes) => {
        if (error) {
          return callback(error, null)
        }

        callback(null, passTimes);
      });
    });
  });
};



module.exports = { nextISSTimesForMyLocation };

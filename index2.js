let { fetchMyIP , fetchCoordsByIP, fetchISSPassTimes } = require('./iss_promised');

fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSPassTimes)
  .then(val => {
    dateParse(val);
    // let result = JSON.parse(val).response
    // console.log(result);
  })
  .catch((error) => {
    console.log('It Didn\'t work', error.message)
  });

const dateParse = (str) => {
  let x = JSON.parse(str).response;
  x.forEach(i => {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(i.risetime);
    const duration = i.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  });
};
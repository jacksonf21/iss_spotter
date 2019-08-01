const { nextISSTimesForMyLocation} = require('./iss');

//INITS OVERALL ASYNCS
nextISSTimesForMyLocation((error, val) => {
  
  if (error) {
    return console.log('It didn\'t work!', error);
  };
  
  getDate(val);
});

//CONVERTS FINAL VAL ABOVE TO READABLE TEXT
const getDate = (passTimes) => {
  for (let pass of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(pass.risetime);
    const duration = pass.duration
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  }
};

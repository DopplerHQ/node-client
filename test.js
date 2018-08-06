const Doppler = require("./index")
const doppler = new Doppler(REPLACE_WITH_YOUR_API_KEY)

// Test Prediction
doppler.prediction("sentiment", {
  "texts": [
    "The book was good.",
    "At least it isn't a horrible book.",
    "Today SUX!"
  ]
}).then(console.log).catch(console.error)
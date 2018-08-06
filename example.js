// Social Sentiment - Easily find the sentiment of a sentence targeted for social media and support messages.
const Doppler = require("doppler-client")
const doppler = new Doppler("okximez4eaz53cpoikvalfswkrog9qgs4rfbwfp0")

// Input Data
const data = {
  "texts": [
    "The book was good.",
    "At least it isn't a horrible book.",
    "Today SUX!"
  ]
}

// API Request
await doppler.prediction("sentiment", data)
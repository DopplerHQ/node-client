process.env.DOPPLER_HOST = "http://api.localhost:3030"

const doppler = require("./index")({
  api_key: "okximez4eaz53cpoikvalfswkrog9qgs4rfbwfp0",
  environment: "localhost_1"
})

doppler.startup().then(function() {
  console.log(doppler.get("abc"))
})

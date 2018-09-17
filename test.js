const Doppler = require("./index")
const doppler = new Doppler({
  api_key: "okximez4eaz53cpoikvalfswkrog9qgs4rfbwfp0",
  pipeline: 2,
  environment: "development_primary"
})

doppler.startup().then(function() {
  console.log(doppler.get("abc"))
})

process.env.TESTER = "1110"

const Doppler = require("./index")
const doppler = new Doppler({
  api_key: "TicnD2E2808LTXv3r6l5r5Ssvtg1qNbZ8fsjq9LB",
  pipeline: 31,
  environment: "development_node"
})

console.log(doppler.get("abc"))
console.log(doppler.get("TESTER"))

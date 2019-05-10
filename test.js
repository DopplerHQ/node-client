/*
process.env.DOPPLER_API_KEY = "TicnD2E2808LTXv3r6l5r5Ssvtg1qNbZ8fsjq9LB"
process.env.DOPPLER_PIPELINE = "31"
process.env.DOPPLER_ENVIRONMENT = "development_node"
*/

const doppler = require("./index")()

console.log(doppler.get("TESTER"))
console.log(process.env.TESTER)

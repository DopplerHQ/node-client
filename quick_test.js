const Doppler = require("./index")

const start = new Date()
const doppler = Doppler({
  backup_filepath: "backup.env"
})
const end = new Date()

console.log("Doppler loaded in " + (end - start) + "ms")
console.log(doppler.get_all())
console.log(process.env.TESTER)
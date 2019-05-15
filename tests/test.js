test("env vars downloads", function() {
  const doppler = require("../index")()
  
  expect(doppler.get("TESTER")).toBe(process.env.TESTER)
  console.log(doppler.get("TESTER"))
  console.log(process.env.TESTER)
})

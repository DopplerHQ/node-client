const path = require('path')
const spawn = require('cross-spawn')

module.exports = function(data) {
  const response = spawn.sync("node", [path.join(__dirname, "request.js")], { 
    encoding: 'ascii',
    input: JSON.stringify(data)
  })
    
  if(response.stderr !== null && response.stderr.length > 0) {
    throw new Error(response.stderr)
  } else {
    return JSON.parse(response.stdout)
  }
}
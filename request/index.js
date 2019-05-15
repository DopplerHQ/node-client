var child_process = require('child_process')

module.exports = function(data) {
  const response = child_process.spawnSync(__dirname + "/request.js", [], { 
    encoding: 'ascii',
    input: JSON.stringify(data)
  })
    
  if(response.stderr !== null && response.stderr.length > 0) {
    throw new Error(response.stderr)
  } else {
    return JSON.parse(response.stdout)
  }
}
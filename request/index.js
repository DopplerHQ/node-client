var child_process = require('child_process')

module.exports = function(data) {
  const args = Buffer.from(JSON.stringify(data, null, 0)).toString('base64')
  const response = child_process.spawnSync(__dirname + "/request.js", [args], { encoding: 'utf8' })
    
  if(response.stderr !== null && response.stderr.length > 0) {
    throw new Error(response.stderr)
  } else {
    return JSON.parse(response.stdout)
  }
}
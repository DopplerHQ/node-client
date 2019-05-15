#!/usr/bin/env node

const needle = require("needle")
var input = null;

try {
  const raw_input = Buffer.from(process.argv[2], 'base64').toString('ascii')
  input = JSON.parse(raw_input)
} catch (error) {
  console.error(error)  
}

needle.get(input.url, input.options, function(error, response, body) {
  if (error) throw error;
  
  console.log(JSON.stringify({
    statusCode: response.statusCode,
    body: body
  }))
})
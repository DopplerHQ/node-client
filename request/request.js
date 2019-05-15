#!/usr/bin/env node

const needle = require("needle")
const fs = require("fs")
var input = null;

try {
  input = JSON.parse(fs.readFileSync(0).toString())
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
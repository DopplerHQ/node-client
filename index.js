const request = require("request-promise")
const requestSync = require("sync-request")
const fs = require("fs")
const path = require("path")
const dotenv = require("dotenv")
const config = require("./package")


class Doppler {
  
  constructor(data) {
    if(data.api_key === null || data.api_key.length === 0) {
      throw new Error("Please provide an 'api_key' on initialization.")
    }
    
    if(data.environment === null || data.environment.length === 0) {
      throw new Error("Please provide a 'environment' on initialization.")
    }
    
    if(data.pipeline === null) {
      throw new Error("Please provide a 'pipeline' on initialization.")
    }
    
    this.environment = data.environment
    this.remote_keys = {}
    this.host = process.env.DOPPLER_HOST || "https://api.doppler.com"
    this.ignore_variables = new Set(data.ignore_variables || [])
    this.max_retries = 10
    this.request_headers = {
      "api-key": data.api_key,
      "pipeline": data.pipeline,
      "client-version": data.client_version || config.version,
      "client-sdk": data.client_sdk || "node.js"
    }
    
    if(data.backup_filepath) {
      this.backup_filepath = path.resolve(process.cwd(), data.backup_filepath) 
    }
    
    this.startup()
  }
  
  // Private Methods
  startup(retry_count = 0) {
    const _this = this

    const response = _this.request({
      method: "POST",
      json: true,
      path: "/environments/" + _this.environment + "/fetch_keys"
    })
    
    const success = response[0]
    const body = response[1]
    
    if(success) {
      _this.remote_keys = body.keys
      _this.override_keys()
      _this.write_env()
      return
    }
    
    if(!body || !body.messages) {
      if(retry_count < _this.max_retries) {
        retry_count += 1
        return _this.startup(retry_count)
      } else {
        if(!!_this.backup_filepath && fs.existsSync(_this.backup_filepath)) {
          const response = dotenv.parse(fs.readFileSync(_this.backup_filepath))
          
          if(response !== null) {
            console.log("DOPPLER: Falling back to local backup at " + _this.backup_filepath)
            _this.remote_keys = response
            _this.override_keys()
            return
          }
        }
        
        console.error("DOPPLER: Failed to reach Doppler servers after " + retry_count  + " retries...")
      }
    }
    
    _this.error_handler(body)
  }
  
  write_env() {
    if(!this.backup_filepath) { return }
    
    var remote_body = []
    
    for(var key in this.remote_keys) {
      if(!this.remote_keys.hasOwnProperty(key)) { continue }
      
      const value = this.remote_keys[key]
      remote_body.push(key + " = " + value)
    }
    
    fs.writeFile(this.backup_filepath, remote_body.join("\n"), function(error) {
      if(error !== null) {
        console.error("Failed to write backup to disk with path " + this.backup_filepath)
      }  
    })
  }
  
    
  // Public Methods
  
  // Override: Custom ignore method  
  get(key_name) { 
    return this.remote_keys[key_name]
  }
  
  override_keys() {    
    var override_keys = Object.keys(this.remote_keys)
    
    for(var i in override_keys) {
      if(!override_keys.hasOwnProperty(i)) { continue }
      
      const key_name = override_keys[i]
      if(this.ignore_variables.has(key_name)) { continue }
      process.env[key_name] = this.remote_keys[key_name]
    }
  }
  
  request(data) {
    try {
      const res = requestSync("POST", (this.host + data.path), {
        json: data.body,
        headers: this.request_headers,
        timeout: 1500
      })
      
      return [
        (res.statusCode === 200),
        JSON.parse(res.body.toString("utf8"))
      ]
    
    } catch (error) {
      return [ false, null ]
    }
  }
  
  error_handler(response) {
    if(!response || !response.messages) { return }
    
    response.messages.forEach(function(error) {
      console.error(error)
    })
  }
  
}

var sharedInstance = null;
module.exports = function(data = {}) {
  data.api_key = data.api_key || process.env.DOPPLER_API_KEY || null
  data.pipeline = data.pipeline || process.env.DOPPLER_PIPELINE || null
  data.environment = data.environment || process.env.DOPPLER_ENVIRONMENT || null
  
  if(sharedInstance != null) { return sharedInstance }
  return sharedInstance = new Doppler(data)
}

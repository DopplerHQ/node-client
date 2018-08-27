request = require("request-promise")

class Doppler {
  
  constructor(data) {
    if(data.api_key == null || data.api_key.length == 0) {
      throw new Error("Please provide an 'api_key' on initialization.")
    }
    
    if(data.environment == null || data.environment.length == 0) {
      throw new Error("Please provide an 'environment' on initialization.")
    }
    
    this.api_key = data.api_key
    this.environment = data.environment
    this.remote_keys = {}
    this.host = process.env.DOPPLER_HOST || "https://api.doppler.market"
    this.defaultPriority = data.priority || Doppler.Priority.Remote
  }
  
  startup() {
    const _this = this
    
    return _this.request({
      method: "POST",
      body: { local_keys: process.env },
      json: true,
      path: "/environments/" + this.environment + "/fetch_keys",
    }).then(function(response) {
      _this.remote_keys = response.keys
    }).catch(this.error_handler)
  }
  
  get(key_name, priority = this.defaultPriority) {    
    if(!!this.remote_keys[key_name]) {
      if(priority == Doppler.Priority.Local && !!process.env[key_name]) {
        return process.env[key_name]
      }
      
      return this.remote_keys[key_name]
    }
    
    this.request({
      method: "POST",
      body: { key_name: key_name },
      json: true,
      path: "/environments/" + this.environment + "/missing_key",
    }).catch(this.error_handler)
    
    return process.env[key_name]
  }
  
  request(data) {
    return request({
      method: data.method,
      body: data.body,
      json: true,
      headers: {
        "api-key": this.api_key
      },
      timeout: 500,
      url: this.host + data.path,
    })
  }
  
  error_handler(response) {
    if(!response.error.messages) return
    response.error.messages.forEach(function(error) {
      console.error(error)
    })
  }
  
}

Doppler.Priority = Object.freeze({
  "Local": 1, 
  "Remote": 2
})

module.exports = Doppler
request = require("request-promise")

class Doppler {
  
  constructor(api_key, environment) {
    if(api_key == null || api_key.length == 0) {
      throw new Error("Please provide an 'api_key' on initialization.")
    }
    
    if(environment == null || environment.length == 0) {
      throw new Error("Please provide an 'environment' on initialization.")
    }
    
    this.api_key = api_key
    this.environment = environment
    this.remote_keys = {}
    this.host = process.env.DOPPLER_HOST || "https://api.doppler.market"
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
  
  get(key_name) {
    if(!!this.remote_keys[key_name]) {
      if(!!process.env[key_name]) {
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

module.exports = function(data) {
  return new Doppler(data.api_key, data.environment)
}
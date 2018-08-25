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
    
    return request({
      method: "POST",
      body: { local_keys: process.env },
      json: true,
      headers: {
        "api-key": this.api_key
      },
      url: this.host + "/environments/" + this.environment + "/fetch_keys",
    }).then(function(response) {
      _this.remote_keys = response.keys
    }).catch(function(error) {
      console.error(error.error.errors[0])
    })
  }
  
  get(key_name) {
    if(!!this.remote_keys[key_name]) {
      if(!!process.env[key_name]) {
        return process.env[key_name]
      }
      
      return this.remote_keys[key_name]
    }
    
    request({
      method: "POST",
      body: { key_name: key_name },
      json: true,
      headers: {
        "api-key": this.api_key
      },
      url: this.host + "/environments/" + this.environment + "/missing_key",
    })
    
    return process.env[key_name]
  }
  
}

module.exports = function(data) {
  return new Doppler(data.api_key, data.environment)
}
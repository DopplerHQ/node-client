request = require("request-promise")

class Doppler {
  
  constructor(data) {
    if(data.api_key == null || data.api_key.length == 0) {
      throw new Error("Please provide an 'api_key' on initialization.")
    }
    
    if(data.environment == null || data.environment.length == 0) {
      throw new Error("Please provide a 'environment' on initialization.")
    }
    
    if(data.pipeline == null) {
      throw new Error("Please provide a 'pipeline' on initialization.")
    }
    
    this.api_key = data.api_key
    this.environment = data.environment
    this.pipeline = data.pipeline
    this.remote_keys = {}
    this.host = process.env.DOPPLER_HOST || "https://api.doppler.market"
    this.defaultPriority = data.priority || Doppler.Priority.Remote
    this.send_local_keys = true
    this.ignore_keys = []
    this._set_ignore_keys = null
  }
  
  startup(retry_count = 0) {
    const _this = this
    const local_keys = {}
    this._set_ignore_keys = new Set(this.ignore_keys)
    
    if(this.send_local_keys) {    
      for(var key in process.env) {
        const value = process.env[key]
        
        if(!this._set_ignore_keys.has(key)) {
          local_keys[key] = value
        }
      }
    }
    
    return _this.request({
      method: "POST",
      body: { local_keys: local_keys },
      json: true,
      path: "/environments/" + this.environment + "/fetch_keys",
    }).then(function(response) {
      _this.remote_keys = response.keys
    }).catch(function(response) {
      if(!response.error.messages) {
        if(retry_count < 10) {
          retry_count += 1
          console.error("DOPPLER: Failed to reach Doppler servers. Retrying for the " + retry_count + " time now...")
          return _this.startup(retry_count)
        } else {
          console.error("DOPPLER: Failed to reach Doppler servers. Stopping retries...")
        }
      }
      
      _this.error_handler(response)
    })
  }
  
  get(key_name, priority = this.defaultPriority) {    
    if(!!this.remote_keys[key_name]) {
      if(priority == Doppler.Priority.Local && !!process.env[key_name]) {
        return process.env[key_name] || null
      }
      
      return this.remote_keys[key_name]
    }

    if(!this._set_ignore_keys.has(key_name)) {
      this.request({
        method: "POST",
        body: { key_name: key_name },
        json: true,
        path: "/environments/" + this.environment + "/missing_key",
      }).catch(this.error_handler)
    }
    
    return process.env[key_name] || null
  }
  
  request(data) {
    return request({
      method: data.method,
      body: data.body,
      json: true,
      headers: {
        "api-key": this.api_key,
        "pipeline": this.pipeline
      },
      timeout: 1500,
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
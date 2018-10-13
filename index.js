request = require("request-promise")
requestSync = require("sync-request")

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
    this.override_local_keys = data.override_local_keys || false
    this.send_local_keys = data.send_local_keys != null ? data.send_local_keys: true
    this.ignore_keys = new Set(data.ignore_keys || [])
    this.max_retries = 10
    this._startup()
  }
  
  // DEPRECATED: This method is no longer needed and will be removed
  //             in a later version.
  startup() {
    return Promise.resolve()
  }
  
  _startup(retry_count = 0) {
    const _this = this
    const local_keys = {}
    
    if(this.send_local_keys) {    
      for(var key in process.env) {
        const value = process.env[key]
        
        if(!this.ignore_keys.has(key)) {
          local_keys[key] = value
        }
      }
    }
    
    const response = _this.requestSync({
      method: "POST",
      body: { local_keys: local_keys },
      json: true,
      path: "/environments/" + this.environment + "/fetch_keys"
    })
    
    const success = response[0]
    const body = response[1]
    
    if(success) {
      _this.remote_keys = body.keys
      _this.override_keys()
      return
    }
    
    if(!body || !body.error.messages) {
      if(retry_count < _this.max_retries) {
        retry_count += 1
        return _this._startup(retry_count)
      } else {
        console.error("DOPPLER: Failed to reach Doppler servers after " + retry_count  + " retries...")
      }
    }
    
    _this.error_handler(body)
  }
  
  get(key_name, priority = this.defaultPriority) {    
    if(!!this.remote_keys[key_name]) {
      if(priority == Doppler.Priority.Local && !!process.env[key_name]) {
        return process.env[key_name] || null
      }
      
      return this.remote_keys[key_name]
    }

    if(!this.ignore_keys.has(key_name)) {
      this.request({
        method: "POST",
        body: { key_name: key_name },
        json: true,
        path: "/environments/" + this.environment + "/missing_key",
      }).catch(this.error_handler)
    }
    
    return process.env[key_name] || null
  }
  
  override_keys() {
    if(this.override_local_keys === false) return
    
    var override_keys = this.override_local_keys
    
    if(override_keys === true) {
      override_keys = Object.keys(this.remote_keys)
    }
    
    for(var i in override_keys) {
      const key_name = override_keys[i]
      process.env[key_name] = this.remote_keys[key_name]
    }
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
  
  requestSync(data) {
    try {
      const res = requestSync("POST", (this.host + data.path), {
        json: data.body,
        headers: {
          "api-key": this.api_key,
          "pipeline": this.pipeline
        },
        timeout: 1500
      })
      
      return [
        (res.statusCode == 200),
        JSON.parse(res.body.toString("utf8"))
      ]
    
    } catch (error) {
      return [ false, null ]
    }
  }
  
  error_handler(response) {
    if(!response || !response.error.messages) return
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
const request = require("request-promise")
const requestSync = require("sync-request")
const fs = require("fs")
const path = require("path")
const dotenv = require("dotenv")

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
    
    this.api_key = data.api_key
    this.environment = data.environment
    this.pipeline = data.pipeline
    this.remote_keys = {}
    this.host = process.env.DOPPLER_HOST || "https://api.doppler.market"
    this.defaultPriority = data.priority || Doppler.Priority.Remote
    this.override_local_keys = data.override_local_keys || false
    this._track_keys = data.track_keys || []
    this._ignore_keys = new Set(data.ignore_keys || [])
    this._missing_keys = []
    this.timeout = null
    this.max_retries = 10
    
    if(data.backup_filepath) {
      this.backup_filepath = path.resolve(process.cwd(), data.backup_filepath) 
    }
    
    this._startup()
    this._reset_tracking()
  }
  
  // DEPRECATED: This method is no longer needed and will be removed
  //             in a later version.
  startup() {
    return Promise.resolve()
  }
  
  // Private Methods
  _startup(retry_count = 0) {
    const _this = this

    const response = _this.requestSync({
      method: "POST",
      json: true,
      path: "/environments/" + _this.environment + "/fetch_keys"
    })
    
    const success = response[0]
    const body = response[1]
    
    if(success) {
      _this.remote_keys = body.keys
      _this.override_keys()
      _this._write_env()
      return
    }
    
    if(!body || !body.messages) {
      if(retry_count < _this.max_retries) {
        retry_count += 1
        return _this._startup(retry_count)
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
  
  _track_key(key_name) {
    return !this._ignore_keys.has(key_name) && !this.ignore_key(key_name)
  }
  
  _write_env() {
    if(!this.backup_filepath) { return }
    
    var remote_body = []
    var local_body = []
    
    for(var key in this.remote_keys) {
      if(!this.remote_keys.hasOwnProperty(key)) { continue }
      
      const value = this.remote_keys[key]
      remote_body.push(key + " = " + value)
    }
    
    for(var i in this._track_keys) {
      if(!this._track_keys.hasOwnProperty(i)) { continue }
      
      const key = this._track_keys[i]
      const value = process.env[key]
      
      if(!this.remote_keys.hasOwnProperty(key)) {
        local_body.push(key + " = " + value)
      }
    }
    
    var body = []
    
    if(remote_body.length > 0) {
      body.push("# ----- Remote Keys -----\n" + remote_body.join("\n"))
    } 
    
    if(local_body.length > 0) {
      body.push("# ----- Local Keys -----\n" + local_body.join("\n"))
    } 
    
    fs.writeFile(this.backup_filepath, body.join("\n\n"), function(error) {
      if(error !== null) {
        console.error("Failed to write backup to disk with path " + this.backup_filepath)
      }  
    })
  }
  
  _reset_tracking() {
    if(this.timeout) {
      clearTimeout(this.timeout)
    }
    
    this.timeout = setTimeout(this._send_tracked_key.bind(this), 100)
  }
  
  _send_tracked_key() {
    const _this = this
    const local_keys = {}
    
    for(var i in this._track_keys) {
      if(!this._track_keys.hasOwnProperty(i)) { continue }
      
      const key = this._track_keys[i]
      const value = process.env[key]
      local_keys[key] = value
    }
    
    if(Object.keys(local_keys).length > 0 || this._missing_keys.length > 0) {      
      this.request({
        method: "POST",
        body: { 
          local_keys,
          missing_keys: this._missing_keys
        },
        json: true,
        path: "/environments/" + this.environment + "/track_keys",
      }).then(function() {
        _this._missing_keys = []
        _this._track_keys = []
      })
    }
  }
  
  // Public Methods
  
  // Override: Custom ignore method
  ignore_key(key_name) {
    return false
  }
  
  get(key_name, priority = this.defaultPriority) { 
    const _this = this;   
    var value = undefined;
    
    if(priority === Doppler.Priority.Local) {
      value = process.env.hasOwnProperty(key_name) ? process.env[key_name] : _this.remote_keys[key_name]
    } else {
      value = _this.remote_keys.hasOwnProperty(key_name) ? _this.remote_keys[key_name] : process.env[key_name]
    }

    if(_this._track_key(key_name)) {
      if(value === undefined || value === null) {
        _this._missing_keys.push(key_name)
        _this._reset_tracking()
      } else if(process.env[key_name] !== _this.remote_keys[key_name]) {
        _this._track_keys.push(key_name)
        _this._reset_tracking()
      }
    }
    
    return value
  }
  
  override_keys() {
    if(this.override_local_keys === false) { return }
    
    var override_keys = this.override_local_keys
    
    if(override_keys === true) {
      override_keys = Object.keys(this.remote_keys)
    }
    
    for(var i in override_keys) {
      if(!override_keys.hasOwnProperty(i)) { continue }
      
      const key_name = override_keys[i]
      process.env[key_name] = this.remote_keys[key_name]
    }
  }
  
  request(data) {
    const _this = this;
    
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
    }).catch(function(response) {
      _this.error_handler(response.error)
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

Doppler.Priority = Object.freeze({
  "Local": 1, 
  "Remote": 2
})

module.exports = Doppler
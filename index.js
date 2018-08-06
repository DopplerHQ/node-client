request = require("request-promise")

class Doppler {
  
  constructor(api_key) {
    if(api_key == null || api_key.length == 0) {
      throw new Error("Please provide an 'api_key' on client initialization.")
    }
    
    this.api_key = api_key
  }
  
  prediction(app_name, input) {
    if(app_name == null || app_name.length == 0) {
      return Promise.reject("Please provide an 'app_name'.")
    }
    
    if(input == null || Object.keys(input).length == 0) {
      return Promise.reject("Please provide an 'input' with at least one value.")
    }
    
    return request({
      method: "POST",
      body: input,
      json: true,
      headers: {
        "api-key": this.api_key
      },
      url: "https://api.doppler.market/v1/consumer/apps/" + app_name + "/prediction",
    }).then(function(response) {
      return response.output
      
    }).catch(function(error) {
      return Promise.reject(error.error.errors)
    })
  }
  
}

module.exports = Doppler
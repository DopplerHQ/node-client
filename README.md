# Doppler Node.js Library

[![Version](https://img.shields.io/npm/v/doppler-client.svg)](https://www.npmjs.org/package/doppler-client)
[![Downloads](https://img.shields.io/npm/dm/doppler-client.svg)](https://www.npmjs.com/package/doppler-client)
[![Try on RunKit](https://badge.runkitcdn.com/doppler-client.svg)](https://runkit.com/npm/doppler-client)

The Doppler Node library provides convenient access to the Doppler API from
applications written for **only** server-side JavaScript.

## Installation

Install the package with:
``` js
npm install doppler-client --save
```

## Usage

The package needs to be configured with your account's api key which is available in your [Doppler account](https://doppler.market/workplace/api_key), pipeline identifier and the environment name:

``` js
const Doppler = require("doppler-client")
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME
})

// Rest of Your Application
```


Or using ES6:

``` js
import * as Doppler from 'doppler-client';
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME
})

// Rest of Your Application
```


Or using TypeScript:

``` ts
import * as Doppler from 'doppler-client';
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME
})

// Rest of Your Application
```


## Key Best Practices

So if Doppler stores my environment keys, where should I keep my Doppler API keys?

That is a great question! We recommend storing your `API_KEY`, `PIPELINE_ID`, and `ENVIRONMENT_NAME` 
in local environment. That means the only keys you should be storing in your local environment are the Doppler keys. All other keys should be be fetched by the Doppler client.


### Fetch Environment Keys

You can fetch your environment keys from Doppler by calling the `get(name)` method.

``` js
doppler.get(KEY_NAME)
```

Here is an example:

``` js
const config = {
  segment_key: doppler.get("SEGMENT_API_KEY"),
  algolia_key: doppler.get("ALGOLIA_API_KEY")
}

```


If there are differences between the values your local environment sets and the ones on Doppler, the client will use the ones provided by Doppler. You can override this behavior by passing in a second argument to the `get(key_name, priority)` method that sets the priority to favor your local environment.

For example:

``` js
// Local Enviroment
process.env.MAGICAL_KEY="123"

// Doppler
MAGICAL_KEY="456"


// Default Behavior
doppler.get("MAGICAL_KEY") // => "456"

// Override to Local
doppler.get("MAGICAL_KEY", Doppler.Priority.Local) // => "123"
```

You can also set the priority globally on initialization:

``` js
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME,
  priority: Doppler.Priority.Local
})

```


## Local Key Privacy

By default the Doppler client will send all your local environment keys on `init`. This
is done for 2 reasons. Collecting your local keys helps us automatically setup your pipelines
for immediate use. After setup we also use your keys to detect when your keys locally have
changed from what is on Doppler. We then provide a way for you to adopt or reject those changes
through our dashboard. This can help help when debugging silent bugs or build failures.

If you would like the Doppler client to not send your keys we provide 2 ways to do it.

### Globally
To ensure all your local keys are not sent to Doppler, set the `send_local_keys` attribute to `false`.

``` js
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME,
  send_local_keys: false
})
```


### Individual Key
You can also ignore specific local keys by adding them to the `ignore_keys` array.

``` js
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME,
  ignore_keys: [
    "SUPER_SECRET_KEY"
  ]
})
```


## Extra Information

- [Doppler](https://doppler.market)
- [API KEY](https://doppler.market/workplace/api_key)


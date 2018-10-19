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

## Fallback to Backup

The Doppler client accepts a `backup_filepath` on init. If provided the client will write
the remote keys to a backup file. If the Doppler client fails to connect to our API
endpoint (very unlikely), the client will fallback to the keys provided in the backup file.

``` js
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME,
  priority: Doppler.Priority.Local,
  backup_filepath: "./backup.env"
})
```


## Local Key Privacy

By default the Doppler client will only track the local environment keys that are used during `doppler.get()`.
Collecting only those local keys helps us automatically setup your pipelines
for immediate use. After setup we also use your keys to detect when your keys locally have
changed from what is on Doppler. We then provide a way for you to adopt or reject those changes
through our dashboard. This can help help when debugging silent bugs or build failures.


### Track Additional Keys
The Doppler client can also track additional keys by providing an array of keys to the `track_keys` field.

``` js
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME,
  send_local_keys: false,
  track_keys: [
    "KEY_TO_TRACK"
  ]
})
```


### Ignoring Specific Keys
Inversely, you can also ignore specific local keys by adding them to the `ignore_keys` array.

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

or dynamically...

``` js
const doppler = new Doppler({ ... })

doppler.ignore_key = function(key_name) {
  return key_name == "SUPER_SECRET_KEY"
}
```

## Overriding Local Keys

The Doppler client by default will not override your local environment keys because it
can create unknown side effects if the developer didn't take this into account. But 
if you would like Doppler to override your local environment keys, you can do it for 
all variables on Doppler or just the ones you specify.

### Globally
To have all your local keys  overridden by Doppler's remote keys, set the `override_local_keys` attribute to `true`.

``` js
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME,
  override_local_keys: true
})
```


### Individual Key
You can also override specific local keys by setting `override_local_keys` to be an array of keys.

``` js
const doppler = new Doppler({
  api_key: process.env.API_KEY,
  pipeline: process.env.PIPELINE_ID,
  environment: process.env.ENVIRONMENT_NAME,
  override_local_keys: [
    "PORT",
    "SPECIAL_KEY"
  ]
})
```


## Extra Information

- [Doppler](https://doppler.market)
- [API KEY](https://doppler.market/workplace/api_key)


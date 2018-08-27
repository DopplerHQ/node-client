# Doppler Node.js Library

[![Version](https://img.shields.io/npm/v/doppler-client.svg)](https://www.npmjs.org/package/doppler-client)
[![Downloads](https://img.shields.io/npm/dm/doppler-client.svg)](https://www.npmjs.com/package/doppler-client)
[![Try on RunKit](https://badge.runkitcdn.com/doppler-client.svg)](https://runkit.com/npm/doppler-client)

The Doppler Node library provides convenient access to the Doppler API from
applications written in client and server-side JavaScript.

## Documentation

See the [REST API docs](https://help.doppler.market).

## Installation

Install the package with:
``` js
npm install doppler-client --save
```

## Usage

The package needs to be configured with your account's api key which is
available in your [Doppler Account](https://doppler.market/account) and the environment name. Require it with the key's value:

``` js
const Doppler = require("doppler-client")
const doppler = new Doppler({
  api_key: API_KEY,
  environment: ENVIRONMENT_NAME
})

doppler.startup().then(function() {
  // Rest of Your Application
})
```


Or using TypeScript:

``` ts
import * as Doppler from 'doppler-client';
const doppler = new Doppler({
  api_key: API_KEY,
  environment: ENVIRONMENT_NAME
})

doppler.startup().then(function() {
  // Rest of Your Application
})
```

### Fetch Environment Keys

You can fetch your environment keys from Doppler by calling the `get(name)` method. It is important to
note that you must call `get()` after `startup()` has completed.

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


If there are differences between the values your local environment sets and the ones on Doppler, the client will
use the ones provided by Doppler. You can override this behavior by passing in a second argument to
the `get(key_name, priority)` method that sets the priority to favor your local enviroment.

For example:

``` js
// Local Enviroment
process.env.MAGICAL_KEY="123"

// Doppler
MAGICAL_KEY="456"


// Default Behavior
doppler.get("MAGICAL_KEY") // => "456"

// Override to Local
doppler.get("MAGICAL_KEY", Doppler.Priority.Local)
```

You can also set the priority globally on initialization:

``` js
const doppler = new Doppler({
  api_key: API_KEY,
  environment: ENVIRONMENT_NAME,
  priority: Doppler.Priority.Local
})

```


## Extra Information

- [Doppler](https://doppler.market)
- [API KEY](https://doppler.market/account)
- [FAQs](https://help.doppler.market)


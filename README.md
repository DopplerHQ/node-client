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
const doppler = require("doppler-client")({
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
const doppler = Doppler("doppler-client")({
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


## Development

Run all tests:

```bash
$ npm install
$ npm test
```

## Extra Information

- [Doppler](https://doppler.market)
- [API KEY](https://doppler.market/account)
- [FAQs](https://help.doppler.market)


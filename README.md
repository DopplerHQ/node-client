# Doppler Node.js Library

[![Version](https://img.shields.io/npm/v/doppler-client.svg)](https://www.npmjs.org/package/doppler-client)
[![Downloads](https://img.shields.io/npm/dm/doppler-client.svg)](https://www.npmjs.com/package/doppler-client)
[![Try on RunKit](https://badge.runkitcdn.com/doppler-client.svg)](https://runkit.com/npm/doppler-client)

The Doppler Node library provides convenient access to the Doppler API from
applications written in client and server-side JavaScript.

## Documentation

See the [REST API docs](https://docs.doppler.market/v1/reference).

## Installation

Install the package with:
``` js
npm install doppler-client --save
```

## Usage

The package needs to be configured with your account's secret key which is
available in your [Doppler Account](https://doppler.market/account). Require it with the key's value:

``` js
const Doppler = require("doppler-client")
const doppler = new Doppler('API_KEY');

doppler.prediction("sentiment", {
  "texts": [
    "This is an awesome node package!"
  ]
})
```


Or using TypeScript:

``` ts
import * as Doppler from 'doppler-client';
const doppler = new Doppler('API_KEY');
```

### Using Promises

Every method returns a chainable promise which can be used instead of a regular callback:

``` js
// Create a prediction on the pos tagger app.
doppler.prediction("nlp-pos", {
	"texts": "Doppler is an app store for machine learning."
}).then(function(output) {
  // Prediction output
}).catch(function(err) {
  // Error response
});
```

### Versioning

Doppler apps are versioned and by default will use the latest version. You can set a specific version using this format. App versions increment by whole numbers: 1, 2, 3....

```
APP_NAME@VERSION
```

Lets look at an example:

``` js
// Create a prediction on the pos tagger app for version 2.
doppler.prediction("nlp-pos@2", {
	"texts": "Doppler is an app store for machine learning."
}).then(function(output) {
  // Prediction output
}).catch(function(err) {
  // Error response
});
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
- [Documentation](https://doc.doppler.market)
- [FAQs](https://help.doppler.market)


# Doppler Node.js Library

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/DopplerHQ/node-client)
[![Version](https://img.shields.io/npm/v/doppler-client.svg)](https://www.npmjs.org/package/doppler-client)
[![Downloads](https://img.shields.io/npm/dm/doppler-client.svg)](https://www.npmjs.com/package/doppler-client)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ee88ca15a8fb48068c5643b037ea978b)](https://www.codacy.com/app/Doppler/node-client?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DopplerHQ/node-client&amp;utm_campaign=Badge_Grade)
[![Try on RunKit](https://badge.runkitcdn.com/doppler-client.svg)](https://runkit.com/npm/doppler-client)

The Doppler Node library provides convenient access to the Doppler API from
applications written for **only** server-side JavaScript.

## Installation

Install the package with:

``` bash
npm install doppler-client --save
```

## Usage

The package needs to be configured with your account's api key which is available in your [Doppler account](https://doppler.com/workplace/api_key), pipeline identifier and the environment name:


### Environment Variables Required
Please add these environment variables to your `.env` file in the root directory or on your infra provider.

```
DOPPLER_API_KEY = <API Key>
DOPPLER_PIPELINE = <Pipeline ID>
DOPPLER_ENVIRONMENT = <Environment Name>
```

### Lookup Priority
Doppler will look for these variables in 3 places with the following priority:

1. Passed in as initialization arguments
2. Read from environment variables
3. Read from `.env` file


### One Line Install
This installation method will expect the `DOPPLER_API_KEY`, `DOPPLER_PIPELINE`, `DOPPLER_ENVIRONMENT` as environment variables.

``` js
require("doppler-client")()


// Rest of Your Application
const example_variable = process.env.EXAMPLE_VARIABLE
```

### Install with Arguments
This installation method will expect the `api_key`, `pipeline`, `environment` as arguments.

``` js
require("doppler-client")({
  api_key: process.env.DOPPLER_API_KEY,
  pipeline: process.env.DOPPLER_PIPELINE,
  environment: process.env.DOPPLER_ENVIRONMENT
})


// Rest of Your Application
const example_variable = process.env.EXAMPLE_VARIABLE
```


## Key Best Practices

So if Doppler stores my environment variables, where should I keep my Doppler API keys?

That is a great question! We recommend storing your `DOPPLER_API_KEY`, `DOPPLER_PIPELINE`, and `DOPPLER_ENVIRONMENT` 
in a `.env` file or with your infra provider. That means the only variables you should be storing in your local environment are the Doppler keys. All other variables should be be fetched by the Doppler client.


## Ignoring Specific Variables

In the case you would want to ignore specific variables from Doppler, say a port set by Heroku, you can add it the `ignore_variables` field.

``` js
require("doppler-client")({
  ignore_variables: ["PORT"]
})
```

## Fallback to Backup

The Doppler client accepts a `backup_filepath` on init. If provided the client will write
the Doppler variables to a backup file. If the Doppler client fails to connect to our API
endpoint (very unlikely), the client will fallback to the keys provided in the backup file.

``` js
require("doppler-client")({
  backup_filepath: "./backup.env"
})
```

## Extra Information

- [Doppler](https://doppler.com)
- [API KEY](https://doppler.com/workplace/api_key)

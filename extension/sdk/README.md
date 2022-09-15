# LWV-AA Voter Lookup SDK

This the back-end SDK used by our web extension that has the core logic for looking up a voter's
county and registration details.

## SDK API

* [`LWVAA.setMapboxToken(tokenString)`](#TODO)
* [`LWVAA.searchAddress(addressString)`](#TODO)
* [`LWVAA.getStates()`](#TODO)
* [`LWVAA.getState(stateId)`](#TODO)
* [`LWVAA.getCounties(stateId)`](#TODO)
* [`LWVAA.getCounty(countyId)`](#TODO)
* [`LWVAA.lookupVoter(lookupOptionId, lookupParams)`](#TODO)


### `LWVAA.setMapboxToken(tokenString)`
Set a token that can be used in `searchAddress(...)` to auto-complete address queries.

#### Arguments
* `tokenString` - A token that can use Mapbox's [Geocoding API](https://docs.mapbox.com/api/search/geocoding/)

#### Returns (asynchronous)
```
true
```

#### Example
```
const tokenIsSet = await LWVAA.setMapboxToken("pk.ey49jfjddfj...");
```


### `LWVAA.searchAddress(addressString)`
Search for addresses from a partial address string. Results include the address match's state and county, and whether those areas are supported by the SDK for looking up voters.

#### Arguments
* `addressString` - An address (can be partial) that is used by the Mapbox Geocoding API to look up the user's state and county.

#### Returns (asynchronous)
```
{
    "success": true|false,
    "results": [  // only on success=true
        {
            "address": "<address>",         // full auto-completed address
            "stateId": "<stateId>"|null,    // state ID that can be used in getState(...), null if state is not supported
            "stateName": "<str>",           // human-readable state name
            "countyId": "<countyId>"|null,  // state ID that can be used in getCounty(...), null if county is not supported
            "countyName": "<str>",          // human-readable county name
            "zipCode": "<str>",             // the 5-digit zip code for the address
        },
        ...
    ],
    "error": "no_mapbox_token|",  // only on success=false
]
```

#### Example
```
const addressMatches = await LWVAA.searchAddress("123 Main St, Austin, TX");
console.log(addressMatches);

{
    "success": true,
    "results": [
        {
            "address": "123 Main Street, Austin, TX 78787, United States",
            "stateId": "s_tx",
            "stateName": "Texas",
            "countyId": "c_tx_travis",
            "countyName": "Travis County",
            "zipCode": "12345",
        }
    ]
}
```


### `LWVAA.getStates()`
Load the list of states that are supported by this voter lookup SDK.

#### Arguments
* None

#### Returns (asynchronous)
```
[
    {
        "stateId": "<stateId>", // state ID that can be used in getState(...)
        "stateName": "<str>",   // human-readable state name
    },
    ...
]
```

#### Example
```
const states = await LWVAA.getStates();
console.log(states);

[
    {
        "stateId": "s_tx",
        "stateName": "Texas",
    }
]
```


### `LWVAA.getState(stateId)`
Load the state details and voter lookup options for a specific state.

#### Arguments
* `stateId` - The state ID from either the `searchAddress(...)` or `getStates()`

#### Returns (asynchronous)
```
{
    "stateId": "<stateId>",
    "stateName": "<str>",
    "lookupOptions": [
        {
            "lookupOptionId": "<lookupOptionId>",
            "name": "<str>",
            "sources": ["<lookupSource>", ...],
            "params": {"<paramKey>": "<isRequired>", ...},
        },
        ...
    ],
}
```

#### Possible `<lookupSource>` values
* `stateWebsite` - query the state's voter lookup website
* `countyWebsite` - query the county's voter lookup website

#### Possible `<paramKey>` values
* `firstName` - first name
* `lastName` - last name
* `nameSuffix` - name suffix (e.g. `"Junior"`)
* `countyId` - `<countyId>` from `getCounties(...)`
* `birthDate` - birthday in ISO8601 date format (`"YYYY-MM-DD"`)
* `zipCode` - zip code
* `driversLicense` - drivers license number
* `vuid` - voter unique ID

#### Possible `<isRequired>` values
* `required` - the parameter is required for the lookup option
* `optional` - the parameter is optional for the lookup option

#### Example
```
const state = await LWVAA.getState("s_tx");
console.log(state);

{
    "stateId": "s_tx",
    "stateName": "Texas",
    "lookupOptions": [
        {
            "lookupOptionId": "l_tx_nameandbday",
            "name": "Name, Birthday, and Zipcode",
            "sources": ["stateWebsite"],
            "params": {
                "firstName": "required",
                "lastName": "required",
                "nameSuffix": "optional",
                "birthDate": "required",
                "countyId": "required",
                "zipCode": "required",
            },
        },
        {
            "lookupOptionId": "l_tx_dlicense",
            "name": "Drivers License and Birthday",
            "sources": ["stateWebsite"],
            "params": {
                "driversLicense": "required",
                "birthDate": "required",
            },
        },
        {
            "lookupOptionId": "l_tx_vuid",
            "name": "VUID and Birthday",
            "sources": ["stateWebsite"],
            "params": {
                "vuid": "required",
                "birthDate": "required",
            },
        },
    ],
}
```


### `LWVAA.getCounties(stateId)`
Load the list of counties that are supported by this voter lookup SDK.

#### Arguments
* `stateId` (optional) - only list counties from the specified state

#### Returns (asynchronous)
```
[
    {
        "stateId": "<stateId>",   // state ID that can be used in getState(...)
        "stateName": "<str>",     // human-readable state name
        "countyId": "<countyId>", // county ID that can be used in getCounty(...)
        "countyName": "<str>",    // human-readable county name
    },
    ...
]
```

#### Example
```
const counties = await LWVAA.getCounties();
console.log(counties);

[
    {
        "stateId": "s_tx",
        "stateName": "Texas",
        "countyId": "c_tx_travis",
        "countyName": "Travis County",
    }
]
```


### `LWVAA.getCounty(countyId)`
Load the county details and voter lookup options for a specific county.

#### Arguments
* `countyId` - The county ID from either the `searchAddress(...)` or `getCounties()`

#### Returns (asynchronous)
```
{
    "stateId": "<stateId>",
    "stateName": "<str>",
    "countyId": "<countyId>",
    "countyName": "<str>",
    "lookupOptions": [...], // same format as getState() lookupOptions
}
```

#### Example
```
const county = await LWVAA.getCounty("c_tx_travis");
console.log(county);

{
    "stateId": "s_tx",
    "stateName": "Texas",
    "countyId": "c_tx_travis",
    "countyName": "Travis County",
    "lookupOptions": [
        {
            "lookupOptionId": "l_tx_travis_nameandbday",
            "name": "Name and Birthday",
            "sources": ["countyWebsite"],
            "params": {
                "firstName": "required",
                "lastName": "required",
                "birthDate": "required",
            },
            "countyIds": ["*"],
        },
    ],
}
```

### `LWVAA.lookupVoter(lookupOptionId, lookupParams)`
Look up a voter's registration details

#### Arguments
* `lookupOptionId` - The lookup option ID from either the `getState(...)` or `getCounty(...)`
* `lookupParams` - An object with the provided lookup parameter values given by the user

#### Returns (asynchronous)
```
{
    "result": "<result>",
    "data": {"<dataKey>": <dataValue>, ...}
    "sources": [
        {
            "source": "<lookupSource>",
            "result": "<result>",
            "started": "<datetime>",
            "completed": "<datetime>",
            "data": {"<dataKey>": "<dataValue>", ...}
        },
        ...
    ],
}
```

#### Possible `<result>` values
* `success` - all sources found the voter details and they matched
* `mixed` - some sources found the voter, but others either failed or didn't find the voter (see the sources list of individual source results)
* `failed` - all sources returned errors when trying to find the voter
* `empty` - all sources weren't able to find the voter

#### Possible `<dataKey>` - `<dataValue>` values
* `stateId` - `"<stateId>"` - the state where the voter is registered
* `countyId` - `"<countyId>"` - the county where the voter is registered
* `precinctId` - `"<precinctId>"` - the precinct in which the voter resides (currently this ID is unused)
* `vuid` - `"<str>"` - the voter's unique ID for the state
* `registrationDate` - `"<date>"` - when the voter registered in ISO8601 date format (`"YYYY-MM-DD"`)
* `status` - `"<registrationStatus>"` - the voter's registration status
* `name` - `"<str>"` - the voter's registered full name
* `residentialAddress` - `"<str>"` - the voter's registered address
* `mailingAddress` - `"<str>"` - the voter's mailing address
* `districts` - `<object>` - a key-value object of district IDs (`{"<districtIdName>": "<districtId>", ...}`) of which the voter is a part (currently these IDs are unused)

#### Possible `<registrationStatus>` values
* `active` - the voter's registration is active
* `pending` - the voter's registration is not yet complete
* `revoked` - the voter's registration has been revoked

#### Errors
* `InteractionRequiredError` - When all sources have a captcha or other human-interaction requirement preventing looking up a voter using the SDK alone. See the "Completing human interactions" documentation in the web extension README.
* `RequestPermissionError` - When lookup on all sources have been prevented due to the SDK not having permission to make requests to the needed websites.
* `SourcesParsingError` - When all sources' results weren't able to be parsed (due to either an unknown error returned by them or a change in their behavior that this tool has not yet been updated to handle). Email `droesler@lwvaustin.org` if you see this and he will help troubleshoot.
* `SourcesUnavailableError` - When all sources were unresponsive or down for maintenance

#### Example
```
const voterResult = await LWVAA.getCounty(
    "l_tx_travis_nameandbday",
    {
        "firstName": "John",
        "lastName": "Smith",
        "birthDate": "2000-01-01",
    },
);
console.log(voterResult);


{
    "result": "success", // "success|mixed|failed|empty"
    "data": {
        "stateId": "s_tx",
        "countyId": "c_tx_travis",
        "precinctId": "p_tx_travis_pecinct_111",
        "vuid": "11111111111",
        "registrationDate": "2020-01-01",
        "status": "active",
        "name": "JOHN SMITH",
        "residentialAddress": "123 MAIN ST, AUSTIN, TX 78787",
        "mailingAddress": "123 MAIN ST, AUSTIN, TX 78787",
        "districts": {
            "countryCongressDistrictId": "d_us_congress_tx_111",
            "stateCongressDistrictId": "d_tx_congress_111",
            "stateSenateDistrictId": "d_tx_senate_111",
            "cityDistrictId": "d_tx_city_austin_111",
            "schoolDistrictId": "d_tx_school_austinisd_111",
        },
    },
    "sources": [
        {
            "source": "stateWebsite",
            "result": "success",
            "started": "2020-01-01T00:00:00Z",
            "completed": "2020-01-01T00:00:01Z",
            "data": {
                "countyId": "c_tx_travis",
                "vuid": "11111111111",
                "registrationDate": "2020-01-01",
                "status": "active",
                "name": "JOHN SMITH",
                "residentialAddress": "123 MAIN ST, AUSTIN, TX 78787",
            },
        },
        {
            "source": "countyWebsite",
            "result": "success",
            "started": "2020-01-01T00:00:01Z",
            "completed": "2020-01-01T00:00:02Z",
            "data": {
                "registrationDate": "2020-01-01",
                "name": "JOHN SMITH",
                "residentialAddress": "123 MAIN ST, AUSTIN, TX 78787",
                "mailingAddress": "123 MAIN ST, AUSTIN, TX 78787",
                "districts": {
                    "countryCongressDistrictId": "d_us_congress_tx_111",
                    "stateCongressDistrictId": "d_tx_congress_111",
                    "stateSenateDistrictId": "d_tx_senate_111",
                    "cityDistrictId": "d_tx_city_austin_111",
                    "schoolDistrictId": "d_tx_school_austinisd_111",
                },
            },
        },
    ],
}
```



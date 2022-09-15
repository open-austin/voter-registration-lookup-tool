
// Universal Module Definition (UMD)
(async (root) => {

    /*****************************/
    /** State Module References **/
    /*****************************/
    const _stateSDKs = [
        "./states/TX.js",
        // ...add more supported states here
    ]

    // main reference objects
    const _stateRef = {
    //  "<stateId>": {
    //      "stateId": "<stateId>",
    //      "stateName": "<str>",
    //      "counties": {"<countyId>": {...}, ...},
    //      "lookupOptions": [<lookupOption>, ...],
    //      "mapboxName": "<str>", (optional, if different from stateName)
    //  },
    //  ...
    };
    const _countyRef = {
    //  "<countyId>": {
    //      "stateId": "<stateId>",
    //      "stateName": "<str>",
    //      "countyId": "<countyId>",
    //      "countyName": "<countyName>",
    //      "lookupOptions": [<lookupOption>, ...]],
    //      "mapboxName": "<str>", (optional, if different from countyName)
    //  },
    //  ...
    };
    const _lookupOptionRef = {
    //  "<lookupOptionId>": {
    //      "lookupOptionId": "<lookupOptionId>",
    //      "name": "<lookupOptionName>",
    //      "sources": ["<lookupSource>", ...],
    //      "params": {"<paramKey>": "<isRequired>", ...},
    //      "doLookup": async function,
    //      "countyIds": ["<countyId>", ...],
    //  },
    //  ...
    };
    const _mapboxStateRef = {
    //  "<mapbox_region_name>": {stateRef},
    //  ...
    };
    const _mapboxCountyRef = {
    //  "<mapbox_district_name>": {countyRef},
    //  ...
    };

    // load each state's SDK
    // (assumes each SDK has an object called "stateRef" in the normal stateRef object format)
    for (let i = 0; i < _stateSDKs.length; i++) {
        const state = await import(_stateSDKs[i]);
        _stateRef[state.stateRef.stateId] = state.stateRef;

        // use specified mapbox name, with fallback as the state name
        _mapboxStateRef[state.stateRef.mapboxName || state.stateRef.stateName] = state.stateRef;
    }

    // populate county and lookup option references based on loaded state objects
    // (assumes each stateRef has a counties object and state-level lookup options list)
    for (let stateId in _stateRef) {
        const state = _stateRef[stateId]

        // populate state-level lookup options
        for (let i = 0; i < state.lookupOptions.length; i++) {
            const lookupOption = state.lookupOptions[i];
            _lookupOptionRef[lookupOption.lookupOptionId] = lookupOption;
        }

        // populate counties
        for (let countyId in state.counties) {
            const county = state.counties[countyId];
            _countyRef[countyId] = county;

            // use specified mapbox name, with fallback as the county name
            _mapboxCountyRef[county.mapboxName || county.countyName] = county;

            // populate county-level lookup options
            for (let i = 0; i < county.lookupOptions.length; i++) {
                const lookupOption = county.lookupOptions[i];
                _lookupOptionRef[lookupOption.lookupOptionId] = lookupOption;
            }
        }
    }

    /********************/
    /** Address Search **/
    /********************/

    // set the address search/auto-complete geocoding token
    let _mapbboxToken = undefined;
    async function _setMapboxToken(newToken) {
        _mapbboxToken = newToken;
        return true;
    }

    // geocode an address to get the jurisdiction
    async function _searchAddress(addressVal) {

        // error out if mapbox token isn't set
        if (_mapbboxToken === undefined) {
            return {
                "success": false,
                "error": "no_mapbox_token",
            };
        }

        // make request to mapbox
        let mapboxResponse = undefined;
        const qVal = encodeURIComponent(addressVal);
        const qParams = (new URLSearchParams({
            "access_token": _mapbboxToken,
            "autocomplete": true,
            "proximity": "-97.743,30.267",  // Austin, TX
            "country": "us",
            "types": "address",
        })).toString();
        try {
            mapboxResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${qVal}.json?${qParams}`);

        // unknown error
        } catch (fetchErr) {
            console.log("mapbox_error", fetchErr);
            return {
                "success": false,
                "error": "mapbox_error",
            };
        }

        // non-200 response
        if (mapboxResponse.status !== 200) {
            console.log("ERROR mapboxResponse", mapboxResponse);
            return {
                "success": false,
                "error": "mapbox_error",
                "statusCode": mapboxResponse.status,
            };
        }

        // mapboxJson = {
        //  ...
        //  "features": [
        //      {
        //          ...
        //          "place_name": "1807 West 35th Street, Austin, Texas 78703, United States",
        //          ...
        //          "context": [
        //              ...
        //              {
        //                  "id": "district.14251652747735210",
        //                  "text": "Travis County",
        //                  ...
        //              },
        //              ...
        //          ],
        //          ...
        //      },
        //      ...
        //  ],
        //  ...
        // }
        const mapboxJson = await mapboxResponse.json();

        // render the address results
        const results = [];
        for (let featureIndex = 0; featureIndex < mapboxJson['features'].length; featureIndex++) {
            const mapboxFeature = mapboxJson['features'][featureIndex];

            // determine the county for the result
            let regionName = undefined;     // i.e. state
            let districtName = undefined;   // i.e. county
            let postcode = undefined;       // i.e. zip code
            mapboxFeature['context'].forEach((mapboxContext) => {
                if (mapboxContext['id'].indexOf("region.") === 0) { regionName = mapboxContext['text'] }
                if (mapboxContext['id'].indexOf("district.") === 0) { districtName = mapboxContext['text'] }
                if (mapboxContext['id'].indexOf("postcode.") === 0) { postcode = mapboxContext['text'] }
            });

            // only add results that have a county
            if (regionName && districtName) {
                results.push({
                    "stateName": (_mapboxStateRef[regionName] || {"stateName": regionName})['stateName'],
                    "stateId": (_mapboxStateRef[regionName] || {"stateId": null})['stateId'],
                    "countyName": (_mapboxCountyRef[districtName] || {"countyName": districtName})['countyName'],
                    "countyId": (_mapboxCountyRef[districtName] || {"countyId": null})['countyId'],
                    "address": mapboxFeature['place_name'],
                    "zipCode": postcode,
                });
            }
        }
        return {
            "success": true,
            "results": results,
        };
    }

    /********************/
    /** Lookup Options **/
    /********************/

    // return a list of supported states
    async function _getStates() {
        let statesResult = [];
        for (stateId in _stateRef) {
            statesResult.push({
                "stateId": _stateRef[stateId].stateId,
                "stateName": _stateRef[stateId].stateName,
            });
        }
        statesResult.sort((a, b) => { return a.stateName < b.stateName ? -1 : 1; });
        return statesResult;
    }

    // return the properties of a specific state
    async function _getState(stateId) {
        let state = _stateRef[stateId];
        stateResult = {
            "stateId": state.stateId,
            "stateName": state.stateName,
            "lookupOptions": [],
        };
        for (lookupOption of state.lookupOptions) {
            stateResult['lookupOptions'].push({
                "lookupOptionId": lookupOption.lookupOptionId,
                "name": lookupOption.name,
                "sources": lookupOption.sources,
                "params": lookupOption.params,
            });
        }
        return state;
    }


    /********************/
    /** Public SDK API **/
    /********************/
    root.LWVAA = {
        setMapboxToken: _setMapboxToken,
        searchAddress: _searchAddress,
        getState: _getState,
        getStates: _getStates,
        //getCounty: _getCounty,
        //getCounties: _getCounties,
        //lookupVoter: _lookupVoter,
    };
})(this);


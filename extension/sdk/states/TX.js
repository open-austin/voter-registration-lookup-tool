const stateId = "s_tx";
const stateName = "Texas";

async function lookupNameBdayZip (params) {
    /////////TODO
    console.log("lookupNameBdayZip", params);
}

async function lookupTravisNameBday (params) {
    /////////TODO
    console.log("lookupTravisNameBday", params);
}

async function lookupDriversLicense (params) {
    /////////TODO
    console.log("lookupDriversLicense", params);
}

async function lookupVUID (params) {
    /////////TODO
    console.log("lookupVUID", params);
}

// lookup options reference
const lookupOptionRef = {
    // state-level options
    "l_tx_namebdayzip": {
        "name": "Name, Birthday, and Zipcode",
        "sources": ["stateWebsite", "countyWebsite"],
        "params": {
            "firstName": "required",
            "lastName": "required",
            "nameSuffix": "optional",
            "birthDate": "required",
            "countyId": "required",
            "zipCode": "required",
        },
        "doLookup": lookupNameBdayZip,
        "countyIds": ["*"],
    },
    "l_tx_dlicense": {
        "name": "Drivers License and Birthday",
        "sources": ["stateWebsite"],
        "params": {
            "driversLicense": "required",
            "birthDate": "required",
        },
        "doLookup": lookupDriversLicense,
        "countyIds": ["*"],
    },
    "l_tx_vuid": {
        "name": "VUID and Birthday",
        "sources": ["stateWebsite"],
        "params": {
            "VUID": "required",
            "birthDate": "required",
        },
        "doLookup": lookupVUID,
        "countyIds": ["*"],
    },

    // Travis county
    "l_tx_travis_namebday": {
        "name": "Name and Birthday",
        "sources": ["stateWebsite"],
        "params": {
            "firstName": "required",
            "lastName": "required",
            "birthDate": "required",
        },
        "doLookup": lookupTravisNameBday,
        "countyIds": ["c_tx_travis"],
    },
}
// add lookupOptionId to objects (so both key and in object)
for (let k in lookupOptionRef) {
    lookupOptionRef[k]['lookupOptionId'] = k;
    lookupOptionRef[k]['stateId'] = stateId;
}

// shorthand county reference (fully populated below)
const countyRef = {
    "c_tx_travis": { "countyName": "Travis County" },
    "c_tx_williamson": { "countyName": "Williamson County" },
    "c_tx_hays": { "countyName": "Hays County" },
}
// add state and lookup options to counties
for (let k in countyRef) {
    countyRef[k]['stateId'] = stateId;
    countyRef[k]['stateName'] = stateName;
    countyRef[k]['countyId'] = k;
    countyRef[k]['lookupOptions'] = [];  // populated below
    for (let lookupOptionId in lookupOptionRef) {
        const lookupOption = lookupOptionRef[lookupOptionId];
        for (let j = 0; j < lookupOption['countyIds'].length; j++) {
            const countyId = lookupOption['countyIds'][j];
            if ( countyId === "*" || countyId === k ) {
                countyRef[k]['lookupOptions'].push(lookupOption);
            }
        }
    }
}

// build state reference with state-wide lookup options
const stateRef = {
    "stateId": stateId,
    "stateName": stateName,
    "counties": countyRef,
    "lookupOptions": [],  // populated below
}
for (let lookupOptionId in lookupOptionRef) {
    const lookupOption = lookupOptionRef[lookupOptionId];
    // only include wildcard lookup options (meaning they can be used for all counties)
    if (lookupOption['countyIds'].length > 0 && lookupOption['countyIds'][0] === "*" ) {
        stateRef['lookupOptions'].push(lookupOption);
    }
}

// Public API
export { stateRef };

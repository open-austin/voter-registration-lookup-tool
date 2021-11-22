console.log("background!!!!!", this);

async function actionGetCounties (actionPayload) {
    return new Promise(resolve => { setTimeout( () => { resolve({ "counties": [] }); }, 500); });
}

// handle content page action requests
browser.runtime.onMessage.addListener((actionPayload, sender) => {
    switch (actionPayload['action']) {

        case "getCounties":
            return actionGetCounties(actionPayload);

        default:
            return Promise.resolve({ error: "unknownAction" });
    }
});


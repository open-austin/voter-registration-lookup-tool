// setup message channel to proxy page script requests to the SDK
let sharedPort = undefined;
window.addEventListener("message", (initEvt) => {
    if (initEvt.data === "LWVAAExtensionSetup") {
        sharedPort = initEvt.ports[0];
        sharedPort.onmessage = async (pageMsg) => {
            let response = await browser.runtime.sendMessage(pageMsg.data);
            sharedPort.postMessage({"id": pageMsg.data['id'], "response": response});
        };
        sharedPort.postMessage({"name": "LWV-AA_SDK", "version": 1});
    }
});

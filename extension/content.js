// listen for a public key from the page and derive a shared key to be used for messages
let sharedKey = undefined;

// derive a shared key between the page and the content script
async function doKeyExchange (pagePubJwk) {

    // load the page's public key
    const pagePubkey = await crypto.subtle.importKey("jwk", pagePubJwk, { name: "ECDH", namedCurve: "P-256" }, false, []);

    // generate the extension's keypair
    const extensionKey = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
    const extensionPubJwk = await crypto.subtle.exportKey("jwk", extensionKey.publicKey);

    // derive the shared key
    sharedKey = await crypto.subtle.deriveKey({ name: "ECDH", namedCurve: "P-256", public: pagePubkey }, extensionKey.privateKey, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);

    // send the extension's public key back to the page
    window.postMessage({ extensionPubJwk: extensionPubJwk }, "*");
}

// the page has requested an action be taken by the extension
async function doAction (iv64, encrypted64, channelPort) {

    // convert encrypted from base64 to Uint8Array
    const encryptedRaw = atob(encrypted64);
    const encryptedBytes = new Uint8Array(encryptedRaw.length);
    for (let i = 0; i < encryptedRaw.length; i++) {
        encryptedBytes[i] = encryptedRaw.charCodeAt(i);
    }

    // convert initialization vector from base64 to Uint8Array
    const ivRaw = atob(iv64);
    const ivBytes = new Uint8Array(ivRaw.length);
    for (let i = 0; i < ivRaw.length; i++) {
        ivBytes[i] = ivRaw.charCodeAt(i);
    }

    // decrypt the message
    let payloadBuffer = undefined;
    try {
        payloadBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBytes.buffer, tagLength: 128 }, sharedKey, encryptedBytes.buffer);
    }
    // decryption error
    catch (decryptedErr) {
        console.log("decryptionError:", decryptedErr);
        channelPort.postMessage({"error": "decryptionError"});
        return;
    }

    // load the decrypted data into json
    let payloadJson = undefined;
    try {
        payloadJson = JSON.parse((new TextDecoder()).decode(payloadBuffer));
    }
    // payload parse error
    catch (parseErr) {
        console.log("payloadParseError:", parseErr);
        channelPort.postMessage({"error": "payloadParseError"});
        return;
    }

    // call the action
    let result = await browser.runtime.sendMessage(payloadJson);

    // return the action's results
    channelPort.postMessage(result);
}

// listen for a public key from the page and derive a shared key to be used for messages
window.addEventListener("message", (evt) => {

    // broadcast of the page's public key (trust on first use)
    if (sharedKey === undefined && evt.ports.length === 0 && typeof evt.data === "object" && evt.data['pagePubJwk']) {
        doKeyExchange(evt.data['pagePubJwk']);
    }

    // specific channel message (for individual call/responses)
    if (evt.ports.length === 1 && evt.data['encrypted']) {
        doAction(evt.data['iv'], evt.data['encrypted'], evt.ports[0]);
    }
});


// proxy content script requests to the SDK
browser.runtime.onMessage.addListener((payload, sender) => {
    return this.LWVAA[payload['func']].apply(null, payload['args']);
});

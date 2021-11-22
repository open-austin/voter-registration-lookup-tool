(async (context) => {

    function countyLookupByAddress (addr) {
        console.log("countyLookupByAddress", addr);
    }

    context.LWVAA = {
        actions: {
            countyLookupByAddress: countyLookupByAddress,
        },
        states: {
            TX: await import("./states/TX.js"),
        }
    }
})(this);


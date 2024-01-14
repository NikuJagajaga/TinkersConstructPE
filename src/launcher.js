ConfigureMultiplayer({
    name: "Tinkers' Construct",
    version: "2.2.0",
    isClientOnly: false
});

ModAPI.addAPICallback("KernelExtension", function(api){
    if(typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 300){
        Launch({KEX: api});
    }
});

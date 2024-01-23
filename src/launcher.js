ConfigureMultiplayer({
    name: "Tinkers' Construct",
    version: "2.2.1",
    isClientOnly: false
});

//Launch();


ModAPI.addAPICallback("KernelExtension", function(api){
    if(typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 300){
        Launch({KEX: api});
    }
});

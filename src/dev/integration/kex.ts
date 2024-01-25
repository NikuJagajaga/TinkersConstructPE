//@ts-ignore
let KEX: typeof KEX;
ModAPI.addAPICallback("KernelExtension", function(api: typeof KEX){
    if(typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 300){
        //@ts-ignore
        KEX = api;
    }
});

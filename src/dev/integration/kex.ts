//@ts-ignore
let KEX: typeof KEX;
ModAPI.addAPICallback("KernelExtension", function(api: typeof KEX){
    if(typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 300){

        //@ts-ignore
        KEX = api;

        Callback.addCallback("PostLoaded", () => {
            PartRegistry.replaceTooltipsWithKEX(api);
            TconToolFactory.addKEXFeature(api);
        });

        api.LootModule.addOnDropCallbackFor("entities/wither_skeleton", (drops, context) => {
            const player = context.getKillerPlayer();
            if(Math.random() < (player ? 0.1 : 0.05)){
                drops.addItem(ItemID.tcon_necrotic_bone, 1, 0);
            }
        });

    }
});

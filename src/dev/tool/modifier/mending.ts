createItem("tcon_moss", "Ball of Moss");
createItem("tcon_mending_moss", "Mending Moss");
Recipes2.addShapeless(ItemID.tcon_moss, [{id: "mossy_cobblestone", count: 9}]);
Item.registerUseFunction(ItemID.tcon_moss, (coords, item, block, playerUid) => {
    if(block.id === VanillaBlockID.bookshelf){
        const player = new PlayerEntity(playerUid);
        const region = WorldRegion.getForActor(playerUid);
        const level = player.getLevel();
        if(level < 10){
            BlockEngine.sendMessage(Network.getClientForPlayer(playerUid), "Mending Moss requires at least 10 levels");
            return;
        }
        player.setLevel(level - 10);
        player.decreaseCarriedItem();
        player.addItemToInventory(ItemID.tcon_mending_moss, 1, 0);
        region.playSound(coords, "random.orb", 0.5);
    }
});


class ModMending extends TinkersModifier {

    constructor(){
        super("mending", "Mending", 13, [ItemID.tcon_mending_moss], 1, true);
    }

    override onMending(level: number): number {
        return level;
    }
    
}
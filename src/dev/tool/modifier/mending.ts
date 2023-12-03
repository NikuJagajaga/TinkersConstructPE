createItem("tcon_moss", "Ball of Moss");
createItem("tcon_mending_moss", "Mending Moss");
Recipes2.addShapeless(ItemID.tcon_moss, [{id: "mossy_cobblestone", count: 9}]);
Item.registerUseFunction(ItemID.tcon_moss, (coords, item, block) => {
    if(block.id === VanillaBlockID.bookshelf){
        if(Player.getLevel() < 10){
            Game.tipMessage("Mending Moss requires at least 10 levels");
            return;
        }
        Player.addLevel(-10);
        Player.decreaseCarriedItem();
        Player.addItemToInventory(ItemID.tcon_mending_moss, 1, 0);
        //World.playSoundAtEntity(player, "random.orb", 1);
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
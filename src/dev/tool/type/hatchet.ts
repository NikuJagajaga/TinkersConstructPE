const textureHatchet = new ToolTexture("model/tcontool_hatchet", 3, 1);


class TinkersHatchet extends TinkersTool {

    constructor(){
        super(["wood", "plant"], 3, 1);
    }

    override buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        stats.attack += 0.5;
        return stats;
    }

    override damagePotential(): number {
        return 1.1;
    }

    override getTexture(): ToolTexture {
        return textureHatchet;
    }

    override onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile): true {
        if(!item.extra){
            return true;
        }
        const toolData = new ToolData(item);
        const blockData = ToolAPI.getBlockData(block.id);
        if(this.blockMaterials[blockData.material.name] && toolData.stats.level >= blockData.level && !toolData.isBroken()){
            toolData.forEachModifiers((mod, level) => {
                mod.onDestroy(item, coords, block, 0, level);
            });
            if(blockData.material.name !== "plant"){
                toolData.consumeDurability(this.isWeapon ? 2 : 1);
                if(!this.isWeapon){
                    toolData.addXp(1);
                }
            }
        }
        return true;
    }

    useItem(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile): void {
        if(!item.extra){
            return;
        }
        const toolData = new ToolData(item);
        let id: number;
        if(block.id === VanillaBlockID.log){
            switch(block.data){
                case 0: id = VanillaBlockID.stripped_oak_log; break;
                case 1: id = VanillaBlockID.stripped_spruce_log; break;
                case 2: id = VanillaBlockID.stripped_birch_log; break;
                case 3: id = VanillaBlockID.stripped_jungle_log; break;
            }
        }
        else if(block.id === VanillaBlockID.log2){
            id = block.data === 0 ? VanillaBlockID.stripped_acacia_log : VanillaBlockID.stripped_dark_oak_log;
        }
        if(id !== undefined){
            World.setBlock(coords.x, coords.y, coords.z, id, 0);
            toolData.consumeDurability(1);
            toolData.addXp(1);
            toolData.applyHand();
        }
    }

}


TinkersToolHandler.createTool("tcontool_hatchet", "Hatchet", new TinkersHatchet());
ToolForgeHandler.addRecipe(ItemID.tcontool_hatchet, ["rod", "axe", "binding"]);
ToolForgeHandler.addLayout({
    title: "Hatchet",
    background: "tcon.icon.hatchet",
    intro: "The Hatchet chops up wood and makes short work of leaves. It also makes for a passable weapon. Chop chop!",
    slots: [
        {x: -11, y: 11, bitmap: "tcon.slot.rod"},
        {x: -2, y: -20, bitmap: "tcon.slot.axe"},
        {x: 18, y: -8, bitmap: "tcon.slot.binding"}
    ]
});